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
        {/* <DailyHoroscopeCta phoneNumber={"918197503574"}/> */}
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
                      Complete Astrology Services - Your Cosmic Journey Starts Here
                    </h2>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                      Discover the profound wisdom of Vedic astrology with India's most trusted platform. Our comprehensive astrology services include detailed kundli analysis, daily horoscope predictions, kundli matching for marriage compatibility, numerology calculations, palmistry readings, and personalized consultations with expert astrologers.
                    </p>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                      Whether you're seeking guidance about today's kanya rashi predictions, need a comprehensive numerology calculation, or want to understand your makar rashi forecast, our certified astrologers provide authentic insights based on ancient Vedic principles. Get accurate predictions for all zodiac signs including detailed analysis for tula rashi, meen rashi, and other astrological signs.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      Expert Astrological Services Available 24/7
                    </h3>
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-3">
                        <span className="text-orange-500 mt-1">•</span>
                        <span><strong>Free Kundli Generation:</strong> Get your complete birth chart analysis worth ₹1000 absolutely free with detailed planetary positions and life predictions</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-orange-500 mt-1">•</span>
                        <span><strong>Daily Horoscope & Rashifal:</strong> Accurate daily predictions for all 12 zodiac signs including career, love, health, and financial guidance</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-orange-500 mt-1">•</span>
                        <span><strong>Kundli Matching & Marriage Compatibility:</strong> Comprehensive gun milan and ashtakoot matching for perfect matrimonial alliances</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-orange-500 mt-1">•</span>
                        <span><strong>Numerology & Name Analysis:</strong> Complete numerology calculation including life path numbers, destiny numbers, and lucky number predictions</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-orange-500 mt-1">•</span>
                        <span><strong>Palmistry & Hastrekha Reading:</strong> Detailed palm reading analysis revealing your past, present, and future through ancient palmistry wisdom</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-orange-500 mt-1">•</span>
                        <span><strong>WhatsApp Astrology Consultation:</strong> Instant access to certified astrologers for personalized guidance on love, career, health, and life decisions</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Sidebar Content */}
                <div className="space-y-8">
                  <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Today's Special Astrological Insights
                    </h3>
                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                      <p>
                        <strong>Aaj Ka Panchang:</strong> Stay connected with today's auspicious timings, tithi, nakshatra, and muhurat for important decisions and ceremonies.
                      </p>
                      <p>
                        <strong>Rashi Predictions:</strong> Get detailed forecasts for all zodiac signs including special focus on kanya rashi today, makar rashi predictions, tula rashi guidance, and meen rashi insights.
                      </p>
                      <p>
                        <strong>Planetary Movements:</strong> Understand how current planetary transits affect your personal horoscope and daily life decisions.
                      </p>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950/20 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Why Choose AstroKiran?
                    </h3>
                    <div className="space-y-3 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-3">
                        <span className="text-orange-500">✓</span>
                        <span>40,000+ satisfied WhatsApp users across India</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-orange-500">✓</span>
                        <span>Certified astrologers with 10+ years experience</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-orange-500">✓</span>
                        <span>Authentic Vedic astrology principles</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-orange-500">✓</span>
                        <span>Hindi and English consultation available</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-orange-500">✓</span>
                        <span>Instant consultation starting at just ₹51</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-orange-500">✓</span>
                        <span>100% confidential and secure platform</span>
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

              {/* Additional Content for High-Value Keywords */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Numerology & Name Analysis
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Discover your life path through comprehensive numerology calculation and name analysis. Our name numerology calculator reveals hidden patterns and lucky numbers that influence your destiny and success.
                  </p>
                </div>
                <div className="text-center p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Daily Panchang & Muhurat
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Stay updated with aaj ka panchang featuring today's tithi, nakshatra, yoga, and karana. Find auspicious timing for important events, ceremonies, and new beginnings with our accurate panchang calendar.
                  </p>
                </div>
                <div className="text-center p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Rashi Predictions & Horoscope
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Get personalized predictions for all zodiac signs. Whether you need today's kanya rashi forecast, makar rashi guidance, or tula rashi insights, our expert astrologers provide accurate daily horoscope readings.
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