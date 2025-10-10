"use client"

import { useState } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { TrendingUp, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { calculateLifePathNumber, getLifePathMeaning } from '@/lib/calculators'

export default function LifePathCalculator() {
  const router = useRouter()
  const [birthDate, setBirthDate] = useState('')

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

    if (!birthDate) {
      alert('Please enter your birth date')
      return
    }

    const date = new Date(birthDate)
    const lifePathNumber = calculateLifePathNumber(date)
    const meaning = getLifePathMeaning(lifePathNumber)

    // Store result in sessionStorage
    const result = {
      number: lifePathNumber,
      meaning: meaning,
      birthDate: birthDate
    }
    sessionStorage.setItem('lifePathCalculatorResult', JSON.stringify(result))

    // Redirect to results page
    router.push('/calculators/life-path/results')
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
            <span>Life Path Number</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg font-medium text-sm mb-4">
              Life Path Number
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Life Path Number Calculator
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover your life path number and understand your life's purpose
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
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Calculate Life Path
              </Button>
            </form>
          </div>

          {/* Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What is Life Path Number?
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Your Life Path Number is one of the most important numbers in numerology. It's calculated from your
                birth date and reveals your life's purpose, natural talents, and the challenges you may face.
              </p>
              <p>
                This number influences your personality, relationships, career choices, and overall life direction.
                Understanding your Life Path Number can help you make better decisions and align with your true purpose.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Reveals Purpose</h3>
                    <p className="text-sm">Understand your life's mission</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Natural Talents</h3>
                    <p className="text-sm">Discover your innate abilities</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Career Guidance</h3>
                    <p className="text-sm">Find suitable career paths</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Self-Awareness</h3>
                    <p className="text-sm">Better understand yourself</p>
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
