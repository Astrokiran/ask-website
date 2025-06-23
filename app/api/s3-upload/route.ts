import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

export async function POST(request: NextRequest) {
  try {
    if (!S3_BUCKET_NAME || !AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      console.error("Server-side AWS S3 environment variables are not properly configured.");
      return NextResponse.json(
        { message: 'Server configuration error for S3. Please contact support.' },
        { status: 500 }
      );
    }

    const { s3Key, contentType, expiresInSeconds = 6000 } = await request.json(); 

    if (!s3Key || !contentType) {
      return NextResponse.json({ message: 'S3 key and contentType are required.' }, { status: 400 });
    }

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
      ContentType: contentType, 
      ACL: 'private', 
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expiresInSeconds, // URL will be valid for this duration
    });

    // console.log(`Generated pre-signed URL for S3 key: ${s3Key}`);
    
    return NextResponse.json({ presignedUrl });

  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return NextResponse.json(
      { message: 'Failed to generate pre-signed URL.', error: (error as Error).message },
      { status: 500 }
    );
  }
}