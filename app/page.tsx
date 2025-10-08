import { Metadata } from 'next'
import { NavBar } from "@/components/nav-bar"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { ServicesSection } from "@/components/services-section"
import { FeaturedAstrologers } from "@/components/featured-astrologers"
import { Testimonials } from "@/components/testimonials"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"
import { ReportGeneration } from "@/components/report-generation"
import { FaqSection } from "@/components/faq-section"

export const metadata: Metadata = {
  title: "Free ₹1000 Kundli, Tarot & Astrology Services - Astrokiran",
  description: "Get FREE detailed kundli worth ₹1000, tarot card readings, prashna kundali, palmistry, hastrekha reading, numerology, and kundali milan. Expert astrology consultations via WhatsApp across India.",
  keywords: ["free kundli", "tarot card reading", "prashna kundali", "palmistry", "hastrekha reading", "numerology", "kundali milan", "astrology consultation", "whatsapp astrologer", "detailed horoscope"],
  alternates: {
    canonical: "https://astrokiran.com",
  },
}

export default function Home() {
  return (
    <div className="w-full max-w-full">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="google-site-verification" content="bsao8SV-Yrt9Dh06rZN6WKx86dnPMM_N4srDx2d01BE" />
      <div className="min-h-screen w-full max-w-full overflow-x-hidden">
        <NavBar />
        <main className="w-full max-w-full">
          <HeroSection />
          <ServicesSection />
          <FeaturedAstrologers />
          <ReportGeneration />
          <FaqSection />
          {/* <StatsSection /> */}
          {/* <Testimonials /> */}
          {/* <Newsletter /> */}

          {/* SEO Content Section */}
          <section className="bg-white dark:bg-gray-900 py-16">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Main Content */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      Complete Astrology Services
                    </h2>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                      India's trusted platform for Vedic astrology. Get detailed kundli analysis, daily horoscopes, marriage compatibility, numerology, palmistry, and expert consultations.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      Our Services
                    </h3>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-3">
                        <span className="text-orange-500 mt-1">•</span>
                        <span><strong>Free Kundli:</strong> Complete birth chart with planetary positions (₹1000 value)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-orange-500 mt-1">•</span>
                        <span><strong>Daily Horoscope:</strong> Predictions for career, love, health, and finance</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-orange-500 mt-1">•</span>
                        <span><strong>Kundli Matching:</strong> Gun milan for marriage compatibility</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-orange-500 mt-1">•</span>
                        <span><strong>Numerology:</strong> Life path and destiny number analysis</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-orange-500 mt-1">•</span>
                        <span><strong>Palmistry:</strong> Ancient palm reading insights</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-orange-500 mt-1">•</span>
                        <span><strong>WhatsApp Consultation:</strong> Instant guidance from certified astrologers</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Sidebar Content */}
                <div className="space-y-8">
                  <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Today's Insights
                    </h3>
                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                      <p>
                        <strong>Panchang:</strong> Auspicious timings and muhurat
                      </p>
                      <p>
                        <strong>Rashi Predictions:</strong> Daily forecasts for all zodiac signs
                      </p>
                      <p>
                        <strong>Planetary Movements:</strong> Current transit effects
                      </p>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Why Choose Us?
                    </h3>
                    <div className="space-y-3 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-3">
                        <span className="text-orange-500">✓</span>
                        <span>40,000+ satisfied users</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-orange-500">✓</span>
                        <span>10+ years experience</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-orange-500">✓</span>
                        <span>Authentic Vedic astrology</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-orange-500">✓</span>
                        <span>Hindi & English support</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-orange-500">✓</span>
                        <span>From ₹51 only</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-orange-500">✓</span>
                        <span>100% confidential</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Popular Astrology Topics
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span>• Love Calculator</span>
                      <span>• Marriage Matching</span>
                      <span>• Career Guidance</span>
                      <span>• Health Predictions</span>
                      <span>• Financial Astrology</span>
                      <span>• Remedial Measures</span>
                      <span>• Gemstone Suggestions</span>
                      <span>• Muhurat Consultation</span>
                      <span>• Vastu Guidance</span>
                      <span>• Spiritual Counseling</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Content */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Numerology
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Life path analysis and lucky numbers for your destiny and success.
                  </p>
                </div>
                <div className="text-center p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Panchang & Muhurat
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Auspicious timings for events, ceremonies, and new beginnings.
                  </p>
                </div>
                <div className="text-center p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Daily Horoscope
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Accurate predictions for all zodiac signs every day.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  )
}