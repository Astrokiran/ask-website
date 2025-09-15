"use client"

import KundliPage from '@/components/kundli/kundli-fom'

export default function KundliRoutePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic Sale Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/80 via-orange-50/60 to-yellow-50/40 dark:from-red-950/40 dark:via-orange-950/30 dark:to-yellow-950/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.15)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.08)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(251,146,60,0.12)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_80%,rgba(251,146,60,0.06)_0%,transparent_50%)]"></div>

      {/* Animated Floating Elements */}
      <div className="absolute top-4 left-4 sm:top-10 sm:left-10 w-4 h-4 sm:w-6 sm:h-6 bg-red-500 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-8 right-4 sm:top-20 sm:right-20 w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full animate-bounce opacity-50"></div>
      <div className="absolute bottom-8 left-4 sm:bottom-20 sm:left-20 w-3 h-3 sm:w-5 sm:h-5 bg-yellow-500 rounded-full animate-ping opacity-40"></div>

      <div className="relative">
        <div className="container mx-auto px-4 py-12">
          {/* SALE Header Section */}
          <div className="text-center mb-6 relative pt-8 sm:pt-12">
            {/* BIG SALE Badge */}
            {/* <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg animate-pulse">
              🔥 LIMITED TIME OFFER 🔥
            </div> */}

            {/* <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-4 mt-4 sm:mt-6">
              <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full font-bold text-sm sm:text-lg shadow-lg animate-bounce">
                💰 SAVE ₹1000
              </div>
              <div className="bg-green-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full font-bold text-sm sm:text-lg shadow-lg">
                ✨ 100% FREE
              </div>
            </div> */}

            <h1 className="text-xl sm:text-2xl lg:text-4xl font-black mb-2 sm:mb-3 px-2">
              <span className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                GET YOUR COMPLETE
              </span>
            </h1>
            <h2 className="text-lg sm:text-xl lg:text-3xl font-black bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
              DETAILED KUNDLI REPORT
            </h2>

            {/* Price Section */}
            <div className="flex justify-center items-center gap-2 sm:gap-4 mb-4">
              <div className="text-xl sm:text-2xl font-black text-red-600 line-through opacity-75">₹1000</div>
              <div className="text-2xl sm:text-4xl font-black text-green-600 animate-pulse">FREE!</div>
            </div>

            {/* Sale Description */}
            <div className="max-w-4xl mx-auto bg-yellow-50 dark:bg-yellow-900/20 p-3 sm:p-4 rounded-xl border-4 border-dashed border-yellow-400 mb-4 sm:mb-6">
              <p className="text-sm sm:text-xl font-bold text-yellow-800 dark:text-yellow-200 leading-relaxed">
                Get your complete detailed kundli report worth ₹1000 absolutely FREE! Includes Vedic birth chart, planetary positions, doshas, yogas, and personalized astrological predictions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mt-3 sm:mt-4">
                <div className="space-y-1 sm:space-y-2">
                  <p className="font-semibold text-yellow-800 dark:text-yellow-200 text-xs sm:text-sm">✅ Complete Vedic Birth Chart Analysis</p>
                  <p className="font-semibold text-yellow-800 dark:text-yellow-200 text-xs sm:text-sm">✅ Detailed Planetary Positions & Effects</p>
                  <p className="font-semibold text-yellow-800 dark:text-yellow-200 text-xs sm:text-sm">✅ Dosha Analysis (Mangal, Kaal Sarpa, etc.)</p>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <p className="font-semibold text-yellow-800 dark:text-yellow-200 text-xs sm:text-sm">✅ Beneficial Yogas & Their Impact</p>
                  <p className="font-semibold text-yellow-800 dark:text-yellow-200 text-xs sm:text-sm">✅ Personalized Astrological Predictions</p>
                  <p className="font-semibold text-yellow-800 dark:text-yellow-200 text-xs sm:text-sm">✅ Career, Health & Relationship Insights</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-2 w-32 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full animate-pulse"></div>
            </div>

            <p className="text-red-600 font-black text-sm sm:text-lg mt-4 animate-pulse px-2">
              🔥 Hurry! Fill the form below to claim your FREE ₹1000 Kundli Report!
            </p>
          </div>
        </div>
        <KundliPage />
      </div>
    </div>
  );
}