import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function ReportGeneration() {
  return (
    <div className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900" id="report">
      <div className="max-w-7xl mx-auto px-4">
        {/* Clean Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-lg font-medium text-sm mb-6">
            Complimentary Report
          </div>

          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4">
            Get Your Complete Kundli Report
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Detailed astrological analysis including birth chart, planetary positions, and personalized insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            {/* Clean Content Card */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Comprehensive Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400">Complete astrological insights at no cost</p>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Receive a comprehensive kundli report including Vedic birth chart analysis, planetary positions, doshas, yogas, and personalized astrological insights.
              </p>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 mb-8">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What's Included:</h4>
                <ul className="space-y-2">
                  {[
                    "Complete Vedic Birth Chart Analysis",
                    "Detailed Planetary Positions & Effects",
                    "Dosha Analysis (Mangal, Kaal Sarpa, etc.)",
                    "Beneficial Yogas & Their Impact",
                    "Personalized Astrological Predictions",
                    "Career, Health & Relationship Insights"
                  ].map((item, index) => (
                    <li key={item} className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mr-3 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/free-kundli">
                <Button className="w-full group bg-orange-600 hover:bg-orange-700 text-white font-medium text-lg px-8 py-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-3">
                  Generate Your Kundli
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[400px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
              <img
                src="/report.png"
                alt="Kundli Report Sample"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}