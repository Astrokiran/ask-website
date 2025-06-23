// report-pdf.tsx

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // Keep for types if needed, but not for direct client use

// Remove getTemporaryS3Credentials as it's no longer needed or secure for direct use.

/**
 * Uploads a PDF Blob to a user-specific folder in an S3 bucket using a pre-signed URL.
 * @param pdfBlob The PDF file content as a Blob.
 * @param s3Key The full S3 object key (path and filename within the bucket).
 * @param userPhoneNumber The phone number of the user (can be used for pathing, but s3Key is primary).
 * @returns {Promise<string>} The public URL of the uploaded file if successful (or the s3Key if you prefer).
 */
export const uploadPdfToS3 = async (
  pdfBlob: Blob,
  s3Key: string, // This is now the full S3 key, e.g., 'kundli-reports/91XXXXXXXXXX/filename.pdf'
  userPhoneNumber: string // Keep for consistency if needed elsewhere, but not directly used for upload here
): Promise<string> => {
  // We no longer need NEXT_PUBLIC_AWS_ACCESS_KEY_ID/SECRET_ACCESS_KEY here.
  // The client side only needs the S3 bucket name and region if constructing a public URL afterwards.
  const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME; // Still need this for constructing the final URL
  const region = process.env.NEXT_PUBLIC_AWS_REGION; // Ensure this is also NEXT_PUBLIC_ for client-side knowledge

  if (!bucketName || !region) {
    throw new Error("S3 bucket name or region is not configured as NEXT_PUBLIC_ environment variables.");
  }

  try {
    // console.log(`Requesting pre-signed URL for S3 key: ${s3Key}`);

    // 1. Request a pre-signed URL from your Next.js API Route (server-side)
    const presignResponse = await fetch('/api/s3-upload', { // Your new API route
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        s3Key: s3Key,
        contentType: 'application/pdf', // Tell the server what type of content to expect
      }),
    });

    if (!presignResponse.ok) {
      const errorData = await presignResponse.json();
      throw new Error(errorData.message || `Failed to get pre-signed URL from API. Status: ${presignResponse.status}`);
    }

    const { presignedUrl } = await presignResponse.json();
    // console.log("Received pre-signed URL.");

    // 2. Upload the PDF Blob directly to S3 using the pre-signed URL
    // This fetch request is made directly to AWS S3, but uses the temporary credentials embedded in the URL.
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT', // Use PUT method for direct upload to pre-signed URL
      headers: {
        'Content-Type': 'application/pdf',
      },
      // **FIX for TypeError: readableStream.getReader is not a function**
      // Ensure pdfBlob is a standard Blob. Using new Blob() can often normalize it.
      body: new Blob([pdfBlob], { type: 'application/pdf' }), // Use a new Blob to ensure compatibility
      // Or if still problematic, convert to ArrayBuffer/Uint8Array:
      // body: await pdfBlob.arrayBuffer(), // If you use arrayBuffer(), ensure Content-Type is correct
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text(); // Get raw error text from S3
      throw new Error(`Direct S3 upload failed. Status: ${uploadResponse.status}. Message: ${errorText}`);
    }

    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;
    // console.log(`Successfully uploaded to S3: ${fileUrl}`);
    return fileUrl; // Or return s3Key if that's what's needed downstream
  } catch (error) {
    console.error("Error during S3 upload process:", error);
    throw new Error(`Failed to upload PDF to S3: ${(error as Error).message}`);
  }
};