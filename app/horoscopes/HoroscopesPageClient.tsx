"use client"

import { Footer } from "@/components/footer"
import { ZodiacSignGrid } from "@/components/daily-horoscope/zodiac-sign-grid"
import { LanguageSelector } from '@/components/ui/language-selector'
import { useTranslation } from 'react-i18next'

export function HoroscopesPageClient() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6">
      {/* Header Section with Language Selector */}
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4">
            {t('horoscope.dailyTitle', 'Daily Horoscope')}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            {t('horoscope.subtitle', 'Read your daily horoscope predictions for all 12 zodiac signs')}
          </p>
        </div>
        <LanguageSelector />
      </div>

      {/* Main Component - Zodiac Grid moved to top */}
      <div className="mb-8 sm:mb-12">
        <ZodiacSignGrid/>
      </div>

      {/* Enhanced Content Section moved below */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Daily predictions for love, career, health, and finance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">Why Daily Horoscopes?</h2>
            <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 space-y-2">
              <li>Clarity on important decisions</li>
              <li>Favorable & challenging periods</li>
              <li>Prepare for opportunities</li>
              <li>Spiritual awareness</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">Our Predictions</h2>
            <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 space-y-2">
              <li>Authentic Vedic astrology</li>
              <li>Updated daily</li>
              <li>Love, career, health & finance</li>
              <li>Personalized guidance</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-white">Zodiac Elements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Fire Signs</h3>
              <p className="text-gray-600 dark:text-gray-400">Aries, Leo, Sagittarius</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Water Signs</h3>
              <p className="text-gray-600 dark:text-gray-400">Cancer, Scorpio, Pisces</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Earth Signs</h3>
              <p className="text-gray-600 dark:text-gray-400">Taurus, Virgo, Capricorn</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}