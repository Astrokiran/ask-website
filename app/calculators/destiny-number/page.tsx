"use client"

import { useState } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Star, User } from 'lucide-react'
import Link from 'next/link'
import { calculateDestinyNumber, getDestinyNumberMeaning } from '@/lib/calculators'

export default function DestinyNumberCalculator() {
  const [fullName, setFullName] = useState('')
  const [result, setResult] = useState<{ number: number; meaning: string } | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName.trim()) {
      alert('Please enter your full name')
      return
    }

    const destinyNumber = calculateDestinyNumber(fullName)
    const meaning = getDestinyNumberMeaning(destinyNumber)

    setResult({ number: destinyNumber, meaning })
    setShowResult(true)
  }

  const handleReset = () => {
    setFullName('')
    setResult(null)
    setShowResult(false)
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
            <span>Destiny Number</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-lg font-medium text-sm mb-4">
              Destiny Number
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Destiny Number Calculator
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Calculate your destiny number from your full name
            </p>
          </div>

          {/* Calculator Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <form onSubmit={handleCalculate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name (as on birth certificate)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Include first, middle, and last name for accurate results
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg font-semibold"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Calculate Destiny
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
              <div className="mt-8 p-6 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 rounded-xl border-2 border-orange-200 dark:border-orange-800">
                <div className="text-center mb-6">
                  <Star className="w-16 h-16 mx-auto text-orange-500 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Your Destiny Number
                  </h2>
                  <div className="text-7xl font-bold text-orange-600 dark:text-orange-400">
                    {result.number}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Your Destiny
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {result.meaning}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What is Destiny Number?
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Your Destiny Number, also known as Expression Number, is calculated from your full birth name.
                It reveals your life's purpose, natural talents, and the goals you're meant to achieve.
              </p>
              <p>
                This number represents who you are destined to become and what you're meant to accomplish in this
                lifetime. It complements your Life Path Number by showing the tools and abilities you have to
                fulfill your life's purpose.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Life Purpose</h3>
                    <p className="text-sm">What you're meant to achieve</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Natural Abilities</h3>
                    <p className="text-sm">Your inherent talents and skills</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Life Direction</h3>
                    <p className="text-sm">Your destined path and goals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Personal Growth</h3>
                    <p className="text-sm">Areas for development</p>
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
