"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Sun, ArrowLeft, Calendar, Sparkles, BookOpen, Calculator, Heart } from 'lucide-react'
import Link from 'next/link'

interface SunSignResult {
  success: boolean
  name: string
  birth_info: {
    date_of_birth: string
    time_of_birth: string
    place_of_birth: string
  }
  sun_sign: {
    sign: string
    symbol: string
    element: string
    quality: string
    ruling_planet: string
    lucky_color: string
    lucky_number: number
    traits: string[]
    sun_degree: number
    sun_degree_dms: string
  }
}

export default function SunSignResults() {
  const router = useRouter()
  const [result, setResult] = useState<SunSignResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedResult = sessionStorage.getItem('sunSignCalculatorResult')
    if (storedResult) {
      setResult(JSON.parse(storedResult))
    } else {
      router.push('/calculators/sun-sign-calculator')
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4 sm:pt-6 md:pt-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl">
          <Link href="/calculators/sun-sign-calculator" className="inline-flex items-center text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Calculate Again
          </Link>

          {/* Results Section */}
          <div className="mb-8 space-y-6">
            {/* Main Result Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-xl shadow-lg border-2 border-yellow-200 dark:border-yellow-800 p-6 sm:p-8">
              <div className="text-center">
                <Sun className="w-20 h-20 mx-auto text-yellow-500 mb-6" />
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  {result.name}'s Sun Sign
                </h1>
                <div className="text-7xl sm:text-8xl mb-4">
                  {result.sun_sign.symbol}
                </div>
                <div className="text-5xl sm:text-6xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">
                  {result.sun_sign.sign}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sun at {result.sun_sign.sun_degree_dms}
                </p>
              </div>
            </div>

            {/* Birth Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-yellow-600" />
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

            {/* Sun Sign Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Element</h3>
                <p className="text-lg text-yellow-600 dark:text-yellow-400 font-medium">{result.sun_sign.element}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quality</h3>
                <p className="text-lg text-yellow-600 dark:text-yellow-400 font-medium">{result.sun_sign.quality}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Ruling Planet</h3>
                <p className="text-lg text-yellow-600 dark:text-yellow-400 font-medium">{result.sun_sign.ruling_planet}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lucky Color</h3>
                <p className="text-lg text-yellow-600 dark:text-yellow-400 font-medium">{result.sun_sign.lucky_color}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lucky Number</h3>
                <p className="text-lg text-yellow-600 dark:text-yellow-400 font-medium">{result.sun_sign.lucky_number}</p>
              </div>
            </div>

            {/* Personality Traits */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-600" />
                Your Key Personality Traits
              </h2>
              <div className="flex flex-wrap gap-3">
                {result.sun_sign.traits.map((trait, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-medium"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <div className="space-y-8 mb-8">
            {/* What is Sun Sign */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <div className="flex items-start mb-4">
                <BookOpen className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What is a Sun Sign?</h2>
                  <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                    <p>Your <strong className="text-gray-900 dark:text-white">Sun Sign</strong>, also known as your zodiac sign, represents the position of the Sun at the exact moment of your birth. It's the most well-known element in astrology and forms the foundation of your horoscope.</p>
                    <p>The Sun symbolizes your core self, ego, conscious mind, and life force. It represents who you are at your essence, your fundamental nature, and the driving force behind your actions and ambitions.</p>
                    <p>There are 12 sun signs in Western astrology, each spanning approximately 30 days: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, and Pisces. Each sign has unique characteristics, strengths, and challenges.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* How is it Calculated */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <div className="flex items-start mb-4">
                <Calculator className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How is Your Sun Sign Calculated?</h2>
                  <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                    <p>Your Sun Sign is determined by the Sun's position in the zodiac at your time of birth:</p>
                    <ol className="space-y-2 list-decimal list-inside ml-4">
                      <li><strong>Date Determination:</strong> The primary factor is your birth date, as the Sun moves through one zodiac sign approximately every 30 days</li>
                      <li><strong>Time Precision:</strong> While less critical than for Moon or Rising signs, birth time ensures accuracy during cusp dates (transition between signs)</li>
                      <li><strong>Ecliptic Path:</strong> The calculation tracks the Sun's apparent path through the sky (ecliptic) as seen from Earth</li>
                      <li><strong>Zodiac Mapping:</strong> The 360-degree ecliptic is divided into 12 equal 30-degree segments, each representing a zodiac sign</li>
                    </ol>
                    <p className="text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mt-4">
                      <strong>In your case:</strong> The Sun was positioned at {result.sun_sign.sun_degree_dms} in {result.sun_sign.sign} at the time of your birth.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How is it Used */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <div className="flex items-start mb-4">
                <Sparkles className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How is Your Sun Sign Used?</h2>
                  <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                    <p>Your Sun Sign serves as a powerful tool in various astrological practices:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📰 Daily Horoscopes</h4>
                        <p className="text-sm">Most newspaper and online horoscopes are based on your Sun Sign</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🎭 Personality Analysis</h4>
                        <p className="text-sm">Understanding your core traits, strengths, and growth areas</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💑 Compatibility</h4>
                        <p className="text-sm">Assessing relationship dynamics with others based on elemental harmony</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💼 Career Guidance</h4>
                        <p className="text-sm">Identifying suitable professions aligned with your natural talents</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🌟 Life Purpose</h4>
                        <p className="text-sm">Understanding your life's mission and authentic self-expression</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🎯 Personal Development</h4>
                        <p className="text-sm">Working with your natural inclinations for growth</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Does it Matter */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <div className="flex items-start mb-4">
                <Heart className="w-6 h-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why Does Your Sun Sign Matter?</h2>
                  <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                    <p>Understanding your Sun Sign provides valuable insights into your life:</p>
                    <div className="space-y-4 mt-4">
                      <div className="border-l-4 border-yellow-600 pl-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Self-Awareness & Identity</h4>
                        <p className="text-sm">Your Sun Sign reveals your authentic self, core values, and what makes you feel alive. This self-knowledge helps you make choices aligned with your true nature.</p>
                      </div>
                      <div className="border-l-4 border-yellow-600 pl-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Understanding Others</h4>
                        <p className="text-sm">Knowing different Sun Signs helps you appreciate diverse personalities and communication styles, improving relationships and empathy.</p>
                      </div>
                      <div className="border-l-4 border-yellow-600 pl-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Life Direction</h4>
                        <p className="text-sm">Your Sun Sign points to your life purpose and the path where you can shine brightest, guiding major life decisions.</p>
                      </div>
                      <div className="border-l-4 border-yellow-600 pl-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Energy Management</h4>
                        <p className="text-sm">Each sign has unique energy patterns. Understanding yours helps you work with your natural rhythms rather than against them.</p>
                      </div>
                      <div className="border-l-4 border-yellow-600 pl-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Personal Strengths</h4>
                        <p className="text-sm">Your Sun Sign highlights your innate gifts and talents, helping you leverage them for success and fulfillment.</p>
                      </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mt-4">
                      <p className="text-sm">
                        <strong className="text-gray-900 dark:text-white">Remember:</strong> Your Sun Sign is just one piece of your astrological profile. For a complete picture, consider your Moon Sign (emotions), Rising Sign (outer personality), and planetary positions in your full birth chart.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-700 dark:to-orange-700 rounded-xl shadow-lg p-6 sm:p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-3">Discover Your Complete Astrological Profile</h3>
              <p className="mb-6 text-yellow-50">Get your full birth chart with detailed analysis, planetary positions, and personalized predictions</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/free-kundli">
                  <Button className="bg-white text-yellow-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                    Generate Free Kundli
                  </Button>
                </Link>
                <Link href="/calculators">
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-yellow-600 px-8 py-6 text-lg font-semibold">
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
