import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Call your backend API to get the list of astrologers
        const response = await fetch(
            `${process.env.BACKEND_API_URL}/api/guides/`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any authentication headers if needed
                },
                cache: 'no-store',
                next: { revalidate: 3600 }, // Revalidate every hour
            }
        );

        if (!response.ok) {
            throw new Error(`Backend API error: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching astrologers:', error);

        // Return mock data for development if the API is not available
        if (process.env.NODE_ENV === 'development') {
            return NextResponse.json([
                {
                    id: "ABC123",
                    name: "John Doe",
                    specialties: ["Vedic Astrology", "Tarot Reading"],
                    rating: 4.8
                },
                {
                    id: "DEF456",
                    name: "Jane Smith",
                    specialties: ["Western Astrology", "Numerology"],
                    rating: 4.6
                },
                {
                    id: "GHI789",
                    name: "Robert Johnson",
                    specialties: ["Chinese Astrology", "Palm Reading"],
                    rating: 4.9
                }
            ]);
        }

        return NextResponse.json(
            { error: 'Failed to fetch astrologers' },
            { status: 500 }
        );
    }
} 