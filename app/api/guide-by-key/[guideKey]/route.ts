// /home/chay/Web/ask-website/app/api/guide-by-key/[guideKey]/route.ts
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { guideKey: string } }
) {
  const { guideKey } = params;

  if (!guideKey) {
    return NextResponse.json({ error: 'Guide key is required in path' }, { status: 400 });
  }

  const djangoApiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL;
  if (!djangoApiUrl) {
    console.error("CRITICAL: NEXT_PUBLIC_DJANGO_API_URL environment variable is not set.");
    return NextResponse.json({ error: 'API configuration error on server' }, { status: 500 });
  }

  try {
    const backendUrl = `${djangoApiUrl}/api/guides/validate-key/${guideKey}/`;
    console.log(`Proxying to Django: ${backendUrl}`);

    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      console.error(`Django backend error: ${backendResponse.status}`, data);
      return NextResponse.json(
        { error: data.error || data.detail || 'Failed to validate guide key (from backend)' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data, { status: backendResponse.status });

  } catch (error) {
    let errorMessage = 'Internal server error while contacting backend API';
    if (error instanceof Error) {
      console.error('Error proxying to Django API:', error.message, error.stack);
      errorMessage = `Failed to connect to backend: ${error.message}`; // More specific
    } else {
      console.error('Unknown error proxying to Django API:', error);
    }
    // Return the more specific error message if available
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
