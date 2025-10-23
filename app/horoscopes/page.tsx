import { Metadata } from 'next'
import { Footer } from "@/components/footer"
import { NavBar } from "@/components/nav-bar"
import { ZodiacSignGrid } from "@/components/daily-horoscope/zodiac-sign-grid"
import { LanguageSelector } from '@/components/ui/language-selector'
import { HoroscopesPageClient } from './HoroscopesPageClient'

export const metadata: Metadata = {
  title: "Daily Horoscope - Rashi Predictions for All Signs",
  description: "Read your daily horoscope predictions for all 12 zodiac signs. Get accurate rashi forecasts, love, career, and health predictions updated daily by expert astrologers.",
  keywords: ["daily horoscope", "horoscopes", "rashi predictions", "zodiac signs", "astrology predictions", "horoscope today", "free horoscopes", "daily horoscope reading"],
  alternates: {
    canonical: "https://astrokiran.com/horoscopes",
  },
}

export default function HoroscopesPage() {
  return (
    <div>
      <main>
        <NavBar />
        <HoroscopesPageClient />
      </main>
      <Footer />
    </div>
  );
}
