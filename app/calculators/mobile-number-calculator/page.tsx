"use client"

import { useState } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Calendar, Smartphone, AlertCircle, Sparkles, Phone } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function MobileNumberCalculator() {
  const router = useRouter()
  const [mobileNumber, setMobileNumber] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const years = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - i)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDay || !selectedMonth || !selectedYear) {
      alert('Please select your complete date of birth')
      return
    }

    if (!mobileNumber.trim()) {
      alert('Please enter your mobile number')
      return
    }

    // Format date
    const monthNumber = (months.indexOf(selectedMonth) + 1).toString().padStart(2, '0')
    const dayNumber = selectedDay.padStart(2, '0')
    const dateOfBirth = `${dayNumber}/${monthNumber}/${selectedYear}`

    // Store data in sessionStorage
    sessionStorage.setItem('mobileNumberCalculatorData', JSON.stringify({
      dateOfBirth,
      mobileNumber: mobileNumber.trim()
    }))

    // Redirect to results page
    router.push('/calculators/mobile-number-calculator/results')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4 sm:pt-6 md:pt-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/calculators" className="hover:text-blue-600 dark:hover:text-blue-400">
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <span>Mobile Number Numerology</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg font-medium text-sm mb-4">
              Mobile Number Numerology
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Is Your Mobile Number Lucky?
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover the hidden energy in your phone number and its impact on your career, love, and health
            </p>
          </div>

          {/* Info Alert */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">How does it work?</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Your mobile number isn't just a random combination—it carries energy that affects your daily life.
                  We analyze all digits and especially the last 4 digits (which carry the most active energy) to determine
                  how your number influences your career, relationships, and overall well-being.
                </p>
              </div>
            </div>
          </div>

          {/* Calculator Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <form onSubmit={handleCalculate} className="space-y-6">
              {/* Mobile Number Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="e.g., +91-9876543210 or 9876543210"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  Enter with or without country code, spaces, or hyphens
                </p>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Your Date of Birth *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Day</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze My Mobile Number
              </Button>
            </form>
          </div>

          {/* Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Understanding Mobile Number Numerology
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Every digit in your mobile number vibrates at a specific frequency. When you dial or receive calls,
                these vibrations interact with your personal energy field, influencing various aspects of your life.
              </p>

              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">What We Analyze:</h3>
                <ul className="text-sm space-y-2 list-disc list-inside">
                  <li><strong className="text-gray-900 dark:text-white">Core Number:</strong> Sum of all digits reduced to single number (1-9)</li>
                  <li><strong className="text-gray-900 dark:text-white">Last 4 Digits:</strong> Most active energy that influences daily communications</li>
                  <li><strong className="text-gray-900 dark:text-white">Driver Number:</strong> Your birth date number that reveals your core nature</li>
                  <li><strong className="text-gray-900 dark:text-white">Compatibility Score:</strong> How well your mobile number aligns with your birth date</li>
                  <li><strong className="text-gray-900 dark:text-white">Repeating Patterns:</strong> Numbers like 777 or 999 that amplify specific energies</li>
                  <li><strong className="text-gray-900 dark:text-white">Planetary Influence:</strong> Each number is ruled by a planet with specific qualities</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <Smartphone className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Career Impact</h4>
                  <p className="text-sm">Your number influences business opportunities, professional growth, and work-related communications.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <Smartphone className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Love & Relationships</h4>
                  <p className="text-sm">Affects romantic communications, family connections, and the energy you project to loved ones.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <Smartphone className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Health & Well-being</h4>
                  <p className="text-sm">The vibrations from your number can influence stress levels, sleep patterns, and overall vitality.</p>
                </div>
              </div>

              <p className="mt-4">
                <strong className="text-gray-900 dark:text-white">Example:</strong> If your number is 9876543210,
                we calculate: 9+8+7+6+5+4+3+2+1+0 = 45, then 4+5 = 9. Your core number is 9 (Mars - courage, completion, wisdom).
                The last 4 digits (3210) sum to 6 (Venus - love, harmony, luxury).
              </p>

              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800 mt-4">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  💡 Real Example: Arjun from Chennai
                </h3>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Arjun's mobile number was great for business (number 8 - Saturn) but created obstacles in his love life.
                  After consulting with a numerologist, he slightly modified his number to balance both areas.
                  Within months, he noticed improved communication with his partner and maintained his business success.
                </p>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                <strong>Note:</strong> Numerology provides guidance and insights. While changing your number can help,
                it's not a substitute for practical action and positive communication in your relationships and career.
              </p>
            </div>
          </div>

          {/* Number Meanings Quick Reference */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Number Reference
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { num: 1, text: '1 - Leadership (Sun)' },
                { num: 2, text: '2 - Harmony (Moon)' },
                { num: 3, text: '3 - Communication (Jupiter)' },
                { num: 4, text: '4 - Stability (Rahu)' },
                { num: 5, text: '5 - Change (Mercury)' },
                { num: 6, text: '6 - Love (Venus)' },
                { num: 7, text: '7 - Spirituality (Ketu)' },
                { num: 8, text: '8 - Success (Saturn)' },
                { num: 9, text: '9 - Completion (Mars)' }
              ].map(item => (
                <div key={item.num} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
