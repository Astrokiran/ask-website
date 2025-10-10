"use client"

import { useState } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Calculator, User } from 'lucide-react'
import Link from 'next/link'
import { calculateNameNumerology } from '@/lib/calculators'

export default function NameNumerologyCalculator() {
  const [fullName, setFullName] = useState('')
  const [result, setResult] = useState<{
    nameNumber: number
    soulUrgeNumber: number
    personalityNumber: number
  } | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName.trim()) {
      alert('Please enter your full name')
      return
    }

    const numerology = calculateNameNumerology(fullName)
    setResult(numerology)
    setShowResult(true)
  }

  const handleReset = () => {
    setFullName('')
    setResult(null)
    setShowResult(false)
  }

  const getNumberDescription = (type: string, number: number) => {
    const descriptions: { [key: string]: { [key: number]: string } } = {
      name: {
        1: "Leadership and independence",
        2: "Cooperation and harmony",
        3: "Creativity and expression",
        4: "Stability and hard work",
        5: "Freedom and adventure",
        6: "Responsibility and nurturing",
        7: "Wisdom and spirituality",
        8: "Power and success",
        9: "Compassion and humanitarianism",
      },
      soul: {
        1: "Inner drive for independence and leadership",
        2: "Deep need for peace and partnership",
        3: "Soul yearns for creative expression",
        4: "Inner desire for security and order",
        5: "Soul seeks freedom and variety",
        6: "Heart desires to nurture and help",
        7: "Soul searches for truth and wisdom",
        8: "Inner ambition for achievement",
        9: "Soul devoted to serving humanity",
      },
      personality: {
        1: "Appears confident and strong",
        2: "Comes across as gentle and diplomatic",
        3: "Seems friendly and expressive",
        4: "Appears reliable and practical",
        5: "Seems dynamic and versatile",
        6: "Comes across as warm and caring",
        7: "Appears mysterious and thoughtful",
        8: "Seems powerful and authoritative",
        9: "Appears compassionate and wise",
      },
    }

    return descriptions[type][number] || "Unique qualities"
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4 sm:pt-6 md:pt-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/calculators" className="hover:text-orange-600 dark:hover:text-orange-400">
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <span>Name Numerology</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-lg font-medium text-sm mb-4">
              Name Numerology
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Name Numerology Calculator
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get complete numerology analysis of your name
            </p>
          </div>

          {/* Calculator Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <form onSubmit={handleCalculate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg font-semibold"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Analyze Name
                </Button>
                {showResult && (
                  <Button
                    type="button"
                    onClick={handleReset}
                    variant="outline"
                    className="px-6 py-6"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </form>

            {/* Result Display */}
            {showResult && result && (
              <div className="mt-8 space-y-4">
                {/* Expression/Name Number */}
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Expression Number (Name Number)
                    </h3>
                    <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                      {result.nameNumber}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {getNumberDescription('name', result.nameNumber)}
                  </p>
                </div>

                {/* Soul Urge Number */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Soul Urge Number (Heart's Desire)
                    </h3>
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                      {result.soulUrgeNumber}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {getNumberDescription('soul', result.soulUrgeNumber)}
                  </p>
                </div>

                {/* Personality Number */}
                <div className="p-6 bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-950/20 dark:to-orange-950/20 rounded-xl border-2 border-pink-200 dark:border-pink-800">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Personality Number (Outer Self)
                    </h3>
                    <div className="text-4xl font-bold text-pink-600 dark:text-pink-400">
                      {result.personalityNumber}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {getNumberDescription('personality', result.personalityNumber)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Understanding Name Numerology
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Name numerology reveals the hidden meanings and energies within your name. Each letter carries
                a specific vibration that influences your life path and personality.
              </p>
              <div className="space-y-3 mt-6">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Expression Number</h3>
                    <p className="text-sm">Shows your natural talents and abilities</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Soul Urge Number</h3>
                    <p className="text-sm">Reveals your inner desires and motivations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Personality Number</h3>
                    <p className="text-sm">How others perceive you and your outer personality</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
