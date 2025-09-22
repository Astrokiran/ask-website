import { NextRequest, NextResponse } from 'next/server';

// reCAPTCHA Enterprise configuration
const PROJECT_ID = 'dev-astrokiran-user-app';
const API_KEY = process.env.GOOGLE_CLOUD_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

interface RecaptchaRequest {
  token: string;
  expectedAction: string;
  siteKey: string;
}

interface RecaptchaResponse {
  success: boolean;
  score?: number;
  error?: string;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { token, expectedAction, siteKey }: RecaptchaRequest = await request.json();

    if (!token || !expectedAction || !siteKey) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    if (!API_KEY) {
      console.error('RECAPTCHA_API_KEY environment variable is not set');
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA verification service not configured' },
        { status: 500 }
      );
    }

    // Prepare the assessment request according to reCAPTCHA Enterprise API spec
    const requestBody = {
      assessment: {
        event: {
          token: token,
          siteKey: siteKey,
        }
      }
    };

    // Call Google reCAPTCHA Enterprise API
    const response = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/${PROJECT_ID}/assessments?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('reCAPTCHA API error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA verification failed' },
        { status: 500 }
      );
    }

    const result = await response.json();

    // Check if the token is valid
    if (!result.tokenProperties?.valid) {
      const invalidReason = result.tokenProperties?.invalidReason || 'Unknown reason';
      console.log(`reCAPTCHA token invalid: ${invalidReason}`);
      return NextResponse.json({
        success: false,
        error: `Invalid reCAPTCHA token: ${invalidReason}`
      });
    }

    // Check if the expected action was executed
    const actualAction = result.tokenProperties?.action;
    if (actualAction !== expectedAction) {
      console.log(`Action mismatch. Expected: ${expectedAction}, Actual: ${actualAction}`);
      return NextResponse.json({
        success: false,
        error: 'Action mismatch in reCAPTCHA verification'
      });
    }

    // Get the risk score
    const score = result.riskAnalysis?.score || 0;
    const reasons = result.riskAnalysis?.reasons || [];

    // Log the assessment results
    console.log(`reCAPTCHA score: ${score}`);
    if (reasons.length > 0) {
      console.log('Risk reasons:', reasons);
    }

    // Define score threshold (you can adjust this based on your requirements)
    const SCORE_THRESHOLD = 0.5;

    if (score < SCORE_THRESHOLD) {
      return NextResponse.json({
        success: false,
        score: score,
        error: `reCAPTCHA score too low: ${score}. Possible bot activity detected.`
      });
    }

    return NextResponse.json({
      success: true,
      score: score,
      action: actualAction
    });

  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during reCAPTCHA verification' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}