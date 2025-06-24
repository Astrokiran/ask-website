// app/api/send-report/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// --- Environment Variables ---
// These are sourced from your hosting environment (e.g., AWS Amplify).
const S3_BUCKET_NAME = 'astrokiran-public-bucket';
const AWS_REGION = process.env.WEBSITE_CLOUD_REGION;
// const AWS_ACCESS_KEY_ID = process.env.WEBSITE_CLOUD_ACCESS_KEY_ID;
// const AWS_SECRET_ACCESS_KEY = process.env.WEBSITE_CLOUD_SECRET_ACCESS_KEY;

// Base URL for the external service that sends the WhatsApp message.
const EXTERNAL_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_ASTROKIRAN_API_BASE_URL;
const EXTERNAL_BACKEND_TEMPLATE_ENDPOINT = "/horoscope/internal/wa/send-media-template";

// --- AWS S3 Client Initialization with Validation ---
// A function to create and validate the S3 client. This keeps the global scope clean
// and allows for a single point of failure if configuration is missing.
function createS3Client() {
    // if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    //     console.error("FATAL SERVER ERROR: S3 environment variables are not configured.");
    //     // This error will be thrown when the server starts, preventing it from running
    //     // in a misconfigured state.
    //     throw new Error("S3 Configuration is incomplete. The server cannot start.");
    // }

    // Because of the check above, TypeScript knows these are strings
    return new S3Client({
        region: AWS_REGION,
        // credentials: {
        //     accessKeyId: AWS_ACCESS_KEY_ID,
        //     secretAccessKey: AWS_SECRET_ACCESS_KEY,
        // },
    });
}

// Initialize the client. This will throw an error on startup if vars are missing.
const s3Client = createS3Client();

/**
 * Defines the expected shape of the request body for sending a report.
 */
interface SendReportRequestBody {
    phoneNumber: string;
    s3Key: string;
    userName: string;
    pdfFileName: string;
}

/**
 * API endpoint to generate a presigned S3 URL and forward it to an external
 * service to send a report via WhatsApp.
 */
export async function POST(req: NextRequest) {
    try {
        // --- 1. Validate Environment Configuration ---
        // This check ensures the external API URL is also configured.
        if (!S3_BUCKET_NAME || !EXTERNAL_BACKEND_BASE_URL) {
            console.error("Server Configuration Error: S3_BUCKET_NAME or NEXT_PUBLIC_ASTROKIRAN_API_BASE_URL is missing.");
            return NextResponse.json(
                { message: 'Server-side configuration error. Please contact support.' },
                { status: 500 }
            );
        }

        // --- 2. Authenticate and Validate Incoming Request ---
        const accessToken = req.headers.get('Authorization')?.split(' ')[1];
        if (!accessToken) {
            console.error('Unauthorized: Access token missing in request headers.');
            return NextResponse.json({ message: 'Unauthorized: Access token required.' }, { status: 401 });
        }

        const body: SendReportRequestBody = await req.json();
        const { phoneNumber, s3Key, userName, pdfFileName } = body;

        if (!phoneNumber || !s3Key || !userName || !pdfFileName) {
            console.error('Bad Request: Missing required parameters in request body.', body);
            return NextResponse.json(
                { message: 'Bad Request: Missing required parameters. Ensure phoneNumber, s3Key, userName, and pdfFileName are provided.' },
                { status: 400 }
            );
        }

        // --- 3. Generate Presigned S3 URL ---
        const command = new GetObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: s3Key,
        });
        const signedPdfUrl = await getSignedUrl(s3Client, command, { expiresIn: 3000 });

        // --- 4. Trim URL for External Backend ---
        const urlPrefixToTrim = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/`;
        let trimmedSignedUrlPart: string;

        if (signedPdfUrl.startsWith(urlPrefixToTrim)) {
            trimmedSignedUrlPart = signedPdfUrl.substring(urlPrefixToTrim.length);
        } else {
            console.warn("[Next.js API] Generated signed URL does not have the expected prefix. Sending full URL as a fallback.");
            trimmedSignedUrlPart = signedPdfUrl;
        }

        // --- 5. Forward Request to External WhatsApp Service ---
        const payloadForExternalBackend = {
            name: userName,
            link: trimmedSignedUrlPart,
        };
        const externalBackendFullUrl = `${EXTERNAL_BACKEND_BASE_URL}${EXTERNAL_BACKEND_TEMPLATE_ENDPOINT}?phone_number=${phoneNumber}`;

        console.log(`[Next.js API] Forwarding request to: ${externalBackendFullUrl}`);
        const externalBackendResponse = await fetch(externalBackendFullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payloadForExternalBackend)
        });

        const externalBackendResponseBody = await externalBackendResponse.text();

        // --- 6. Process Response from External Service ---
        if (!externalBackendResponse.ok) {
            console.error(`[Next.js API] External Backend Error (Status: ${externalBackendResponse.status}):`, externalBackendResponseBody);
            return NextResponse.json(
                { success: false, message: `External backend error: ${externalBackendResponse.statusText}`, details: externalBackendResponseBody },
                { status: externalBackendResponse.status }
            );
        }
        
        let responseData = JSON.parse(externalBackendResponseBody);

        // --- 7. Return Success to Client ---
        return NextResponse.json(
            { success: true, message: 'Request successfully forwarded.', externalBackendResponse: responseData },
            { status: 200 }
        );

    } catch (error) {
        console.error("A critical error occurred in the send-report API route:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected internal server error occurred.';
        return NextResponse.json(
            { success: false, message: `An unexpected error occurred: ${errorMessage}` },
            { status: 500 }
        );
    }
}
