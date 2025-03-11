import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Downloads a PDF file from a URL, handling browser security and popup blockers
 * @param pdfUrl - The URL of the PDF to download
 * @param filename - The name to save the file as
 * @returns Promise that resolves when download is initiated
 */
export async function downloadPDF(pdfUrl: string, filename: string): Promise<void> {
  try {
    // Fetch the PDF file as a blob
    const response = await fetch(pdfUrl);
    if (!response.ok) throw new Error('Failed to fetch PDF');

    const blob = await response.blob();

    // Create a blob URL for the PDF
    const blobUrl = window.URL.createObjectURL(blob);

    // Create temporary link element
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);

  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Failed to download PDF');
  }
}
