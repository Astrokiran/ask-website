import { NextRequest, NextResponse } from 'next/server';

// Add these interfaces at the top of your file
interface Guide {
    id: number;
    unique_id: string;
    name: string;
    phone_number: string;
    skills: string;
    languages: string;
    years_of_experience: number;
}

interface AvailabilitySlot {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface AvailabilityResponse {
    guide: Guide;
    slots: AvailabilitySlot[];
}

interface AvailabilityPostResponse {
    message: string;
    guide: Guide;
    slots: AvailabilitySlot[];
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const astrologerId = searchParams.get('astrologerId');

        if (!astrologerId) {
            return NextResponse.json(
                { error: 'Astrologer ID is required' },
                { status: 400 }
            );
        }

        // Build the URL with only the astrologer ID parameter
        const url = new URL(`${process.env.BACKEND_API_URL}/guides/slots/bulk-create/`);
        url.searchParams.append('guide_id', astrologerId);
        // Remove the date parameter to get all slots

        // Call your backend API to get the astrologer's availability
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add any authentication headers if needed
            },
            cache: 'no-store',
            next: { revalidate: 60 }, // Revalidate every minute
        });

        if (!response.ok) {
            throw new Error(`Backend API error: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching astrologer availability:', error);
        return NextResponse.json(
            { error: 'Failed to fetch astrologer availability' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { guide_id, date, time_slots } = body;

        // Validate required fields
        if (!guide_id) {
            return NextResponse.json(
                { error: 'Guide ID is required' },
                { status: 400 }
            );
        }

        if (!date) {
            return NextResponse.json(
                { error: 'Date is required' },
                { status: 400 }
            );
        }

        if (!time_slots || !Array.isArray(time_slots) || time_slots.length === 0) {
            return NextResponse.json(
                { error: 'Time slots are required and must be a non-empty array' },
                { status: 400 }
            );
        }

        // Call your backend API to register availability slots
        const response = await fetch(
            `${process.env.BACKEND_API_URL}/guides/slots/bulk-create/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any authentication headers if needed
                },
                body: JSON.stringify({
                    guide_id,
                    date,
                    time_slots
                }),
            }
        );

        console.log('Response:', response);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                `Backend API error: ${response.status}${errorData ? ' - ' + JSON.stringify(errorData) : ''}`
            );
        }

        const data: AvailabilityPostResponse = await response.json();

        // You can process the response here if needed
        // For example, you might want to format the message or extract specific information

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error registering availability slots:', error);
        return NextResponse.json(
            { error: 'Failed to register availability slots' },
            { status: 500 }
        );
    }
}

// Add DELETE method to handle slot deletions
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { guide_id, date, time_slots } = body;

        // Validate required fields
        if (!guide_id) {
            return NextResponse.json(
                { error: 'Guide ID is required' },
                { status: 400 }
            );
        }

        if (!date) {
            return NextResponse.json(
                { error: 'Date is required' },
                { status: 400 }
            );
        }

        if (!time_slots || !Array.isArray(time_slots) || time_slots.length === 0) {
            return NextResponse.json(
                { error: 'Time slots are required and must be a non-empty array' },
                { status: 400 }
            );
        }

        // Call your backend API to delete availability slots
        const response = await fetch(
            `${process.env.BACKEND_API_URL}/guides/slots/bulk-delete/`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any authentication headers if needed
                },
                body: JSON.stringify({
                    guide_id,
                    date,
                    time_slots
                }),
            }
        );


        console.log('Response:', response);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                `Backend API error: ${response.status}${errorData ? ' - ' + JSON.stringify(errorData) : ''}`
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error deleting availability slots:', error);
        return NextResponse.json(
            { error: 'Failed to delete availability slots' },
            { status: 500 }
        );
    }
} 