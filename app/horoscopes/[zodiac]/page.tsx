'use client';

import { useEffect, useState } from 'react';
import { NavBar } from '../../../components/nav-bar';
import { Footer } from '../../../components/footer';
import { Button } from '../../../components/ui/button';
import Link from 'next/link';

interface HoroscopeDetails {
  zodiac: string;
  prediction: string;
  date: string;
  timestamp: string;
}

export default function HoroscopeDetailsPage({
  params,
}: {
  params: { zodiac: string };
}) {
  const [horoscope, setHoroscope] = useState<HoroscopeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main>
        <NavBar />
        <section className="relative py-20 bg-[#1a1b2e]">
          <div className="container relative z-10 mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="mb-4 text-5xl font-bold text-white">
                Daily Horoscope Readings
              </h1>
              <p className="mb-8 text-lg text-gray-300">
                Discover your destiny through the ancient wisdom of the stars
              </p>
              <p className="mb-8 text-gray-300">
                For thousands of years, humans have looked to the stars for
                guidance. Astrology helps us understand ourselves better and
                navigate life's challenges with cosmic insight and wisdom.
              </p>
              <Button className="bg-[#FF7B51] hover:bg-[#ff6b3c]">
                Get Your Reading
              </Button>
            </div>
          </div>
        </section>

        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link href="/horoscopes">
              <Button variant="outline" className="mb-8">
                ← Back to Horoscopes
              </Button>
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-4">Hello</h2>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
