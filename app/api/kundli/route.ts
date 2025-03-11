import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const response = await fetch('https://askdesk.astrokiran.com/api/consultation/generate-kundli-direct/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const kundliData = await response.json();

        return NextResponse.json(kundliData);
    } catch (error) {
        console.error('Error proxying kundli request:', error);
        return NextResponse.json(
            { error: 'Failed to generate kundli' },
            { status: 500 }
        );
    }
} 