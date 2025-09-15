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
      <div className="absolute top-10 left-10 w-6 h-6 bg-red-500 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-20 right-20 w-4 h-4 bg-orange-500 rounded-full animate-bounce opacity-50"></div>
      <div className="absolute bottom-20 left-20 w-5 h-5 bg-yellow-500 rounded-full animate-ping opacity-40"></div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* SALE Header with Badges */}
        <div className="text-center mb-16 relative">
          {/* BIG SALE Badge */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">
            🔥 LIMITED TIME OFFER 🔥
          </div>

          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg animate-bounce">
              💰 SAVE ₹1000
            </div>
            <div className="bg-green-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
              ✨ 100% FREE
            </div>
          </div>

          <h2 className="text-4xl lg:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              GET YOUR COMPLETE
            </span>
          </h2>
          <h3 className="text-3xl lg:text-5xl font-black bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent mb-6">
            DETAILED KUNDLI REPORT
          </h3>

          {/* Price Section */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="text-4xl font-black text-red-600 line-through opacity-75">₹1000</div>
            <div className="text-6xl font-black text-green-600 animate-pulse">FREE!</div>
          </div>

          <div className="flex justify-center">
            <div className="h-2 w-32 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            {/* Rainbow Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 via-yellow-500/20 to-green-500/20 rounded-3xl blur-xl opacity-60 animate-pulse"></div>

            {/* SALE Content Card */}
            <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-8 rounded-3xl border-4 border-dashed border-red-500 shadow-2xl">
              {/* FREE Banner */}
              <div className="absolute -top-4 -right-4 bg-red-600 text-white px-6 py-3 rounded-full font-black text-xl shadow-lg animate-bounce rotate-12">
                FREE! 🎁
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-xl flex items-center justify-center animate-pulse">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-foreground">WORTH ₹1000 - ABSOLUTELY FREE!</h3>
                  <p className="text-red-600 font-bold">⚡ No Hidden Charges!</p>
                </div>
              </div>

              <p className="text-lg font-semibold text-foreground mb-6 leading-relaxed">
                Get your complete detailed kundli report worth ₹1000 absolutely FREE! Includes Vedic birth chart, planetary positions, doshas, yogas, and personalized astrological predictions.
              </p>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border-2 border-yellow-300 mb-8">
                <h4 className="font-bold text-lg mb-3 text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  🎯 What You Get (Worth ₹1000):
                </h4>
                <ul className="space-y-2">
                  {[
                    "✅ Complete Vedic Birth Chart Analysis",
                    "✅ Detailed Planetary Positions & Effects",
                    "✅ Dosha Analysis (Mangal, Kaal Sarpa, etc.)",
                    "✅ Beneficial Yogas & Their Impact",
                    "✅ Personalized Astrological Predictions",
                    "✅ Career, Health & Relationship Insights"
                  ].map((item, index) => (
                    <li key={item} className="flex items-center text-yellow-800 dark:text-yellow-200 font-semibold">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/free-kundli">
                <Button className="w-full group bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:to-emerald-800 text-white font-black text-xl px-8 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 animate-pulse">
                  <Gift className="w-6 h-6" />
                  CLAIM YOUR FREE KUNDLI NOW!
                  <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
                </Button>
              </Link>

              <p className="text-center text-sm text-red-600 font-bold mt-4 animate-pulse">
                🔥 Hurry! Limited Time Offer - Grab It Before It's Gone!
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Sale Badge Overlay */}
            <div className="absolute -top-8 -right-8 bg-red-600 text-white px-6 py-4 rounded-full font-black text-2xl shadow-2xl z-20 animate-pulse">
              SALE!
            </div>

            <div className="relative h-[400px] rounded-3xl overflow-hidden border-4 border-dashed border-orange-500 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10"></div>
              <img
                src="/report.png"
                alt="Free Kundli Report Sample"
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
              />

              {/* Multiple Floating Badges */}
              <div className="absolute top-4 left-4 bg-green-600 text-white rounded-full px-3 py-2 shadow-lg z-10 animate-bounce">
                <p className="text-xs font-black flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  100% FREE
                </p>
              </div>

              <div className="absolute bottom-4 right-4 bg-orange-600 text-white rounded-full px-3 py-2 shadow-lg z-10">
                <p className="text-xs font-black">
                  Worth ₹1000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}