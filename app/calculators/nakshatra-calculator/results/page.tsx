"use client"

import { useEffect, useState } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Star, ArrowLeft, Calendar, MapPin, Clock, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface NakshatraResult {
  name: string
  birth_info: {
    date_of_birth: string
    time_of_birth: string
    place_of_birth: string
  }
  nakshatra: {
    name: string
    pada: number
    lord: string
    symbol: string
    deity: string
    gana: string
    element: string
    lucky_color: string
    characteristics: string[]
  }
  moon_position: {
    sign: string
    degree: number
    degree_dms: string
  }
}

export default function NakshatraResults() {
  const router = useRouter()
  const [result, setResult] = useState<NakshatraResult | null>(null)

  useEffect(() => {
    const storedResult = sessionStorage.getItem('nakshatraCalculatorResult')
    if (storedResult) {
      setResult(JSON.parse(storedResult))
    } else {
      router.push('/calculators/nakshatra-calculator')
    }
  }, [router])

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4 sm:pt-6 md:pt-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-5xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/calculators" className="hover:text-purple-600 dark:hover:text-purple-400">
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <Link href="/calculators/nakshatra-calculator" className="hover:text-purple-600 dark:hover:text-purple-400">
              Nakshatra
            </Link>
            <span className="mx-2">/</span>
            <span>Results</span>
          </div>

          {/* Back Button */}
          <Link href="/calculators/nakshatra-calculator">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Calculate Again
            </Button>
          </Link>

          {/* Results Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Your Nakshatra Report
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Based on accurate Vedic astrology calculations
              </p>
            </div>

            {/* Birth Details */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Birth Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-500">Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{result.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-500">Date of Birth</p>
                    <p className="font-medium text-gray-900 dark:text-white">{result.birth_info.date_of_birth}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-500">Time of Birth</p>
                    <p className="font-medium text-gray-900 dark:text-white">{result.birth_info.time_of_birth}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-500">Place of Birth</p>
                    <p className="font-medium text-gray-900 dark:text-white">{result.birth_info.place_of_birth}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Nakshatra Result */}
            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border-2 border-purple-200 dark:border-purple-800 mb-8">
              <div className="text-center">
                <Star className="w-20 h-20 mx-auto text-purple-500 mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Your Birth Nakshatra
                </h2>
                <div className="text-6xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                  {result.nakshatra.name}
                </div>
                <div className="text-xl text-gray-700 dark:text-gray-300 mb-2">
                  Pada {result.nakshatra.pada}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  Ruled by {result.nakshatra.lord}
                </div>
              </div>
            </div>

            {/* Moon Position */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Moon Position</h2>
              <div className="text-gray-700 dark:text-gray-300">
                <p>
                  Your Moon is in <span className="font-semibold text-purple-600 dark:text-purple-400">{result.moon_position.sign}</span> at{' '}
                  <span className="font-semibold">{result.moon_position.degree_dms}</span>
                </p>
              </div>
            </div>

            {/* Nakshatra Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Symbol</h3>
                <p className="text-gray-600 dark:text-gray-400">{result.nakshatra.symbol}</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Deity</h3>
                <p className="text-gray-600 dark:text-gray-400">{result.nakshatra.deity}</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Gana</h3>
                <p className="text-gray-600 dark:text-gray-400">{result.nakshatra.gana}</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Element</h3>
                <p className="text-gray-600 dark:text-gray-400">{result.nakshatra.element}</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lord</h3>
                <p className="text-gray-600 dark:text-gray-400">{result.nakshatra.lord}</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lucky Color</h3>
                <p className="text-gray-600 dark:text-gray-400">{result.nakshatra.lucky_color}</p>
              </div>
            </div>

            {/* Characteristics */}
            <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Key Characteristics</h3>
              <div className="flex flex-wrap gap-2">
                {result.nakshatra.characteristics.map((characteristic, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-medium"
                  >
                    {characteristic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <div className="space-y-8 mb-8">
            {/* What is Nakshatra? */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                What is a Nakshatra?
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Nakshatras are the 27 lunar mansions or constellations in Vedic astrology. The word "Nakshatra" comes from Sanskrit, meaning "that which never decays." They represent the Moon's path as it travels through the zodiac, with each Nakshatra spanning exactly 13 degrees and 20 minutes of the celestial sphere.
                </p>
                <p>
                  Unlike the 12 zodiac signs (Rashis) that are solar-based, Nakshatras are lunar-based and provide a much more detailed and precise understanding of planetary positions and their influences. Each Nakshatra is further divided into 4 quarters called Padas, making a total of 108 divisions of the zodiac.
                </p>
                <p>
                  Your birth Nakshatra is determined by the exact position of the Moon at the time and place of your birth. It's one of the most important factors in Vedic astrology, revealing deep insights into your:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Core personality traits and behavioral patterns</li>
                  <li>Mental and emotional nature</li>
                  <li>Life purpose and spiritual path</li>
                  <li>Compatible relationships and partnerships</li>
                  <li>Auspicious timing for important life events</li>
                  <li>Strengths, weaknesses, and karmic lessons</li>
                </ul>
              </div>
            </div>

            {/* How is it Calculated? */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                How is Your Nakshatra Calculated?
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Your Nakshatra is calculated using precise Vedic astrology methods based on the Moon's exact position at your time and place of birth. Here's what we need and how the calculation works:
                </p>

                <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Required Information:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 dark:text-purple-400 font-bold">1.</span>
                      <span><strong>Date of Birth:</strong> {result.birth_info.date_of_birth}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 dark:text-purple-400 font-bold">2.</span>
                      <span><strong>Time of Birth:</strong> {result.birth_info.time_of_birth}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 dark:text-purple-400 font-bold">3.</span>
                      <span><strong>Place of Birth:</strong> {result.birth_info.place_of_birth}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Calculation Process:</h3>
                  <ol className="space-y-3 ml-4">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-600 dark:bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <div>
                        <strong className="text-gray-900 dark:text-white">Location Conversion:</strong> Your birth place is converted to precise geographical coordinates (latitude and longitude).
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-600 dark:bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <div>
                        <strong className="text-gray-900 dark:text-white">Moon Position:</strong> The Moon's exact sidereal position is calculated for your birth time and location. Your Moon was at {result.moon_position.degree_dms} in {result.moon_position.sign}.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-600 dark:bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <div>
                        <strong className="text-gray-900 dark:text-white">Nakshatra Determination:</strong> The 360-degree zodiac is divided into 27 equal parts of 13°20' each. Based on the Moon's position, your Nakshatra is identified as <strong className="text-purple-600 dark:text-purple-400">{result.nakshatra.name}</strong>.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-600 dark:bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                      <div>
                        <strong className="text-gray-900 dark:text-white">Pada Identification:</strong> Each Nakshatra is divided into 4 Padas (quarters) of 3°20' each. Your Pada is <strong className="text-purple-600 dark:text-purple-400">Pada {result.nakshatra.pada}</strong>.
                      </div>
                    </li>
                  </ol>
                </div>

                <p className="text-sm bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <strong className="text-gray-900 dark:text-white">Note:</strong> This calculator uses the sidereal zodiac system (traditional Vedic system) which accounts for the precession of the equinoxes, providing accurate results based on actual star positions.
                </p>
              </div>
            </div>

            {/* How is it Used? */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                How is Your Nakshatra Used in Vedic Astrology?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/10 dark:to-pink-950/10 rounded-lg border border-purple-200 dark:border-purple-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Naming Ceremonies
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    In Hindu tradition, a child's name is often chosen based on their birth Nakshatra. Each Nakshatra has specific syllables that are considered auspicious for naming.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/10 dark:to-pink-950/10 rounded-lg border border-purple-200 dark:border-purple-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Kundli Matching
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Nakshatra compatibility is crucial in marriage matching. The Ashtakoota system assigns 8 points to Nakshatra compatibility out of 36 total points.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/10 dark:to-pink-950/10 rounded-lg border border-purple-200 dark:border-purple-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Muhurta Selection
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Nakshatras are used to determine auspicious timings (Muhurta) for important life events like weddings, business launches, and travel.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/10 dark:to-pink-950/10 rounded-lg border border-purple-200 dark:border-purple-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Dasha Predictions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    The Vimshottari Dasha system (120-year planetary period system) begins with the ruling planet of your birth Nakshatra, making it fundamental for predictions.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/10 dark:to-pink-950/10 rounded-lg border border-purple-200 dark:border-purple-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Remedial Measures
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Based on your Nakshatra, specific gemstones, mantras, and rituals are recommended to strengthen positive influences and reduce negative ones.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/10 dark:to-pink-950/10 rounded-lg border border-purple-200 dark:border-purple-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Personality Analysis
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Each Nakshatra has unique characteristics, providing deep insights into your nature, behaviors, strengths, and areas for growth.
                  </p>
                </div>
              </div>
            </div>

            {/* Why Does it Matter? */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Why Does Your Nakshatra Matter?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Deeper Self-Understanding</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Your Nakshatra reveals your innermost nature, emotional patterns, and subconscious drives. It provides insights that go beyond surface-level personality traits, helping you understand why you think, feel, and act the way you do.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Spiritual Significance</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Each Nakshatra is associated with a deity and carries specific spiritual energies. Understanding your Nakshatra helps you connect with your spiritual path, karmic lessons, and soul's purpose in this lifetime.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Relationship Compatibility</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Nakshatra matching is one of the most accurate methods for assessing relationship compatibility in Vedic astrology. It helps identify harmonious partnerships and potential challenges in relationships.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Life Timing and Cycles</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Your Nakshatra determines the starting point of your Vimshottari Dasha (planetary periods), which is the primary predictive tool in Vedic astrology for understanding life phases and timing of events.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Remedial Guidance</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Knowing your Nakshatra allows you to use specific remedial measures (mantras, gemstones, rituals) that are uniquely aligned with your cosmic blueprint, helping you navigate challenges and enhance positive qualities.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cultural and Traditional Significance</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      In Hindu and Vedic traditions, Nakshatras have been used for thousands of years for naming ceremonies, selecting auspicious dates, and understanding one's dharma (life purpose). Knowing your Nakshatra connects you to this ancient wisdom.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-900 dark:to-pink-900 rounded-xl shadow-lg p-6 sm:p-8 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Explore More About Your Cosmic Blueprint</h2>
            <p className="mb-6 text-purple-100">
              Get your complete Kundli analysis with detailed predictions, planetary positions, and personalized insights.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/free-kundli">
                <Button className="bg-white text-purple-600 hover:bg-gray-100">
                  Get Free Kundli
                </Button>
              </Link>
              <Link href="/calculators">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  More Calculators
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
