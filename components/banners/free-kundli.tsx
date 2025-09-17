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
        <section className="bg-gray-50 dark:bg-gray-900 py-12 sm:py-16 px-6">
            <div className="max-w-4xl mx-auto text-center flex flex-col items-center">

                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4">
                    Have Questions About Your Future?
                </h2>

                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
                    Our free Kundli generator provides detailed insights into your life. Create unlimited reports to explore your destiny and understand the astrological influences shaping your future.
                </p>

                <button
                    onClick={handleRedirect}
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 font-medium text-white rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-orange-200 dark:focus:ring-orange-800"
                >
                    Generate Your Free Kundli
                    <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
            </div>
        </section>
    );
};