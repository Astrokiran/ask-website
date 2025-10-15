// file: app/guides/page.tsx

"use client"; // <-- This is crucial for using hooks like useState

import { useState, useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { NavBar } from "@/components/nav-bar"
import { GuideCard } from '@/components/guides/GuideCard'; // Adjust the import path
import type { Guide } from '@/types/guide'; // Import the type

const GUIDES_API_URL = 'https://devazstg.astrokiran.com/auth/api/v1/public/guide/all';

export default function GuidesListPage() {
    // Typed state: guides is an array of Guide objects
    const [guides, setGuides] = useState<Guide[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const response = await fetch(GUIDES_API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                
                if (data.success && Array.isArray(data.data.guides)) {
                    setGuides(data.data.guides);
                } else {
                     throw new Error('API response format is incorrect.');
                }

            } catch (err: any) {
                console.error("Failed to fetch guides:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGuides();
    }, []); // Empty dependency array means this effect runs once on mount

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">Error fetching guides: {error}</div>;
    }

    return (
        <div className="min-h-screen">
        <NavBar />
        
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">Our Expert Astrologers</h1>
            {guides.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {guides.map((guide) => (
                        <GuideCard key={guide.id} guide={guide} />
                    ))}
                </div>
            ) : (
                <p>No guides available at the moment.</p>
            )}
        </div>
        </div>
    );
};