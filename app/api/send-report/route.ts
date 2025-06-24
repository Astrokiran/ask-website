// app/api/send-report/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// S3 imports remain here as signed URL generation is done in this route
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID || '', 
    secretAccessKey: AWS_SECRET_ACCESS_KEY || '',
  },
});

// --- UPDATED ENVIRONMENT VARIABLES ---
// Set this in your .env.local: NEXT_PUBLIC_ASTROKIRAN_API_BASE_URL=https://appdev.astrokiran.com/horoscope
const EXTERNAL_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ASTROKIRAN_API_BASE_URL;
const EXTERNAL_BACKEND_TEMPLATE_ENDPOINT = "/horoscope/internal/wa/send-media-template";

// REMOVE THIS ENVIRONMENT VARIABLE if your external backend authenticates via accessToken
// const YOUR_BACKEND_PLATFORM_TOKEN = process.env.YOUR_BACKEND_PLATFORM_TOKEN; 

interface SendReportRequestBody {
    phoneNumber: string; 
    s3Key: string;         
    userName: string;      
    pdfFileName: string;   
}

export async function POST(req: NextRequest) {
    try {
        // Retrieve the user's accessToken from the incoming request headers
        const accessToken = req.headers.get('Authorization')?.split(' ')[1]; 
        if (!accessToken) {
            console.error('Unauthorized: Access token missing in request headers.');
            return NextResponse.json({ message: 'Unauthorized: Access token required.' }, { status: 401 });
        }

        const body: SendReportRequestBody = await req.json();
        const { phoneNumber, s3Key, userName, pdfFileName } = body;

        // 1. Basic validation of incoming payload
        if (!phoneNumber || !s3Key || !userName || !pdfFileName) {
            console.error('Bad Request: Missing required parameters.', { phoneNumber, s3Key, userName, pdfFileName });
            return NextResponse.json(
                { message: 'Bad Request: Missing required parameters. Ensure phoneNumber, s3Key, userName, and pdfFileName are provided.' },
                { status: 400 }
            );
        }

        // 2. Validate S3 environment variables
        if (!S3_BUCKET_NAME || !AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
            console.error("Server Error: AWS S3 environment variables are not properly configured.");
            return NextResponse.json(
                { message: 'Server-side S3 configuration error. Please contact support.' },
                { status: 500 }
            );
        }

        // 3. Validate the external backend URL
        if (!EXTERNAL_BACKEND_BASE_URL) {
            console.error("Server Error: External backend base URL (NEXT_PUBLIC_ASTROKIRAN_API_BASE_URL) is not configured.");
            return NextResponse.json(
                { message: 'Server-side external API configuration error. Please contact support.' },
                { status: 500 }
            );
        }
        // Removed YOUR_BACKEND_PLATFORM_TOKEN validation here as user's accessToken is used.

        // 4. Generate the full signed S3 URL
        let signedPdfUrl: string;
        try {
            const command = new GetObjectCommand({
                Bucket: S3_BUCKET_NAME,
                Key: s3Key,
            });
            signedPdfUrl = await getSignedUrl(s3Client, command, { expiresIn: 3000 }); 
            console.log(`[Next.js API] Generated Full Signed URL: ${signedPdfUrl}`);
        } catch (s3Error) {
            console.error(`Error generating signed URL for S3 key '${s3Key}':`, s3Error);
            return NextResponse.json(
                { success: false, message: 'Failed to generate a secure PDF download link from S3.' },
                { status: 500 }
            );
        }

        // --- CRITICAL: TRIM THE URL HERE BEFORE SENDING TO EXTERNAL BACKEND ---
        // This prefix comes directly from the template's URL (including the leading space)
        const templateBaseUrlPrefix = ' https://astrokiran-public-bucket.s3.ap-south-1.amazonaws.com/';

        let trimmedSignedUrlPart: string = signedPdfUrl;

        // Ensure robust trimming for the prefix
        if (signedPdfUrl.startsWith(templateBaseUrlPrefix.trim())) {
            trimmedSignedUrlPart = signedPdfUrl.substring(templateBaseUrlPrefix.trim().length);
        } else if (signedPdfUrl.startsWith(templateBaseUrlPrefix)) {
            // Check with the exact string including the leading space
            trimmedSignedUrlPart = signedPdfUrl.substring(templateBaseUrlPrefix.length);
        } else {
            // Fallback: If it doesn't start with the expected prefix, it might already be trimmed,
            // or the prefix has changed. Log a warning and proceed with the original signed URL.
            console.warn("[Next.js API] Signed URL does not start with expected template base prefix. Sending full URL part as is. Check template configuration.");
            // If it's not trimmed, and shouldn't be, then trimmedSignedUrlPart should remain signedPdfUrl
            // For now, if the trimming failed, we'll keep the original as a safety.
            trimmedSignedUrlPart = signedPdfUrl;
        }
        
        console.log(`[Next.js API] Trimmed URL part for backend: ${trimmedSignedUrlPart}`);

        // 5. Prepare the payload to send to the external backend
        // This matches the `name` and `link` fields in your working curl's --data body
        const payloadForExternalBackend = {
            name: userName, 
            link: trimmedSignedUrlPart // <--- Send the TRIMMED URL PART here
        };

        // Construct the full URL for the external backend, including the phone_number query parameter
        const externalBackendFullUrl = `${EXTERNAL_BACKEND_BASE_URL}${EXTERNAL_BACKEND_TEMPLATE_ENDPOINT}?phone_number=${phoneNumber}`;

        console.log("[Next.js API] Forwarding request to external WhatsApp backend:", externalBackendFullUrl, "with payload:", JSON.stringify(payloadForExternalBackend, null, 2));

        // 6. Forward the request to your external backend API
        const externalBackendResponse = await fetch(externalBackendFullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // This 'Authorization' header will carry the user's accessToken to your backend
                'Authorization': `Bearer ${accessToken}`, 
            },
            body: JSON.stringify(payloadForExternalBackend)
        });

        const externalBackendResponseBody = await externalBackendResponse.text();
        console.log(`[Next.js API] Raw External Backend Response (Status: ${externalBackendResponse.status}):`, externalBackendResponseBody);

        // 7. Handle response from the external backend
        if (!externalBackendResponse.ok) {
            let errorData = null;
            try {
                errorData = JSON.parse(externalBackendResponseBody);
            } catch (e) {
                console.warn("[Next.js API] External backend error response was not JSON:", externalBackendResponseBody);
            }
            console.error(`[Next.js API] External Backend Error Details (${externalBackendResponse.status}):`, errorData || externalBackendResponseBody);
            
            return NextResponse.json(
                { 
                    success: false, 
                    message: `External WhatsApp backend error: ${externalBackendResponse.status} - ${errorData?.message || externalBackendResponseBody || "Unknown error from external backend."}` 
                },
                { status: externalBackendResponse.status || 500 } 
            );
        }

        const successData = JSON.parse(externalBackendResponseBody);
        console.log("[Next.js API] External Backend Success Data:", successData);

        // 8. Return success response to the client
        return NextResponse.json(
            { success: true, message: 'Request successfully forwarded to external WhatsApp backend.', externalBackendResponse: successData }, 
            { status: 200 }
        );

    } catch (error) {
        console.error("Failed to process request (initial error/forwarding to backend):", error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected internal server error occurred.';
        return NextResponse.json(
            { success: false, message: `An unexpected error occurred: ${errorMessage}` },
            { status: 500 }
        );
    }
}