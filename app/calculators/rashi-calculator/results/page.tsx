"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Moon, ArrowLeft, Calendar, MapPin, Clock, Sparkles, BookOpen, Calculator, Heart } from 'lucide-react'
import Link from 'next/link'

interface RashiResult {
  success: boolean
  name: string
  birth_info: {
    date_of_birth: string
    time_of_birth: string
    place_of_birth: string
  }
  rashi: {
    sign: string
    sanskrit_name: string
    rashi_lord: string
    element: string
    quality: string
    lucky_gem: string
    moon_degree: number
    moon_degree_dms: string
  }
  nakshatra: {
    name: string
    pada: number
    lord: string
  }
}

export default function RashiResults() {
  const router = useRouter()
  const [result, setResult] = useState<RashiResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedResult = sessionStorage.getItem('rashiCalculatorResult')
    if (storedResult) {
      setResult(JSON.parse(storedResult))
    } else {
      router.push('/calculators/rashi-calculator')
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4 sm:pt-6 md:pt-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl">
          {/* Back Button */}
          <Link
            href="/calculators/rashi-calculator"
            className="inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Calculate Again
          </Link>

          {/* Results Section */}
          <div className="mb-8 space-y-6">
            {/* Main Result Card */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-xl shadow-lg border-2 border-teal-200 dark:border-teal-800 p-6 sm:p-8">
              <div className="text-center">
                <Moon className="w-20 h-20 mx-auto text-teal-500 mb-6" />
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  {result.name}'s Rashi
                </h1>
                <div className="text-7xl sm:text-8xl font-bold text-teal-600 dark:text-teal-400 mb-4">
                  {result.rashi.sign}
                </div>
                <p className="text-2xl text-gray-700 dark:text-gray-300 mb-2">
                  {result.rashi.sanskrit_name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Moon at {result.rashi.moon_degree_dms}
                </p>
              </div>
            </div>

            {/* Birth Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-teal-600" />
                Birth Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{result.birth_info.date_of_birth}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Time of Birth</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{result.birth_info.time_of_birth}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Place of Birth</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{result.birth_info.place_of_birth}</p>
                </div>
              </div>
            </div>

            {/* Rashi Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Rashi Lord</h3>
                <p className="text-lg text-teal-600 dark:text-teal-400 font-medium">{result.rashi.rashi_lord}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Element</h3>
                <p className="text-lg text-teal-600 dark:text-teal-400 font-medium">{result.rashi.element}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quality</h3>
                <p className="text-lg text-teal-600 dark:text-teal-400 font-medium">{result.rashi.quality}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lucky Gem</h3>
                <p className="text-lg text-teal-600 dark:text-teal-400 font-medium">{result.rashi.lucky_gem}</p>
              </div>
            </div>

            {/* Nakshatra Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-teal-600" />
                Nakshatra Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nakshatra</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{result.nakshatra.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pada</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{result.nakshatra.pada}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nakshatra Lord</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{result.nakshatra.lord}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Educational Content Section */}
          <div className="space-y-8 mb-8">
            {/* What is Rashi */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <div className="flex items-start mb-4">
                <BookOpen className="w-6 h-6 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    What is Rashi (Moon Sign)?
                  </h2>
                  <div className="space-y-4 text-gray-600 dark:text-gray-400 text-justify leading-relaxed">
                    <p>
                      <strong className="text-gray-900 dark:text-white">Rashi</strong>, also known as the Moon Sign, is one of the most important concepts in Vedic astrology. It represents the zodiac sign where the Moon was positioned at the exact moment of your birth. Unlike Western astrology which primarily focuses on the Sun sign, Vedic astrology places greater emphasis on the Rashi because the Moon governs the mind, emotions, and inner self.
                    </p>
                    <p>
                      Your Rashi reveals your emotional nature, mental patterns, instinctive reactions, and subconscious mind. It influences how you think, feel, and respond to different situations in life. The Moon changes signs approximately every 2.5 days, making your exact birth time crucial for accurate Rashi calculation.
                    </p>
                    <p>
                      There are 12 Rashi signs in Vedic astrology, each spanning 30 degrees of the zodiac: Mesha (Aries), Vrishabha (Taurus), Mithuna (Gemini), Karka (Cancer), Simha (Leo), Kanya (Virgo), Tula (Libra), Vrishchika (Scorpio), Dhanu (Sagittarius), Makara (Capricorn), Kumbha (Aquarius), and Meena (Pisces).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How is it Calculated */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <div className="flex items-start mb-4">
                <Calculator className="w-6 h-6 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    How is Your Rashi Calculated?
                  </h2>
                  <div className="space-y-4 text-gray-600 dark:text-gray-400 text-justify leading-relaxed">
                    <p>
                      Your Rashi is calculated using precise astronomical and astrological principles based on your birth details:
                    </p>
                    <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 border-l-4 border-teal-600">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Required Information:</h3>
                      <ul className="space-y-2 list-disc list-inside">
                        <li><strong>Date of Birth:</strong> Your exact birth date determines the Moon's approximate position</li>
                        <li><strong>Time of Birth:</strong> Crucial because the Moon moves approximately 13 degrees per day (about 0.5 degrees per hour)</li>
                        <li><strong>Place of Birth:</strong> Used to calculate the geographic coordinates and timezone for accurate positioning</li>
                      </ul>
                    </div>
                    <p>
                      The calculation process involves:
                    </p>
                    <ol className="space-y-2 list-decimal list-inside ml-4">
                      <li><strong>Geographic Conversion:</strong> Your birthplace is converted into precise latitude and longitude coordinates</li>
                      <li><strong>Timezone Adjustment:</strong> The birth time is adjusted to Universal Time (UT) based on your timezone</li>
                      <li><strong>Moon Position:</strong> Using Vedic astronomical calculations, the Moon's exact position in the sidereal zodiac is determined</li>
                      <li><strong>Rashi Determination:</strong> The zodiac is divided into 12 equal signs of 30 degrees each. Your Rashi is identified based on which sign the Moon occupied at your birth</li>
                      <li><strong>Nakshatra Identification:</strong> The Moon's position is further refined to identify your birth Nakshatra (lunar mansion) and Pada (quarter)</li>
                    </ol>
                    <p className="text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mt-4">
                      <strong>Example:</strong> In your case, the Moon was at {result.rashi.moon_degree_dms} in {result.rashi.sign} ({result.rashi.sanskrit_name}) at the time of your birth, placing you in the {result.nakshatra.name} Nakshatra, Pada {result.nakshatra.pada}.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How is it Used */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <div className="flex items-start mb-4">
                <Sparkles className="w-6 h-6 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    How is Rashi Used in Vedic Astrology?
                  </h2>
                  <div className="space-y-4 text-gray-600 dark:text-gray-400 text-justify leading-relaxed">
                    <p>
                      Your Rashi serves as a foundational element in various astrological practices and predictions:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🔮 Personality Analysis</h4>
                        <p className="text-sm">Reveals your emotional nature, mental makeup, and innate behavioral patterns</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💑 Kundli Matching</h4>
                        <p className="text-sm">Essential for marriage compatibility (Gun Milan) in Hindu tradition</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">⏰ Dasha Periods</h4>
                        <p className="text-sm">Determines your Vimshottari Dasha sequence and planetary periods</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📅 Muhurta Selection</h4>
                        <p className="text-sm">Used to identify auspicious times for important life events</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💎 Gemstone Recommendations</h4>
                        <p className="text-sm">Guides the selection of beneficial gemstones based on your Rashi lord</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🌟 Life Predictions</h4>
                        <p className="text-sm">Forms the basis for predicting career, health, relationships, and fortune</p>
                      </div>
                    </div>
                    <p>
                      Astrologers also use your Rashi to determine your ruling planet (Rashi Lord), which influences various aspects of your life. In your case, <strong className="text-gray-900 dark:text-white">{result.rashi.rashi_lord}</strong> is your Rashi Lord, and understanding this planet's position and strength in your birth chart provides deeper insights into your life path.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Does it Matter */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <div className="flex items-start mb-4">
                <Heart className="w-6 h-6 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Why Does Your Rashi Matter?
                  </h2>
                  <div className="space-y-4 text-gray-600 dark:text-gray-400 text-justify leading-relaxed">
                    <p>
                      Understanding your Rashi provides valuable insights into multiple dimensions of your life:
                    </p>
                    <div className="space-y-4 mt-4">
                      <div className="border-l-4 border-teal-600 pl-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Self-Understanding & Personal Growth</h4>
                        <p className="text-sm">
                          Your Rashi reveals your emotional patterns, strengths, and weaknesses. This self-awareness helps you make better decisions, understand your reactions, and work on personal development.
                        </p>
                      </div>
                      <div className="border-l-4 border-teal-600 pl-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Relationship Compatibility</h4>
                        <p className="text-sm">
                          In Vedic tradition, Rashi matching (Guna Milan) is crucial before marriage. It helps assess emotional compatibility, mental harmony, and potential challenges in a relationship.
                        </p>
                      </div>
                      <div className="border-l-4 border-teal-600 pl-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Career & Life Decisions</h4>
                        <p className="text-sm">
                          Your Rashi influences your natural inclinations, talents, and career preferences. Understanding these can guide you toward fulfilling career paths and life choices.
                        </p>
                      </div>
                      <div className="border-l-4 border-teal-600 pl-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Health & Wellbeing</h4>
                        <p className="text-sm">
                          Each Rashi is associated with specific body parts and health tendencies. This knowledge can help you take preventive measures and maintain better health.
                        </p>
                      </div>
                      <div className="border-l-4 border-teal-600 pl-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Spiritual Connection</h4>
                        <p className="text-sm">
                          Your Rashi connects you to ancient Vedic wisdom and helps you understand your place in the cosmic order. It can guide spiritual practices and personal remedies.
                        </p>
                      </div>
                      <div className="border-l-4 border-teal-600 pl-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Timing of Events</h4>
                        <p className="text-sm">
                          Through Dasha systems and transits, your Rashi helps astrologers predict favorable and challenging periods in your life, allowing for better preparation and planning.
                        </p>
                      </div>
                    </div>
                    <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 mt-4">
                      <p className="text-sm">
                        <strong className="text-gray-900 dark:text-white">Remember:</strong> While your Rashi provides important insights, it's just one part of your complete birth chart. A comprehensive astrological analysis considers your Lagna (Ascendant), Sun sign, planetary positions, and various other factors to provide a holistic understanding of your life path.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-700 dark:to-cyan-700 rounded-xl shadow-lg p-6 sm:p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-3">Want a Complete Analysis?</h3>
              <p className="mb-6 text-teal-50">Get your detailed Kundli with comprehensive predictions, doshas, remedies, and life guidance</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/free-kundli">
                  <Button className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                    Generate Free Kundli
                  </Button>
                </Link>
                <Link href="/calculators">
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-teal-600 px-8 py-6 text-lg font-semibold">
                    More Calculators
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
