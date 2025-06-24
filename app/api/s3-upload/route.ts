import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// --- Environment Variables ---
const S3_BUCKET_NAME = process.env.WEBSITE_S3_BUCKET_NAME;
const AWS_REGION = process.env.WEBSITE_CLOUD_REGION;
// const AWS_ACCESS_KEY_ID = process.env.WEBSITE_CLOUD_ACCESS_KEY_ID;
// const AWS_SECRET_ACCESS_KEY = process.env.WEBSITE_CLOUD_SECRET_ACCESS_KEY;

function createS3Client() {
    // if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    //     console.error("FATAL SERVER ERROR: S3 client environment variables are not configured.");
    //     console.error("Please ensure WEBSITE_CLOUD_REGION, WEBSITE_CLOUD_ACCESS_KEY_ID, and WEBSITE_CLOUD_SECRET_ACCESS_KEY are set.");
    //     throw new Error("S3 Configuration is incomplete. The server cannot start.");
    // }

    // Because the check above throws an error, TypeScript knows these
    // variables must be strings at this point.
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
 * API endpoint to generate a presigned URL for uploading a file to S3.
 */
export async function POST(request: NextRequest) {
    try {
        // 1. Validate the bucket name is configured for this specific request
        if (!S3_BUCKET_NAME) {
            console.error("Server Configuration Error: S3_BUCKET_NAME is not configured.");
            return NextResponse.json(
                { message: 'Server-side S3 configuration error. Please contact support.' },
                { status: 500 }
            );
        }

        // 2. Parse request body for the S3 key and content type
        const { s3Key, contentType, expiresInSeconds = 3600 } = await request.json(); // Default to 1 hour

        if (!s3Key || !contentType) {
            return NextResponse.json({ message: 's3Key and contentType are required in the request body.' }, { status: 400 });
        }

        // 3. Create the command for a presigned PUT URL
        const command = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: s3Key,
            ContentType: contentType,
        });

        // 4. Generate the presigned URL
        const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: expiresInSeconds,
        });

        console.log(`Generated presigned upload URL for S3 key: ${s3Key}`);
        
        // 5. Return the URL to the client
        return NextResponse.json({ presignedUrl });

    } catch (error) {
        console.error('Error generating presigned upload URL:', error);
        return NextResponse.json(
            { message: 'Failed to generate presigned URL.', error: (error as Error).message },
            { status: 500 }
        );
    }
}
