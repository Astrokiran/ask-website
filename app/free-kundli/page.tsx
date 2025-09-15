"use client"

import KundliPage from '@/components/kundli/kundli-fom'

export default function KundliRoutePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Clean Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg font-medium text-sm mb-6">
            Complimentary Report
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 dark:text-white mb-4">
            Get Your Complete Kundli Report
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Receive a comprehensive kundli report including Vedic birth chart, planetary positions, doshas, yogas, and personalized astrological predictions.
          </p>

          {/* Features */}
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">What's Included:</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                  Complete Vedic Birth Chart Analysis
                </p>
                <p className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                  Detailed Planetary Positions & Effects
                </p>
                <p className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                  Dosha Analysis (Mangal, Kaal Sarpa, etc.)
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                  Beneficial Yogas & Their Impact
                </p>
                <p className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                  Personalized Astrological Predictions
                </p>
                <p className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                  Career, Health & Relationship Insights
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Fill the form below to generate your kundli report
          </p>
        </div>

        <div id="kundli-form">
          <KundliPage />
        </div>
      </div>
    </div>
  );
}