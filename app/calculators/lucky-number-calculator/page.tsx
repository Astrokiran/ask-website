"use client"

import { useState } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Sparkles, Calendar } from 'lucide-react'
import Link from 'next/link'
import { calculateLuckyNumber } from '@/lib/calculators'

export default function LuckyNumberCalculator() {
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState<number[] | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

    if (!birthDate) {
      alert('Please enter your birth date')
      return
    }

    const date = new Date(birthDate)
    const luckyNumbers = calculateLuckyNumber(date)

    setResult(luckyNumbers)
    setShowResult(true)
  }

  const handleReset = () => {
    setBirthDate('')
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
            <span>Lucky Number</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-4 py-2 rounded-lg font-medium text-sm mb-4">
              Lucky Number
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Lucky Number Calculator
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find your personal lucky numbers for success and fortune
            </p>
          </div>

          {/* Calculator Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <form onSubmit={handleCalculate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Birth Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Find Lucky Numbers
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
              <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 mx-auto text-green-500 mb-4 animate-pulse" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Your Lucky Numbers
                  </h2>
                  <div className="flex flex-wrap justify-center gap-4 mb-6">
                    {result.map((number, index) => (
                      <div
                        key={index}
                        className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
                      >
                        <span className="text-3xl font-bold text-white">{number}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      These are your personal lucky numbers based on your birth date. Use them for important
                      decisions, lottery numbers, or whenever you need a lucky charm. These numbers carry special
                      significance in your numerological profile.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              How to Use Your Lucky Numbers
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Lucky numbers in numerology are calculated from your birth date and represent numbers that
                resonate with your personal energy. These numbers can bring you good fortune and success.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Important Decisions</h3>
                    <p className="text-sm">Use when making crucial life choices</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Daily Life</h3>
                    <p className="text-sm">Choose these numbers in everyday situations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Dates & Times</h3>
                    <p className="text-sm">Plan events on these dates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Lottery & Games</h3>
                    <p className="text-sm">Try your luck with these numbers</p>
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
