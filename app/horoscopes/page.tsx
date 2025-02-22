"use client";

import { useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/nav-bar";
import { HeroSection } from "@/components/hero-section";
import { ZodiacSignGrid } from "@/components/zodiac-sign-grid";
import { Button } from "@/components/ui/button";
import { useHoroscopeStore } from "@/store/horoscope";

interface Horoscope {
  zodiac: string;
  prediction: string;
  date: string;
  timestamp: string;
}

export default function HoroscopesPage() {
  // const [horoscopes, setHoroscopes] = useState<Horoscope[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const { horoscopes, loading, error, fetchHoroscopes } = useHoroscopeStore()

  useEffect(() => {
    fetchHoroscopes();
  }, [fetchHoroscopes]);


  const renderContent = () => {
    if (loading) {
      return <div className="text-center mb-12">Loading horoscopes...</div>;
    }

    if (error) {
      return <div className="text-center text-red-500">{error}</div>;
    }

    return <ZodiacSignGrid horoscopes={horoscopes} />;
  };

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
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}
