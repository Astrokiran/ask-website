"use client"

import { useState } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Hash, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NumerologyCalculator() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
  })
  const [isCalculating, setIsCalculating] = useState(false)

  // Date dropdown states
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const years = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - i)

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !selectedDay || !selectedMonth || !selectedYear) {
      alert('Please fill in all fields')
      return
    }

    setIsCalculating(true)

    try {
      // Format date as DD/MM/YYYY
      const monthNumber = (months.indexOf(selectedMonth) + 1).toString().padStart(2, '0')
      const dayNumber = selectedDay.padStart(2, '0')
      const dateOfBirth = `${dayNumber}/${monthNumber}/${selectedYear}`

      const response = await fetch('http://localhost:9090/api/v1/kundali/api/calculators/numerology', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          date_of_birth: dateOfBirth,
          time_of_birth: '12:00PM', // Default time for numerology
          place_of_birth: 'New Delhi, India', // Default place for numerology
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to calculate numerology')
      }

      const data = await response.json()

      // Store result in sessionStorage
      sessionStorage.setItem('numerologyCalculatorResult', JSON.stringify(data))

      // Redirect to results page
      router.push('/calculators/numerology-calculator/results')
    } catch (error) {
      console.error('Error calculating numerology:', error)
      alert('Failed to calculate numerology. Please try again.')
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4 sm:pt-6 md:pt-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/calculators" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <span>Numerology</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-lg font-medium text-sm mb-4">
              Numerology Calculator
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Discover Your Numerology Numbers
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Unlock the secrets of your life path, destiny, soul urge, and personality numbers
            </p>
          </div>

          {/* Calculator Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <form onSubmit={handleCalculate} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name as per birth certificate"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  Use your full name as it appears on your birth certificate for accurate results
                </p>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Day</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
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
                disabled={isCalculating}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg font-semibold"
              >
                <Hash className="w-5 h-5 mr-2" />
                {isCalculating ? 'Calculating...' : 'Calculate My Numbers'}
              </Button>
            </form>
          </div>

          {/* Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              About Numerology Calculator
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Numerology is the ancient practice of understanding the mystical relationship between numbers and life events. Every number carries a unique vibration and meaning that can reveal insights about your personality, life path, and destiny.
              </p>
              <p>
                This comprehensive calculator analyzes your name and birth date to calculate four core numbers:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-gray-900 dark:text-white">Life Path Number:</strong> Your life's purpose and journey</li>
                <li><strong className="text-gray-900 dark:text-white">Destiny Number:</strong> Your life's potential and mission</li>
                <li><strong className="text-gray-900 dark:text-white">Soul Urge Number:</strong> Your heart's deepest desires</li>
                <li><strong className="text-gray-900 dark:text-white">Personality Number:</strong> How others perceive you</li>
              </ul>
              <p>
                Each number from 1 to 9, plus the Master Numbers 11, 22, and 33, carries specific meanings and influences that shape different aspects of your life.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
