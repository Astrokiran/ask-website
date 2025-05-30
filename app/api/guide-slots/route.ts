import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const guideId = searchParams.get('guide_id'); // For admins to query specific guide
    const startDate = searchParams.get('start_date'); // YYYY-MM-DD
    const endDate = searchParams.get('end_date');     // YYYY-MM-DD
    const isBooked = searchParams.get('is_booked');   // true/false

    const djangoApiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000";
    
    const query = new URLSearchParams();
    if (guideId) query.append('guide_id', guideId);
    if (startDate) query.append('start_date', startDate);
    if (endDate) query.append('end_date', endDate);
    if (isBooked !== null) query.append('is_booked', isBooked);

    const fetchUrl = `${djangoApiUrl}/api/guides/slots/${query.toString() ? '?' + query.toString() : ''}`;

    try {
        const response = await fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // Or configure caching as needed
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: `Backend API error: ${response.status}` }));
            console.error('Backend API error fetching slots:', errorData);
            throw new Error(errorData.detail || `Failed to fetch slots. Status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error in Next.js API route fetching slots:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json(
            { error: 'Failed to fetch availability slots from backend', details: errorMessage },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const djangoApiUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000";
    const fetchUrl = `${djangoApiUrl}/api/guides/slots/bulk-create/`;

    try {
        const body = await request.json(); // Expects an array of slot objects

        const response = await fetch(fetchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error('Backend API error creating slots:', responseData);
            // Pass through the backend's error message and status if possible
            return NextResponse.json(responseData, { status: response.status });
        }

        return NextResponse.json(responseData, { status: response.status });

    } catch (error) {
        console.error('Error in Next.js API route creating slots:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json(
            { error: 'Failed to create availability slots via backend', details: errorMessage },
            { status: 500 }
        );
    }
}