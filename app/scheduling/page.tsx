"use client";

import { useState, useEffect } from "react";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { ScheduleHeader } from "@/components/scheduling/schedule-header";
import Link from "next/link";

interface Astrologer {
    id: string;
    name: string;
    specialties: string[];
    rating: number;
}

export default function SchedulingPage() {
    const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAstrologers = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/astrologers');

                if (!response.ok) {
                    throw new Error('Failed to fetch astrologers');
                }

                const data = await response.json();
                setAstrologers(data);
            } catch (error) {
                console.error('Error fetching astrologers:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAstrologers();
    }, []);

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            <NavBar />

            <ScheduleHeader />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Choose an Astrologer</h1>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-lg">Loading astrologers...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {astrologers.map((astrologer) => (
                            <Link
                                key={astrologer.id}
                                href={`/scheduling/${astrologer.id}`}
                                className="block"
                            >
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                    <h2 className="text-xl font-semibold mb-2">{astrologer.name}</h2>
                                    <div className="flex items-center mb-3">
                                        <span className="text-yellow-500">★</span>
                                        <span className="ml-1">{astrologer.rating.toFixed(1)}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {astrologer.specialties.map((specialty, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                            >
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-4 text-blue-600 font-medium">
                                        View Availability →
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
} 