import { NextResponse } from 'next/server';

interface Params {
  guideKey: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
  const { guideKey } = params;

  if (!guideKey) {
    return NextResponse.json({ error: 'Guide key is required' }, { status: 400 });
  }

  const djangoApiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000";
  const fetchUrl = `${djangoApiUrl}/api/guides/validate-booking-key/${guideKey}/`;

  try {
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error(`Error fetching guide details for key ${guideKey}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to validate guide key', details: errorMessage }, { status: 500 });
  }
}