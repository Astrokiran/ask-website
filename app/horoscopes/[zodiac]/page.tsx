import { notFound } from "next/navigation";
import { HoroscopeViewer } from "@/components/daily-horoscope/HoroscopeViewer"; 
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
  horoscope: HoroscopeDetails;
};
type HoroscopePageProps = {
  params: {
    zodiac: string;
  };
};

// --- Data Fetching Function ---
async function getHoroscopeForSign(sign: string): Promise<ApiResponse | null> {
const apiBaseUrl = process.env.NEXT_PUBLIC_HOROSCOPE_API_URL;
  if (!apiBaseUrl) {
    console.error("HOROSCOPE_API_URL environment variable is not set.");
    return null;
  }
  console.log("the next public horoscope url",apiBaseUrl)
  const apiUrl = `${apiBaseUrl}/api/v1/kundali/horoscope/daily/${sign}`;
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
  const initialData = await getHoroscopeForSign(zodiac);

  if (!initialData) {
    notFound();
  }

  return <HoroscopeViewer initialData={initialData} />;
}