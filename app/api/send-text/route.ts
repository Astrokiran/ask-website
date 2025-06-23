// app/api/send-text-message/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// IMPORTANT: Adjust the import path to point to your actual whatsapp.service.ts file
// Based on your current structure:
import { whatsappClient } from '../../../lib/Whatsapp.service'; 

// Define the expected structure of the request body for type safety
interface SendTextMessageRequestBody {
    phoneNumber: string; // The customer's phone number for WhatsApp
    message: string;     // The text content of the message
}

// This function handles POST requests to /api/send-text-message
export async function POST(req: NextRequest) {
    try {
        const body: SendTextMessageRequestBody = await req.json();
        const { phoneNumber, message } = body;

        // 1. Validate incoming request parameters from the frontend
        if (!phoneNumber || !message) {
            console.error('Bad Request: Missing required parameters.', { phoneNumber, message });
            return NextResponse.json(
                { message: 'Bad Request: Missing required parameters. Ensure phoneNumber and message are provided.' },
                { status: 400 }
            );
        }

        // 2. Call the WhatsApp service to send the text message
        // The whatsappClient.sendTextMessage will handle authentication and phone number formatting internally.
        const result = await whatsappClient.sendTextMessage(
            phoneNumber, // The recipient's phone number
            message      // The text content of the message
        );
        
        console.log("WhatsApp Text API Response:", result);

        // 3. Return a successful response to the frontend
        return NextResponse.json(
            { success: true, message: 'Text message sent via WhatsApp successfully.', whatsappResponse: result }, 
            { status: 200 }
        );

    } catch (error) {
        // 4. Handle any unexpected errors that occur during the process
        console.error("Failed to process request and send WhatsApp text message due to an unexpected error:", error);
        
        const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred.';
        return NextResponse.json(
            { success: false, message: `An error occurred: ${errorMessage}` },
            { status: 500 }
        );
    }
}