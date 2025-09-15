import { Button } from "@/components/ui/button";
import { Star, ArrowRight, Sparkles, Gift, Zap } from "lucide-react";
import Link from "next/link";

export function ReportGeneration() {
  return (
    <div className="relative py-16 lg:py-24 overflow-hidden" id="report">
      {/* Dynamic Sale Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/80 via-orange-50/60 to-yellow-50/40 dark:from-red-950/40 dark:via-orange-950/30 dark:to-yellow-950/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.15)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.08)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(251,146,60,0.12)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_80%,rgba(251,146,60,0.06)_0%,transparent_50%)]"></div>

      {/* Animated Floating Elements */}
      <div className="absolute top-4 left-4 sm:top-10 sm:left-10 w-4 h-4 sm:w-6 sm:h-6 bg-red-500 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-8 right-4 sm:top-20 sm:right-20 w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full animate-bounce opacity-50"></div>
      <div className="absolute bottom-8 left-4 sm:bottom-20 sm:left-20 w-3 h-3 sm:w-5 sm:h-5 bg-yellow-500 rounded-full animate-ping opacity-40"></div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4">
        {/* SALE Header with Badges */}
        <div className="text-center mb-8 sm:mb-16 relative">
          {/* BIG SALE Badge */}
          <div className="absolute -top-4 sm:-top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 sm:px-6 py-1 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg animate-pulse">
            🔥 LIMITED TIME OFFER 🔥
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full font-bold text-sm sm:text-lg shadow-lg animate-bounce">
              💰 SAVE ₹1000
            </div>
            <div className="bg-green-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full font-bold text-sm sm:text-lg shadow-lg">
              ✨ 100% FREE
            </div>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black mb-2 sm:mb-4 px-2">
            <span className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              GET YOUR COMPLETE
            </span>
          </h2>
          <h3 className="text-xl sm:text-3xl lg:text-5xl font-black bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent mb-4 sm:mb-6 px-2">
            DETAILED KUNDLI REPORT
          </h3>

          {/* Price Section */}
          <div className="flex justify-center items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="text-2xl sm:text-4xl font-black text-red-600 line-through opacity-75">₹1000</div>
            <div className="text-3xl sm:text-6xl font-black text-green-600 animate-pulse">FREE!</div>
          </div>

          <div className="flex justify-center">
            <div className="h-2 w-32 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 items-center">
          <div className="relative">
            {/* Rainbow Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 via-yellow-500/20 to-green-500/20 rounded-3xl blur-xl opacity-60 animate-pulse"></div>

            {/* SALE Content Card */}
            <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-4 sm:p-8 rounded-3xl border-4 border-dashed border-red-500 shadow-2xl mx-2 sm:mx-0">
              {/* FREE Banner */}
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-red-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-full font-black text-sm sm:text-xl shadow-lg animate-bounce rotate-12">
                FREE! 🎁
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-xl flex items-center justify-center animate-pulse">
                  <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-2xl font-black text-foreground">WORTH ₹1000 - ABSOLUTELY FREE!</h3>
                  <p className="text-red-600 font-bold text-sm sm:text-base">⚡ No Hidden Charges!</p>
                </div>
              </div>

              <p className="text-sm sm:text-lg font-semibold text-foreground mb-4 sm:mb-6 leading-relaxed">
                Get your complete detailed kundli report worth ₹1000 absolutely FREE! Includes Vedic birth chart, planetary positions, doshas, yogas, and personalized astrological predictions.
              </p>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 sm:p-4 rounded-xl border-2 border-yellow-300 mb-4 sm:mb-8">
                <h4 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  🎯 What You Get (Worth ₹1000):
                </h4>
                <ul className="space-y-1 sm:space-y-2">
                  {[
                    "✅ Complete Vedic Birth Chart Analysis",
                    "✅ Detailed Planetary Positions & Effects",
                    "✅ Dosha Analysis (Mangal, Kaal Sarpa, etc.)",
                    "✅ Beneficial Yogas & Their Impact",
                    "✅ Personalized Astrological Predictions",
                    "✅ Career, Health & Relationship Insights"
                  ].map((item, index) => (
                    <li key={item} className="flex items-center text-yellow-800 dark:text-yellow-200 font-semibold text-xs sm:text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/free-kundli">
                <Button className="w-full group bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:to-emerald-800 text-white font-black text-sm sm:text-xl px-4 sm:px-8 py-3 sm:py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 animate-pulse">
                  <Gift className="w-4 h-4 sm:w-6 sm:h-6" />
                  <span className="hidden sm:inline">CLAIM YOUR FREE KUNDLI NOW!</span>
                  <span className="sm:hidden">GET FREE KUNDLI!</span>
                  <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-2" />
                </Button>
              </Link>

              <p className="text-center text-xs sm:text-sm text-red-600 font-bold mt-3 sm:mt-4 animate-pulse">
                🔥 Hurry! Limited Time Offer - Grab It Before It's Gone!
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Sale Badge Overlay */}
            <div className="absolute -top-4 -right-4 sm:-top-8 sm:-right-8 bg-red-600 text-white px-3 sm:px-6 py-2 sm:py-4 rounded-full font-black text-lg sm:text-2xl shadow-2xl z-20 animate-pulse">
              SALE!
            </div>

            <div className="relative h-[300px] sm:h-[400px] rounded-3xl overflow-hidden border-4 border-dashed border-orange-500 shadow-2xl mx-2 sm:mx-0">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10"></div>
              <img
                src="/report.png"
                alt="Free Kundli Report Sample"
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
              />

              {/* Multiple Floating Badges */}
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-green-600 text-white rounded-full px-2 sm:px-3 py-1 sm:py-2 shadow-lg z-10 animate-bounce">
                <p className="text-xs font-black flex items-center gap-1">
                  <Star className="w-2 h-2 sm:w-3 sm:h-3" />
                  <span className="hidden sm:inline">100% FREE</span>
                  <span className="sm:hidden">FREE</span>
                </p>
              </div>

              <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-orange-600 text-white rounded-full px-2 sm:px-3 py-1 sm:py-2 shadow-lg z-10">
                <p className="text-xs font-black">
                  <span className="hidden sm:inline">Worth ₹1000</span>
                  <span className="sm:hidden">₹1000</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}