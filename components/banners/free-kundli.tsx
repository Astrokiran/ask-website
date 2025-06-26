'use client'; 

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export const FreeKundliCtaSection = () => {
    const router = useRouter();

    const handleRedirect = () => {
        router.push('/free-kundli');
    };

    return (
        // The main section container with the new orange gradient background
        <section className="bg-gradient-to-r from-orange-500 to-red-500 py-12 sm:py-16 px-6">
            <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight shadow-sm">
                    Have Questions About Your Cosmic Path?
                </h2>

                <p className="text-lg text-white/90 mb-8 max-w-2xl">
                    Our free Kundli generator provides detailed insights into your life. Create unlimited reports to explore your destiny and understand the planetary influences shaping your future.
                </p>
                
                {/* Redesigned button to match the "Chat on WhatsApp" style */}
                <button
                    onClick={handleRedirect}
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-white font-bold text-orange-600 rounded-lg shadow-md transform transition-transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50"
                >
                    Generate Your Free Kundli
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
            </div>
        </section>
    );
};