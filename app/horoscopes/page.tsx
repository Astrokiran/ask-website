import { Metadata } from 'next'
import { Footer } from "@/components/footer"
import { NavBar } from "@/components/nav-bar"
import { ZodiacSignGrid } from "@/components/daily-horoscope/zodiac-sign-grid"
import { DailyHoroscopeCta } from "@/components/banners/Daily-horoscope"

export const metadata: Metadata = {
  title: "Daily Horoscope - Rashi Predictions for All Signs",
  description: "Read your daily horoscope predictions for all 12 zodiac signs. Get accurate rashi forecasts, love, career, and health predictions updated daily by expert astrologers.",
  keywords: ["daily horoscope", "rashi predictions", "zodiac signs", "astrology predictions", "horoscope today"],
  alternates: {
    canonical: "https://astrokiran.com/horoscopes",
  },
}

export default function HoroscopesPage() {
  return (
    <div>
      <main>
        <NavBar />
        <div className="container mx-auto px-4 py-4 sm:py-6">
          {/* Header Section */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4">
              Daily Horoscope - Today's Rashi Predictions
            </h1>
          </div>

          {/* Main Component - Zodiac Grid moved to top */}
          <div className="mb-8 sm:mb-12">
            <DailyHoroscopeCta phoneNumber={"918197503574"}/>
            <ZodiacSignGrid/>
          </div>

          {/* Enhanced Content Section moved below */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                Get your daily horoscope and zodiac predictions. Accurate forecasts for love, career, health, and finance updated every day.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8">
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">Why Read Daily Horoscopes?</h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Daily horoscopes provide valuable insights into your day ahead based on planetary movements and cosmic energies. Our expert astrologers analyze the positions of celestial bodies to bring you accurate predictions for all 12 zodiac signs.
                </p>
                <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Gain clarity on important decisions</li>
                  <li>Understand favorable and challenging periods</li>
                  <li>Prepare for opportunities and obstacles</li>
                  <li>Enhance your spiritual awareness</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">What Makes Our Predictions Special?</h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Our horoscope predictions are crafted by experienced Vedic astrologers who combine ancient wisdom with modern astronomical calculations. Each prediction considers the unique planetary transits affecting your zodiac sign.
                </p>
                <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Based on authentic Vedic astrology principles</li>
                  <li>Updated daily with fresh cosmic insights</li>
                  <li>Covers love, career, health, and finance</li>
                  <li>Personalized guidance for better life decisions</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-white">Understanding Your Zodiac Sign</h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed text-center mb-6">
                Each zodiac sign is influenced by specific planetary rulers and elements. Understanding your sign's characteristics helps you make the most of daily horoscope predictions. Whether you're an ambitious Aries, a practical Taurus, or a mysterious Scorpio, our daily forecasts are tailored to your sign's unique traits and cosmic influences.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Fire Signs</h3>
                  <p className="text-gray-600 dark:text-gray-400">Aries, Leo, Sagittarius - Dynamic, passionate, and energetic</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Water Signs</h3>
                  <p className="text-gray-600 dark:text-gray-400">Cancer, Scorpio, Pisces - Emotional, intuitive, and compassionate</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Earth Signs</h3>
                  <p className="text-gray-600 dark:text-gray-400">Taurus, Virgo, Capricorn - Practical, reliable, and grounded</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
