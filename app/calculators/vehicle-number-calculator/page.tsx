"use client"

import { useState } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Calendar, Car, AlertCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function VehicleNumberCalculator() {
  const router = useRouter()
  const [vehicleNumber, setVehicleNumber] = useState('')
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

    if (!selectedDay || !selectedMonth || !selectedYear || !vehicleNumber.trim()) {
      alert('Please fill in all fields')
      return
    }

    // Format date
    const monthNumber = (months.indexOf(selectedMonth) + 1).toString().padStart(2, '0')
    const dayNumber = selectedDay.padStart(2, '0')
    const dateOfBirth = `${dayNumber}/${monthNumber}/${selectedYear}`

    // Store data in sessionStorage
    sessionStorage.setItem('vehicleNumberCalculatorData', JSON.stringify({
      dateOfBirth,
      vehicleNumber: vehicleNumber.toUpperCase().trim()
    }))

    // Redirect to results page
    router.push('/calculators/vehicle-number-calculator/results')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4 sm:pt-6 md:pt-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/calculators" className="hover:text-emerald-600 dark:hover:text-emerald-400">
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <span>Vehicle Number Numerology</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-lg font-medium text-sm mb-4">
              Vehicle Number Numerology
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Is Your Vehicle Number Lucky?
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover the numerology of your vehicle number and its compatibility with your birth date
            </p>
          </div>

          {/* Info Alert */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">How does it work?</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Your vehicle number carries energy that travels with you daily. When it aligns with your birth date numerology,
                  it brings smoother drives, fewer mishaps, and better luck on the road.
                </p>
              </div>
            </div>
          </div>

          {/* Calculator Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <form onSubmit={handleCalculate} className="space-y-6">
              {/* Vehicle Number Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vehicle Number *
                </label>
                <div className="relative">
                  <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    placeholder="e.g., MH-12-AB-1234 or KA01AB1234 or just 1234"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all uppercase"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  Enter your complete number plate or just the numeric part
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
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Day</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
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
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-semibold"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Check Compatibility
              </Button>
            </form>
          </div>

          {/* Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Understanding Vehicle Number Numerology
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                In Vedic numerology, every number carries a unique vibration and energy. Your vehicle number isn't just a random
                combination – it creates an energetic field that affects your journeys, safety, and overall experience with the vehicle.
              </p>

              <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800 mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">What We Analyze:</h3>
                <ul className="text-sm space-y-2 list-disc list-inside">
                  <li><strong className="text-gray-900 dark:text-white">Life Path Number:</strong> Calculated from your birth date, represents your core energy</li>
                  <li><strong className="text-gray-900 dark:text-white">Vehicle Number:</strong> All digits are added and reduced to a single number (1-9)</li>
                  <li><strong className="text-gray-900 dark:text-white">Compatibility Score:</strong> How well your life path aligns with the vehicle number</li>
                  <li><strong className="text-gray-900 dark:text-white">Planetary Influence:</strong> Each number is ruled by a planet with specific qualities</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Number 1, 3, 5, 9</h4>
                  <p className="text-sm">Odd numbers - Active, dynamic, yang energy. Good for business, sports, and bold personalities.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Number 2, 4, 6, 8</h4>
                  <p className="text-sm">Even numbers - Passive, stable, yin energy. Good for family, comfort, and peaceful journeys.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Number 7</h4>
                  <p className="text-sm">Spiritual number - Mystical, introspective. Good for personal use and spiritual seekers.</p>
                </div>
              </div>

              <p className="mt-4">
                <strong className="text-gray-900 dark:text-white">Example:</strong> If your number plate is MH-12-AB-1234,
                we take only the digits (121234), add them (1+2+1+2+3+4 = 13), and reduce to a single digit (1+3 = 4).
                So your vehicle number is 4, ruled by Rahu, representing stability and hard work.
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                <strong>Note:</strong> While numerology provides insights, safe driving and regular maintenance are always the most important factors for a smooth journey!
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
