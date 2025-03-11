import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";

export function ReportGeneration() {
  return (
    <div className="relative min-h-[600px] bg-[#1a1b2e] overflow-hidden">
      {/* Decorative gradient arc */}
      <div className="absolute top-0 right-0 w-[600px] h-[300px] bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 blur-3xl opacity-20 rounded-full transform translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-8 items-center relative z-10">
        <div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Generate Your Personal Astrology Report
          </h2>
          <p className="text-gray-300 mb-8">
            Unlock the secrets of your celestial blueprint with our AI-powered
            astrology report generator. Get detailed insights about your:
          </p>
          <ul className="space-y-4 mb-8">
            {[
              "Planetary positions and aspects",
              "House placements and their meanings",
              "Current transits and predictions",
              "Life path and purpose analysis"
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-gray-300">
                <Star className="w-4 h-4 text-orange-500" />
                {item}
              </li>
            ))}
          </ul>
          <Link href="/reports">
            <Button className="bg-orange-500 hover:bg-orange-600 text-lg px-8 py-6 h-auto">
              Generate Your Report Now
            </Button>
          </Link>
        </div>
        <div className="relative h-[400px]">
          <img
            src="/report.png"
            alt="Astrological geometric visualization"
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
