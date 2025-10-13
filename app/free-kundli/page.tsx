"use client"

import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import KundliPage from '@/components/kundli/kundli-fom'
import { useTranslation } from 'react-i18next'
import { LanguageSelector } from '@/components/ui/language-selector'

export default function KundliRoutePage() {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-full">
      <div className="min-h-screen w-full max-w-full overflow-x-hidden">
        <NavBar />
        <main className="w-full max-w-full">
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              {/* Language Selector - Right aligned */}
              <div className="flex justify-end mb-4">
                <LanguageSelector />
              </div>

              {/* Clean Header Section */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm mb-4 sm:mb-6">
                  {t('kundli.complimentaryReport')}
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 dark:text-white mb-4 px-4">
                  {t('kundli.pageTitle')}
                </h1>
              </div>

              <div id="kundli-form" className="mb-8">
                <KundliPage />
              </div>

              {/* Features Section moved below form */}
              <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 text-center">{t('kundli.whatsIncluded')}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2 sm:space-y-3">
                    <p className="flex items-start text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mr-2 sm:mr-3 flex-shrink-0 mt-1.5 sm:mt-1"></div>
                      {t('kundli.birthChartAnalysis')}
                    </p>
                    <p className="flex items-start text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mr-2 sm:mr-3 flex-shrink-0 mt-1.5 sm:mt-1"></div>
                      {t('kundli.planetaryPositions')}
                    </p>
                    <p className="flex items-start text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mr-2 sm:mr-3 flex-shrink-0 mt-1.5 sm:mt-1"></div>
                      {t('kundli.doshaAnalysis')}
                    </p>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <p className="flex items-start text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mr-2 sm:mr-3 flex-shrink-0 mt-1.5 sm:mt-1"></div>
                      {t('kundli.yogasBenefits')}
                    </p>
                    <p className="flex items-start text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mr-2 sm:mr-3 flex-shrink-0 mt-1.5 sm:mt-1"></div>
                      {t('kundli.lifePredictions')}
                    </p>
                    <p className="flex items-start text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full mr-2 sm:mr-3 flex-shrink-0 mt-1.5 sm:mt-1"></div>
                      {t('kundli.careerHealthInsights')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}