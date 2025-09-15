import { Metadata } from 'next'
import { NavBar } from "@/components/nav-bar"
import Pricing from "@/components/pricing"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Astrology Services Pricing - Tarot, Palmistry, Numerology & Consultation Rates",
  description: "Transparent pricing for complete astrology services including FREE ₹1000 kundli, tarot reading, prashna kundali, palmistry, hastrekha, numerology, and WhatsApp consultations across India.",
  keywords: ["astrology pricing", "tarot reading cost", "palmistry rates", "numerology fees", "prashna kundali price", "whatsapp consultation rates", "affordable astrology India"],
  alternates: {
    canonical: "https://astrokiran.com/pricing",
  },
}

export default function PricingPage() {
    return (
        <div className="min-h-screen">
            <NavBar />
            <main>
                {/* Clean Hero Section */}
                <div className="relative bg-gray-50 dark:bg-gray-900 py-16 overflow-hidden">

                    <div className="container mx-auto px-4 relative z-10">
                        {/* Clean badge */}
                        <div className="flex justify-center mb-6">
                            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Transparent & Affordable Pricing</span>
                            </div>
                        </div>

                        {/* Clean title */}
                        <h1 className="text-3xl md:text-5xl font-bold text-center mb-6 leading-tight text-gray-900 dark:text-white">
                            Complete Astrology Services
                            <br />
                            <span className="text-2xl md:text-4xl font-medium text-gray-700 dark:text-gray-300">
                                Pricing & Rates
                            </span>
                        </h1>

                        {/* Clean description */}
                        <div className="max-w-4xl mx-auto text-center mb-8">
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                Discover our transparent and affordable pricing for all astrology services.
                                Get started with your <span className="font-semibold text-blue-600 dark:text-blue-400">FREE ₹1000 kundli</span> and explore our comprehensive range of spiritual guidance.
                            </p>

                            {/* Service highlights */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                                    <div className="font-semibold text-gray-900 dark:text-white">FREE Kundli</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Worth ₹1000</div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                                    <div className="font-semibold text-gray-900 dark:text-white">Tarot Reading</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Expert guidance</div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                                    <div className="font-semibold text-gray-900 dark:text-white">Kundali Milan</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Compatibility</div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                                    <div className="font-semibold text-gray-900 dark:text-white">WhatsApp</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">Instant chat</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Pricing />
            </main>
            <Footer />
        </div>
    )
}