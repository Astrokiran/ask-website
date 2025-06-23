// app/api/send-report/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { whatsappClient } from '../../../lib/Whatsapp.service'; 

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

const TEMPLATE_ID_ENV = process.env.NEXT_PUBLIC_TEMPLATE_ID; 
const TEMPLATE_NAME = process.env.NEXT_PUBLIC_TEMPLATE_NAME || "kundli_pdf"; 

interface SendReportRequestBody {
    phoneNumber: string; 
    s3Key: string;         // This is the full S3 object key (e.g., "kundli-reports/phone/file.pdf")
    userName: string;      // Used for body {{1}}
    pdfFileName: string;   // Not directly used in template, but good for context/future
}

export async function POST(req: NextRequest) {
    try {
        const body: SendReportRequestBody = await req.json();
        const { phoneNumber, s3Key, userName, pdfFileName } = body;

        if (!phoneNumber || !s3Key || !userName || !pdfFileName) {
            console.error('Bad Request: Missing required parameters.', { phoneNumber, s3Key, userName, pdfFileName });
            return NextResponse.json(
                { message: 'Bad Request: Missing required parameters. Ensure phoneNumber, s3Key, userName, and pdfFileName are provided.' },
                { status: 400 }
            );
        }

        if (!S3_BUCKET_NAME || !AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
            console.error("Server Error: AWS S3 environment variables are not properly configured.");
            return NextResponse.json(
                { message: 'Server-side S3 configuration error. Please contact support.' },
                { status: 500 }
            );
        }

        if (!TEMPLATE_ID_ENV) { 
            console.error("Server Error: NEXT_PUBLIC_TEMPLATE_ID is not set in environment variables.");
            return NextResponse.json(
                { message: 'Server-side template ID is not configured. Cannot send template message.' },
                { status: 500 }
            );
        }
        
        if (!TEMPLATE_NAME) { 
            console.error("Server Error: NEXT_PUBLIC_TEMPLATE_NAME is not set in environment variables.");
            return NextResponse.json(
                { message: 'Server-side template Name is not configured. Cannot send template message.' },
                { status: 500 }
            );
        }

        // --- RE-GENERATED signedPdfUrl HERE ---
        // We now need the FULL signed URL to pass to the WhatsApp client.
        let signedPdfUrl: string;
        try {
            const command = new GetObjectCommand({
                Bucket: S3_BUCKET_NAME,
                Key: s3Key,
            });
            // Generate a pre-signed URL for GET operation
            signedPdfUrl = await getSignedUrl(s3Client, command, { expiresIn: 3000 }); // URL valid for 50 minutes
            // console.log(`[SERVER] Generated Signed URL for PDF: ${signedPdfUrl}`);
        } catch (s3Error) {
            console.error(`Error generating signed URL for S3 key '${s3Key}':`, s3Error);
            return NextResponse.json(
                { success: false, message: 'Failed to generate a secure PDF download link from S3.' },
                { status: 500 }
            );
        }

        try {
            // Pass the FULL signed URL to the WhatsApp client
            const result = await whatsappClient.sendTemplateMessage( 
                phoneNumber, 
                userName, 
                signedPdfUrl, // <--- CRITICAL CHANGE: Pass the FULL signed URL here
                TEMPLATE_ID_ENV // Pass the raw string from env, the service function will parse
            );
            
            // console.log("WhatsApp API Template Response:", result);

            return NextResponse.json(
                { success: true, message: 'Kundli report template sent via WhatsApp successfully. NOTE: PDF link may have the base URL duplicated if template is not adjusted.', whatsappResponse: result }, 
                { status: 200 }
            );

        } catch (error) {
            console.error("Failed to process request and send WhatsApp template message due to an internal service error:", error);
            const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred during template sending.';
            return NextResponse.json(
                { success: false, message: `An error occurred: ${errorMessage}` },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error("Failed to process request (initial error/validation):", error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected internal server error occurred.';
        return NextResponse.json(
            { success: false, message: `An unexpected error occurred: ${errorMessage}` },
            { status: 500 }
        );
    }
}