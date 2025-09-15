import { Metadata } from 'next'
import { Footer } from "@/components/footer"
import { NavBar } from "@/components/nav-bar"
import { ZodiacSignGrid } from "@/components/daily-horoscope/zodiac-sign-grid"
import { DailyHoroscopeCta } from "@/components/banners/Daily-horoscope"

export const metadata: Metadata = {
  title: "Daily Horoscope Today - Rashi Predictions for All Zodiac Signs",
  description: "Read your daily horoscope predictions for all 12 zodiac signs. Get accurate rashi forecasts, love, career, and health predictions updated daily by expert astrologers.",
  keywords: ["daily horoscope", "rashi predictions", "zodiac signs", "astrology predictions", "horoscope today"],
  alternates: {
    canonical: "https://astrokiran.com/horoscopes",
  },
}

export default function HoroscopesPage() {
  return (
    <div>
      <main>
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-8">
            Daily Horoscope - Today's Rashi Predictions
          </h1>
          <p className="text-lg text-center mb-8 text-gray-600">
            Get your daily horoscope and zodiac predictions. Accurate forecasts for love, career, health, and finance updated every day.
          </p>
        </div>
        <DailyHoroscopeCta phoneNumber={"918197503574"}/>
        <ZodiacSignGrid/>
      </main>
      <Footer />
    </div>
  );
}
