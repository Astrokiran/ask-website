import { Metadata } from 'next'
import { notFound } from "next/navigation";
import { HoroscopeViewer } from "@/components/daily-horoscope/HoroscopeViewer";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { LanguageSelector } from '@/components/ui/language-selector';
import { HoroscopePageClient } from "@/components/daily-horoscope/HoroscopePageClient";

// --- Define API Types (can be in a separate types file) ---
type HoroscopeCategory = {
  narrative: string;
  reason: string;
};
type LuckyInsights = {
  mood: string;
  lucky_color: string;
  lucky_number: number;
  lucky_time: string;
};
type HoroscopeDetails = {
  overview: HoroscopeCategory;
  love_and_relationships: HoroscopeCategory;
  career_and_finance: HoroscopeCategory;
  emotions_and_mind: HoroscopeCategory;
  travel_and_movement: HoroscopeCategory;
  remedies: HoroscopeCategory;
  lucky_insights: LuckyInsights;
};
export type ApiResponse = {
  success: boolean;
  sign: string;
  date: string;
  language: string;
  horoscope: HoroscopeDetails;
};
type HoroscopePageProps = {
  params: {
    zodiac: string;
  };
};

// Generate metadata for each zodiac page
export async function generateMetadata({ params }: HoroscopePageProps): Promise<Metadata> {
  const zodiac = params.zodiac.charAt(0).toUpperCase() + params.zodiac.slice(1);

  return {
    title: `${zodiac} Horoscope Today - Daily Predictions`,
    description: `Get today's ${zodiac} horoscope with accurate daily predictions for love, career, health, and finance. Free daily astrology forecast for ${zodiac} zodiac sign.`,
    keywords: [`${zodiac.toLowerCase()} horoscope`, `${zodiac.toLowerCase()} horoscope today`, `${zodiac.toLowerCase()} daily horoscope`, `${zodiac.toLowerCase()} astrology`, `${zodiac.toLowerCase()} predictions`],
    alternates: {
      canonical: `https://astrokiran.com/horoscopes/${params.zodiac}`,
    },
  }
}

// --- Data Fetching Function ---
async function getHoroscopeForSign(sign: string, language: string = 'en'): Promise<ApiResponse | null> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_HOROSCOPE_API_URL;
  if (!apiBaseUrl) {
    console.error("HOROSCOPE_API_URL environment variable is not set.");
    return null;
  }
  const apiUrl = `${apiBaseUrl}/api/v1/kundali/horoscope/daily/${sign}?language=${language}`;
  try {
    const response = await fetch(apiUrl, { next: { revalidate: 3600 } });
    if (!response.ok) return null;
    const data: ApiResponse = await response.json();
    return data.success ? data : null;
  } catch (error) {
    console.error("Failed to fetch horoscope data:", error);
    return null;
  }
}

// --- The Page Component ---
export default async function ZodiacHoroscopePage({ params }: HoroscopePageProps) {
  const zodiac = params.zodiac.charAt(0).toUpperCase() + params.zodiac.slice(1);

  // Validate zodiac sign
  const validSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  if (!validSigns.includes(zodiac)) {
    notFound();
  }

  const initialData = await getHoroscopeForSign(zodiac);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main>
        <div className="container mx-auto px-4 py-8">
          {/* Header with Language Selector */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-semibold mb-4 text-gray-900 dark:text-white">
                {zodiac} Horoscope Today
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Get accurate daily horoscope predictions for {zodiac}. Today's forecast for love, career, health, finance, and lucky insights.
              </p>
            </div>
            <LanguageSelector />
          </div>
        </div>
        <HoroscopePageClient zodiac={zodiac} initialData={initialData} />
      </main>
      <Footer />
    </div>
  );
}