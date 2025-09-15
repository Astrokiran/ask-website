"use client"

import KundliPage from '@/components/kundli/kundli-fom'

export default function KundliRoutePage() {
  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-6">
          Free ₹1000 Kundli Report - Detailed Birth Chart Analysis
        </h1>
        <p className="text-lg text-center mb-8 text-gray-600">
          Get your complete detailed kundli report worth ₹1000 absolutely FREE! Includes Vedic birth chart, planetary positions, doshas, yogas, and personalized astrological predictions.
        </p>
      </div>
      <KundliPage />
    </div>
  );
}