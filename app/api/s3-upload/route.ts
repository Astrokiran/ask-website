import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// --- Environment Variables ---
const S3_BUCKET_NAME = 'astrokiran-public-bucket';
const AWS_REGION = process.env.WEBSITE_CLOUD_REGION || process.env.AWS_REGION || 'ap-south-1';
const AWS_ACCESS_KEY_ID = process.env.WEBSITE_CLOUD_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.WEBSITE_CLOUD_SECRET_ACCESS_KEY;

function createS3Client() {
    if (!AWS_REGION) {
        console.error("FATAL SERVER ERROR: AWS_REGION is not configured.");
        console.error("Please ensure WEBSITE_CLOUD_REGION environment variable is set.");
        throw new Error("AWS region configuration is incomplete. The server cannot start.");
    }

    console.log(`Initializing S3 client for region: ${AWS_REGION}`);
    console.log(`Target bucket: ${S3_BUCKET_NAME}`);

    // Comprehensive environment variable debugging
    console.log('=== ENVIRONMENT VARIABLE DEBUGGING ===');

    // Log all environment variables that contain AWS, CLOUD, or WEBSITE
    console.log('All AWS/CLOUD/WEBSITE related environment variables:');
    Object.keys(process.env)
        .filter(key => key.includes('AWS') || key.includes('CLOUD') || key.includes('WEBSITE'))
        .forEach(key => {
            const value = process.env[key];
            const displayValue = (key.includes('SECRET') || key.includes('KEY')) ?
                (value ? `SET (${value.length} chars)` : 'NOT SET') : value;
            console.log(`  ${key}: ${displayValue}`);
        });

    // Specific checks for our custom variables
    console.log('\nCustom credential variables:');
    console.log(`  WEBSITE_CLOUD_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID ? `SET (${AWS_ACCESS_KEY_ID.length} chars)` : 'NOT SET'}`);
    console.log(`  WEBSITE_CLOUD_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY ? `SET (${AWS_SECRET_ACCESS_KEY.length} chars)` : 'NOT SET'}`);

    // Show raw values for debugging (first few characters only)
    if (AWS_ACCESS_KEY_ID) {
        console.log(`  ACCESS_KEY preview: ${AWS_ACCESS_KEY_ID.substring(0, 8)}...`);
    }
    if (AWS_SECRET_ACCESS_KEY) {
        console.log(`  SECRET_KEY preview: ${AWS_SECRET_ACCESS_KEY.substring(0, 8)}...`);
    }

    // Log total environment variable count
    console.log(`\nTotal environment variables: ${Object.keys(process.env).length}`);

    console.log('=== END DEBUGGING ===\n');

    // Check if we have explicit credentials
    if (AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY) {
        console.log('✅ Using explicit credentials from WEBSITE_CLOUD_* environment variables');

        return new S3Client({
            region: AWS_REGION,
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY,
            },
        });
    }

    // Fallback: Try standard AWS environment variables
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        console.log('✅ Using standard AWS environment variables');

        return new S3Client({
            region: AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                ...(process.env.AWS_SESSION_TOKEN && { sessionToken: process.env.AWS_SESSION_TOKEN })
            },
        });
    }

    // Final fallback to default credential provider chain
    console.log('⚠️ No explicit credentials found. Using default credential provider chain...');
    return new S3Client({
        region: AWS_REGION,
        // Let AWS SDK use default credential provider chain
    });
}

// Initialize the client. This will throw an error on startup if region is missing.
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

        console.log(`Attempting to generate presigned URL for: ${s3Key} in bucket: ${S3_BUCKET_NAME}`);

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

        console.log(`Successfully generated presigned upload URL for S3 key: ${s3Key}`);

        // 5. Return the URL to the client
        return NextResponse.json({ presignedUrl });

    } catch (error) {
        console.error('Error generating presigned upload URL:', error);

        // Enhanced error logging for debugging
        if (error instanceof Error) {
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }

        return NextResponse.json(
            { message: 'Failed to generate presigned URL.', error: (error as Error).message },
            { status: 500 }
        );
    }
}
