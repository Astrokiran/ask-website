import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js API Route to proxy Exotel webhook events to the backend consultation service
 *
 * This route receives SDK events from the frontend call page and forwards them to:
 * https://<backend-url>/api/v1/webhooks/exotel
 *
 * The backend handles both:
 * 1. Browser SDK events (from this page)
 * 2. PSTN Exotel events (from Exotel infrastructure)
 */

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();

    console.log('[Exotel Webhook Proxy] Received event:', {
      event_type: body.event_type,
      user_id: body.user_id,
      consultation_id: body.consultation_id,
      timestamp: body.timestamp,
    });

    // Backend service URL - configure in environment variable
    const BACKEND_URL = process.env.NEXT_PUBLIC_CONSULTATION_SERVICE_URL || 'https://devazstg.astrokiran.com/auth';

    // Forward the request to the backend service
    const backendUrl = `${BACKEND_URL}/api/v1/webhooks/exotel`;

    console.log('[Exotel Webhook Proxy] Forwarding to:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Get response as text first to handle non-JSON responses
    const responseText = await response.text();

    console.log('[Exotel Webhook Proxy] Backend response status:', response.status);
    console.log('[Exotel Webhook Proxy] Backend response type:', response.headers.get('content-type'));
    console.log('[Exotel Webhook Proxy] Backend response (first 200 chars):', responseText.substring(0, 200));

    // Try to parse as JSON
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch (e) {
      console.warn('[Exotel Webhook Proxy] Backend returned non-JSON response:', responseText.substring(0, 500));
      // Create a fallback response object
      data = {
        status: response.status,
        raw_response: responseText.substring(0, 500),
        note: 'Backend returned non-JSON response'
      };
    }

    if (!response.ok) {
      console.error('[Exotel Webhook Proxy] Backend error:', {
        status: response.status,
        error: data,
      });
      return NextResponse.json(
        { success: false, error: data },
        { status: response.status }
      );
    }

    console.log('[Exotel Webhook Proxy] Event forwarded successfully');

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error('[Exotel Webhook Proxy] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process webhook event',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
