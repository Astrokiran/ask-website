"use client";

import { useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/nav-bar";
import { HeroSection } from "@/components/hero-section";
import { ZodiacSignGrid } from "@/components/zodiac-sign-grid";
import { Button } from "@/components/ui/button";
import { useHoroscopeStore } from "@/store/horoscope";

export default function HoroscopesPage() {
  const { horoscopes, loading, error, fetchHoroscopes, lastFetchDate } = useHoroscopeStore()

  const whatsappNumber = "+918197503574"; // Replace with your actual WhatsApp number
  const message = "Hello, I would like to get an astrology consultation.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];


    // Fetch horoscopes only if it's a new day
    if (lastFetchDate !== today) {
      fetchHoroscopes();
    }
  }, [fetchHoroscopes, lastFetchDate]);

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
          <div className="container relative z-10 max-w-7xl mx-auto px-4 md:py-20">
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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-8">
                <Button
                  className="bg-[#25D366] hover:bg-[#22c35e] text-white font-semibold px-8 py-6 rounded-xl shadow-lg flex items-center gap-2 transition-all duration-200 text-xl"
                  onClick={() => window.open(whatsappLink, '_blank')}
                >
                  Connect on Whatsapp
                  <img
                    src="/social.png"
                    alt="WhatsApp"
                    className="w-10 h-10"
                  />
                </Button>
              </div>
            </div>
          </div>
        </section>
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}
