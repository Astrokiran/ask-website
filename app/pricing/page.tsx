import { Metadata } from 'next'
import { NavBar } from "@/components/nav-bar"
import Pricing from "@/components/pricing"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Astrology Pricing - Kundli, Tarot & Palmistry Rates",
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

                {/* SEO Content Section */}
                <section className="bg-white dark:bg-gray-900 py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                            {/* Main Content */}
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                        Affordable Astrology Services - Complete Pricing Guide
                                    </h2>
                                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                        Discover India's most affordable and transparent pricing for comprehensive astrology services. Our platform offers authentic Vedic astrology consultations, detailed kundli analysis, daily horoscope predictions, numerology calculations, and palmistry readings at prices that make spiritual guidance accessible to everyone across India.
                                    </p>
                                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                        Whether you need today's kanya rashi predictions, comprehensive numerology calculation guidance, or detailed makar rashi forecasts, our certified astrologers provide expert insights at transparent rates. From free kundli generation worth ₹1000 to specialized consultations for tula rashi and meen rashi, we offer complete astrological services without hidden costs.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                        Complete Astrology Service Pricing
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Free Services (₹0)</h4>
                                            <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                                                <li>• Complete Kundli Generation (Worth ₹1000)</li>
                                                <li>• Daily Horoscope for All Rashis</li>
                                                <li>• Basic Numerology Calculator</li>
                                                <li>• Aaj Ka Panchang Updates</li>
                                                <li>• Basic Astrology Articles & Blog Content</li>
                                            </ul>
                                        </div>

                                        <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Premium Consultations</h4>
                                            <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                                                <li>• WhatsApp Astrology Consultation - ₹51 (First Call Special)</li>
                                                <li>• Detailed Kundli Analysis - ₹199</li>
                                                <li>• Kundli Matching & Marriage Compatibility - ₹299</li>
                                                <li>• Complete Numerology Reading - ₹149</li>
                                                <li>• Palmistry & Hastrekha Reading - ₹199</li>
                                                <li>• Career & Business Guidance - ₹249</li>
                                            </ul>
                                        </div>

                                        <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Specialized Readings</h4>
                                            <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                                                <li>• Tarot Card Reading - ₹179</li>
                                                <li>• Prashna Kundali Analysis - ₹229</li>
                                                <li>• Gemstone Recommendation - ₹199</li>
                                                <li>• Vastu Consultation - ₹349</li>
                                                <li>• Muhurat Selection - ₹149</li>
                                                <li>• Remedial Measures Guidance - ₹199</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Content */}
                            <div className="space-y-8">
                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        Why Choose Our Astrology Services?
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-orange-500">✓</span>
                                            <span className="text-gray-700 dark:text-gray-300 text-sm">Most Affordable Rates in India</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-orange-500">✓</span>
                                            <span className="text-gray-700 dark:text-gray-300 text-sm">FREE ₹1000 Worth Kundli Generation</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-orange-500">✓</span>
                                            <span className="text-gray-700 dark:text-gray-300 text-sm">Certified Vedic Astrologers</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-orange-500">✓</span>
                                            <span className="text-gray-700 dark:text-gray-300 text-sm">Instant WhatsApp Consultations</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-orange-500">✓</span>
                                            <span className="text-gray-700 dark:text-gray-300 text-sm">Hindi & English Support</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-orange-500">✓</span>
                                            <span className="text-gray-700 dark:text-gray-300 text-sm">100% Confidential & Secure</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-orange-500">✓</span>
                                            <span className="text-gray-700 dark:text-gray-300 text-sm">Transparent Pricing - No Hidden Costs</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        Popular Service Packages
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <h4 className="font-medium text-gray-900 dark:text-white">Complete Life Analysis</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Kundli + Numerology + Palmistry</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 line-through text-sm">₹547</span>
                                                <span className="font-bold text-green-600">₹399</span>
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <h4 className="font-medium text-gray-900 dark:text-white">Marriage Package</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Kundli Matching + Love Compatibility</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 line-through text-sm">₹498</span>
                                                <span className="font-bold text-green-600">₹349</span>
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <h4 className="font-medium text-gray-900 dark:text-white">Career Guidance</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Career Analysis + Business Timing</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 line-through text-sm">₹398</span>
                                                <span className="font-bold text-green-600">₹299</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        Payment Methods
                                    </h3>
                                    <div className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="text-green-500">💳</span>
                                            <span>UPI Payments (PhonePe, Paytm, Google Pay)</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-green-500">🏦</span>
                                            <span>Net Banking (All Major Banks)</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-green-500">💰</span>
                                            <span>Debit & Credit Cards</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-green-500">📱</span>
                                            <span>Wallet Payments</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            All payments are secure and encrypted. No advance payments required for first consultation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Content for SEO */}
                        <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-16">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                    Transparent Astrology Service Pricing Across India
                                </h2>
                                <p className="text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
                                    We believe in making authentic Vedic astrology accessible to everyone. Our transparent pricing ensures you get the best value for comprehensive astrological guidance, numerology calculations, and spiritual consultations.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="bg-orange-100 dark:bg-orange-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">🎯</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        Value-Based Pricing
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                                        Our astrology service pricing is designed to provide maximum value. Get comprehensive kundli analysis, numerology calculation, and horoscope predictions at the most affordable rates in India.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">🔒</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        Secure Payments
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                                        All payments for astrology consultations, kundli matching, and numerology readings are processed through secure, encrypted payment gateways with multiple payment options.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">🎁</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        Free Services
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                                        Start your astrological journey with our free kundli generation, daily horoscope updates, aaj ka panchang, and basic numerology calculator - all worth ₹1000+ completely free.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12 text-center">
                                <div className="bg-gradient-to-r from-orange-50 to-purple-50 dark:from-orange-950/20 dark:to-purple-950/20 p-8 rounded-lg border border-orange-200 dark:border-orange-800">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        Special Offers & Discounts
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="font-semibold text-orange-600 dark:text-orange-400">First Time Users</div>
                                            <div className="text-gray-600 dark:text-gray-400">50% OFF on first consultation</div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="font-semibold text-purple-600 dark:text-purple-400">Festival Offers</div>
                                            <div className="text-gray-600 dark:text-gray-400">Special rates during festivals</div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="font-semibold text-green-600 dark:text-green-400">Referral Bonus</div>
                                            <div className="text-gray-600 dark:text-gray-400">₹100 credit for each referral</div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="font-semibold text-blue-600 dark:text-blue-400">Student Discount</div>
                                            <div className="text-gray-600 dark:text-gray-400">20% OFF with student ID</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}