import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Call your backend API to get the list of astrologers
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_DJANGO_URL}/api/guides/`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any authentication headers if needed
                },
                next: { revalidate: 3600 }, // Revalidate every hour
            }
        );

        if (!response.ok) {
            // Try to parse backend error message if available
            const errorData = await response.json().catch(() => ({ detail: `Backend API error: ${response.status}` }));
            throw new Error(errorData.detail || `Backend API error: ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format from backend: Expected an array.');
        }
        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching astrologers:', error);

        // Return mock data for development if the API is not available
        if (process.env.NODE_ENV === 'development') {
            return NextResponse.json({ data: [ // Wrap mock data
                    {
                        id: "mock_ABC123",
                        name: "John Doe (Mock)",
                        specialties: ["Vedic Astrology", "Tarot Reading"],
                        rating: 4.8
                    },
                    {
                        id: "mock_DEF456",
                        name: "Jane Smith (Mock)",
                        specialties: ["Western Astrology", "Numerology"],
                        rating: 4.6
                    },
                    {
                        id: "mock_GHI789",
                        name: "Robert Johnson (Mock)",
                        specialties: ["Chinese Astrology", "Palm Reading"],
                        rating: 4.9
                    }
                ]
            });
        }
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
} 