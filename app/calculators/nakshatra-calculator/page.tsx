"use client"

import { useState, useRef, useEffect } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Star, Calendar, MapPin, Clock, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useJsApiLoader } from '@react-google-maps/api'

const libraries: ("places")[] = ["places"]

export default function NakshatraCalculator() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    tob: '',
    pob: '',
  })
  const [isCalculating, setIsCalculating] = useState(false)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Date dropdown states
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  // Time dropdown states
  const [selectedHour, setSelectedHour] = useState('')
  const [selectedMinute, setSelectedMinute] = useState('')
  const [selectedAmPm, setSelectedAmPm] = useState('AM')

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: libraries,
  })

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['(cities)'],
      })

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace()
        if (place?.formatted_address) {
          setFormData(prev => ({ ...prev, pob: place.formatted_address || '' }))
        }
      })
    }
  }, [isLoaded])

  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const years = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - i)
  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !selectedDay || !selectedMonth || !selectedYear || !selectedHour || !selectedMinute || !formData.pob) {
      alert('Please fill in all fields')
      return
    }

    setIsCalculating(true)

    try {
      // Format date as DD/MM/YYYY
      const monthNumber = (months.indexOf(selectedMonth) + 1).toString().padStart(2, '0')
      const dayNumber = selectedDay.padStart(2, '0')
      const dateOfBirth = `${dayNumber}/${monthNumber}/${selectedYear}`

      // Format time as HH:MMAM/PM
      const hourNumber = selectedHour.padStart(2, '0')
      const minuteNumber = selectedMinute.padStart(2, '0')
      const timeOfBirth = `${hourNumber}:${minuteNumber}${selectedAmPm}`

      const response = await fetch('http://localhost:9090/api/v1/kundali/api/calculators/nakshatra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          date_of_birth: dateOfBirth,
          time_of_birth: timeOfBirth,
          place_of_birth: formData.pob,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to calculate nakshatra')
      }

      const data = await response.json()

      // Store result in sessionStorage
      sessionStorage.setItem('nakshatraCalculatorResult', JSON.stringify(data))

      // Redirect to results page
      router.push('/calculators/nakshatra-calculator/results')
    } catch (error) {
      console.error('Error calculating nakshatra:', error)
      alert('Failed to calculate nakshatra. Please try again.')
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
            <Link href="/calculators" className="hover:text-purple-600 dark:hover:text-purple-400">
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <span>Nakshatra</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-lg font-medium text-sm mb-4">
              Nakshatra Calculator
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Discover Your Birth Nakshatra
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find your birth nakshatra (lunar mansion) with accurate Vedic astrology calculations
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
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
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
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Day</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time of Birth
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Hour</option>
                    {hours.map(hour => (
                      <option key={hour} value={hour}>{hour}</option>
                    ))}
                  </select>
                  <select
                    value={selectedMinute}
                    onChange={(e) => setSelectedMinute(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Minute</option>
                    {minutes.map(minute => (
                      <option key={minute} value={minute}>{minute.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                  <select
                    value={selectedAmPm}
                    onChange={(e) => setSelectedAmPm(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              {/* Place of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Place of Birth
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={formData.pob}
                    onChange={(e) => setFormData({ ...formData, pob: e.target.value })}
                    placeholder="Enter your birth city"
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isCalculating}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold"
              >
                <Star className="w-5 h-5 mr-2" />
                {isCalculating ? 'Calculating...' : 'Find Your Nakshatra'}
              </Button>
            </form>
          </div>

          {/* Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              About Nakshatra Calculator
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Nakshatras are the 27 lunar mansions in Vedic astrology, each spanning 13 degrees and 20 minutes of the zodiac. They represent the Moon's journey through the sky and are fundamental to understanding your personality and destiny.
              </p>
              <p>
                Your birth Nakshatra is determined by the Moon's position at the exact time and place of your birth. This calculator uses accurate Vedic astrology calculations to determine your Nakshatra, Pada, ruling lord, and detailed characteristics.
              </p>
              <p>
                Nakshatras are used extensively in Vedic astrology for various purposes including naming ceremonies, muhurta (auspicious timing), compatibility analysis, and predictive astrology.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
