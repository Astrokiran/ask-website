
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; 
/**
 * @param pdfBlob The PDF file content as a Blob.
 * @param s3Key The full S3 object key (path and filename within the bucket).
 * @param userPhoneNumber The phone number of the user (can be used for pathing, but s3Key is primary).
 * @returns {Promise<string>} The public URL of the uploaded file if successful (or the s3Key if you prefer).
 */
export const uploadPdfToS3 = async (
  pdfBlob: Blob,
  s3Key: string, 
  userPhoneNumber: string 
): Promise<string> => {
  const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
  const region = process.env.NEXT_PUBLIC_AWS_REGION; 

  if (!bucketName || !region) {
    throw new Error("S3 bucket name or region is not configured as NEXT_PUBLIC_ environment variables.");
  }

  try {
    // console.log(`Requesting pre-signed URL for S3 key: ${s3Key}`);

    const presignResponse = await fetch('/api/s3-upload', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        s3Key: s3Key,
        contentType: 'application/pdf', 
      }),
    });

    if (!presignResponse.ok) {
      const errorData = await presignResponse.json();
      throw new Error(errorData.message || `Failed to get pre-signed URL from API. Status: ${presignResponse.status}`);
    }

    const { presignedUrl } = await presignResponse.json();
    // console.log("Received pre-signed URL.");

    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/pdf',
      },
      body: new Blob([pdfBlob], { type: 'application/pdf' }), // Use a new Blob to ensure compatibility
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text(); // Get raw error text from S3
      throw new Error(`Direct S3 upload failed. Status: ${uploadResponse.status}. Message: ${errorText}`);
    }

    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;
    return fileUrl; // Or return s3Key if that's what's needed downstream
  } catch (error) {
    console.error("Error during S3 upload process:", error);
    throw new Error(`Failed to upload PDF to S3: ${(error as Error).message}`);
  }
};