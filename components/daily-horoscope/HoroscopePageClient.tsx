"use client";

import React, { useState, useEffect } from 'react';
import { useLanguageStore } from '@/stores/languageStore';
import { HoroscopeViewer } from './HoroscopeViewer';
import { LoadingScreen } from "@/components/banners/LoadingScreen";

// Re-use the same types from the parent page
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

type ApiResponse = {
  success: boolean;
  sign: string;
  date: string;
  language: string;
  horoscope: HoroscopeDetails;
};

interface HoroscopePageClientProps {
  zodiac: string;
  initialData: ApiResponse | null;
}

export function HoroscopePageClient({ zodiac, initialData }: HoroscopePageClientProps) {
  const { language } = useLanguageStore();
  const [horoscopeData, setHoroscopeData] = useState<ApiResponse | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch horoscope data when language changes
  useEffect(() => {
    const fetchHoroscopeData = async () => {
      if (!zodiac) return;

      setIsLoading(true);
      setError(null);

      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_HOROSCOPE_API_URL;
        if (!apiBaseUrl) {
          throw new Error("API URL not configured");
        }

        const apiUrl = `${apiBaseUrl}/api/v1/kundali/horoscope/daily/${zodiac}?language=${language}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const data: ApiResponse = await response.json();

        if (data.success) {
          setHoroscopeData(data);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err) {
        console.error("Error fetching horoscope:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch horoscope data");

        // Keep initial data if available and it's in the correct language
        if (initialData && initialData.language === language) {
          setHoroscopeData(initialData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoroscopeData();
  }, [zodiac, language, initialData]);

  // Show loading state
  if (isLoading && !horoscopeData) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingScreen />
      </div>
    );
  }

  // Show error state
  if (error && !horoscopeData) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show data if available
  if (horoscopeData) {
    return (
      <div className="relative">
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 py-2">
            <div className="flex justify-center items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'hi' ? 'राशिफल अपडेट हो रहा है...' : 'Updating horoscope...'}
              </span>
            </div>
          </div>
        )}
        <HoroscopeViewer
          initialData={horoscopeData}
          zodiacSign={zodiac}
          currentLanguage={language}
        />
      </div>
    );
  }

  return null;
}