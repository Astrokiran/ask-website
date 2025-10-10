"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Heart, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { calculateLovePercentage, getLoveMessage } from '@/lib/calculators'

export default function LoveCalculator() {
  const router = useRouter()
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name1.trim() || !name2.trim()) {
      alert('Please enter both names')
      return
    }

    const percentage = calculateLovePercentage(name1, name2)
    const message = getLoveMessage(percentage)

    // Store result in sessionStorage
    const result = {
      name1: name1.trim(),
      name2: name2.trim(),
      percentage,
      message
    }
    sessionStorage.setItem('loveCalculatorResult', JSON.stringify(result))

    // Redirect to results page
    router.push('/calculators/love-calculator/results')
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
            <span>Love Calculator</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-4 py-2 rounded-lg font-medium text-sm mb-4">
              Love Calculator
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Calculate Love Compatibility
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find out the love compatibility percentage between you and your partner
            </p>
          </div>

          {/* Calculator Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <form onSubmit={handleCalculate} className="space-y-6">
              {/* Name Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name1}
                    onChange={(e) => setName1(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Partner's Name
                  </label>
                  <input
                    type="text"
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                    placeholder="Enter partner's name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div>
                <Button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6 text-lg font-semibold"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Calculate Love
                </Button>
              </div>
            </form>
          </div>

          {/* Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-pink-500" />
              About Love Calculator
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Our Love Calculator uses a unique algorithm based on name numerology to calculate the compatibility
                percentage between two people. Simply enter both names and discover your love compatibility!
              </p>
              <p>
                The calculation takes into account the vibrational energy of letters in both names and provides
                an instant compatibility score. While this is for entertainment purposes, many find it surprisingly
                accurate!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Instant Results</h3>
                    <p className="text-sm">Get your compatibility score immediately</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Fun & Accurate</h3>
                    <p className="text-sm">Based on numerology principles</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Completely Free</h3>
                    <p className="text-sm">No registration or payment required</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Private</h3>
                    <p className="text-sm">Your data is never stored</p>
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
