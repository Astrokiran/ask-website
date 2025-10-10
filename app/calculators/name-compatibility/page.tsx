"use client"

import { useState } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Sparkles, Users } from 'lucide-react'
import Link from 'next/link'
import { calculateNameCompatibility } from '@/lib/calculators'

export default function NameCompatibilityCalculator() {
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [result, setResult] = useState<{
    name1Number: number
    name2Number: number
    compatibilityScore: number
    message: string
  } | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name1.trim() || !name2.trim()) {
      alert('Please enter both names')
      return
    }

    const compatibility = calculateNameCompatibility(name1, name2)
    setResult(compatibility)
    setShowResult(true)
  }

  const handleReset = () => {
    setName1('')
    setName2('')
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
            <span>Name Compatibility</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-lg font-medium text-sm mb-4">
              Name Compatibility
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Name Compatibility Calculator
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Check detailed compatibility between two names using numerology
            </p>
          </div>

          {/* Calculator Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <form onSubmit={handleCalculate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={name1}
                    onChange={(e) => setName1(e.target.value)}
                    placeholder="Enter first name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Second Name
                  </label>
                  <input
                    type="text"
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                    placeholder="Enter second name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Check Compatibility
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
              <div className="mt-8 space-y-6">
                {/* Compatibility Score */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 mx-auto text-purple-500 mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Compatibility Score
                    </h2>
                    <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-3">
                      {result.compatibilityScore}%
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                      {result.message}
                    </p>
                    <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${result.compatibilityScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Individual Numbers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {name1}'s Number
                    </h3>
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                      {result.name1Number}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Destiny Number
                    </p>
                  </div>
                  <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {name2}'s Number
                    </h3>
                    <div className="text-4xl font-bold text-pink-600 dark:text-pink-400">
                      {result.name2Number}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Destiny Number
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              About Name Compatibility
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Name compatibility in numerology reveals how well two people harmonize based on the vibrational
                energy of their names. Each name carries a unique numeric value that influences personality traits
                and relationship dynamics.
              </p>
              <p>
                This calculator uses the destiny number (derived from the full name) to determine compatibility.
                Higher scores indicate natural harmony, while lower scores suggest areas that may require more
                understanding and effort.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
