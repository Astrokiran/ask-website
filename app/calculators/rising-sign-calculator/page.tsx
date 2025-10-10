"use client"

import { useState, useRef } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Sunrise, Calendar, Clock, MapPin, AlertCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'

const libraries: ("places")[] = ['places']

export default function RisingSignCalculator() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    pob: ''
  })
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedHour, setSelectedHour] = useState('')
  const [selectedMinute, setSelectedMinute] = useState('')
  const [selectedAmPm, setSelectedAmPm] = useState('AM')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autocompleteInstance, setAutocompleteInstance] = useState<google.maps.places.Autocomplete | null>(null)

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries,
  })

  const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocompleteInstance(autocomplete)
  }

  const onPlaceChanged = () => {
    if (autocompleteInstance !== null) {
      const place = autocompleteInstance.getPlace()
      const formattedAddress = place.formatted_address || ''
      setFormData(prev => ({ ...prev, pob: formattedAddress }))
    }
  }

  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const years = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - i)
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert('Please enter your name')
      return
    }

    if (!selectedDay || !selectedMonth || !selectedYear) {
      alert('Please select your complete date of birth')
      return
    }

    if (!selectedHour || !selectedMinute) {
      alert('Please select your exact time of birth')
      return
    }

    if (!formData.pob.trim()) {
      alert('Please enter your place of birth')
      return
    }

    setIsSubmitting(true)

    try {
      // Format date
      const monthNumber = (months.indexOf(selectedMonth) + 1).toString().padStart(2, '0')
      const dayNumber = selectedDay.padStart(2, '0')
      const dateOfBirth = `${dayNumber}-${monthNumber}-${selectedYear}`

      // Format time to 24-hour format
      let hour24 = parseInt(selectedHour, 10)
      if (selectedAmPm === 'PM' && hour24 < 12) {
        hour24 += 12
      }
      if (selectedAmPm === 'AM' && hour24 === 12) {
        hour24 = 0
      }
      const timeOfBirth = `${hour24.toString().padStart(2, '0')}:${selectedMinute}:00`

      // Call API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kundli`, {
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
        throw new Error('Failed to calculate rising sign')
      }

      const data = await response.json()

      // Store data in sessionStorage
      sessionStorage.setItem('risingSignCalculatorData', JSON.stringify({
        name: formData.name,
        dateOfBirth: `${dayNumber}/${monthNumber}/${selectedYear}`,
        timeOfBirth: `${selectedHour}:${selectedMinute} ${selectedAmPm}`,
        placeOfBirth: formData.pob,
        risingSign: data.lagna,
        risingSignDegree: data.lagna_degree,
        planets: data.planets
      }))

      // Redirect to results page
      router.push('/calculators/rising-sign-calculator/results')
    } catch (error) {
      console.error('Error calculating rising sign:', error)
      alert('Error calculating rising sign. Please check your details and try again.')
    } finally {
      setIsSubmitting(false)
    }
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
            <span>Rising Sign Calculator</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-lg font-medium text-sm mb-4">
              Rising Sign / Ascendant
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Discover Your Rising Sign
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find out how the world sees you and the mask you wear in new situations
            </p>
          </div>

          {/* Info Alert */}
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">Exact Birth Time is Critical</h3>
                <p className="text-sm text-red-800 dark:text-red-200">
                  Your rising sign changes every 2 hours. Even a 10-minute difference can lead to a completely different sign.
                  Please ensure you have your exact birth time from your birth certificate or hospital records before proceeding.
                </p>
              </div>
            </div>
          </div>

          {/* Calculator Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <form onSubmit={handleCalculate} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Date of Birth *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Day</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
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
                  <Clock className="inline w-4 h-4 mr-1" />
                  Exact Time of Birth *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Hour</option>
                    {hours.map(hour => (
                      <option key={hour} value={hour}>{hour}</option>
                    ))}
                  </select>
                  <select
                    value={selectedMinute}
                    onChange={(e) => setSelectedMinute(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Minute</option>
                    {minutes.map(minute => (
                      <option key={minute} value={minute}>{minute}</option>
                    ))}
                  </select>
                  <select
                    value={selectedAmPm}
                    onChange={(e) => setSelectedAmPm(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              {/* Place of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Place of Birth *
                </label>
                {isLoaded && !loadError ? (
                  <Autocomplete
                    onLoad={onLoadAutocomplete}
                    onPlaceChanged={onPlaceChanged}
                    options={{
                      types: ['(cities)'],
                    }}
                  >
                    <input
                      type="text"
                      defaultValue={formData.pob}
                      onChange={(e) => setFormData({ ...formData, pob: e.target.value })}
                      placeholder="Type and select your birth city"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </Autocomplete>
                ) : (
                  <input
                    type="text"
                    value={formData.pob}
                    onChange={(e) => setFormData({ ...formData, pob: e.target.value })}
                    placeholder="Enter your birth city"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  />
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Calculate My Rising Sign
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What is a Rising Sign?
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Your rising sign, also called your ascendant, is the zodiac sign that was rising on the eastern horizon at the exact moment you were born.
                It's like your spiritual front door—the first impression you give off to people before they really get to know you.
              </p>

              <p>
                <strong className="text-gray-900 dark:text-white">Unlike your sun sign,</strong> which stays the same for nearly a month, your rising sign shifts every two hours.
                That makes it incredibly specific to your exact birth time. Even if you and someone else share the same birthday, your rising signs could be completely different,
                and that can make a big difference in how you both move through the world.
              </p>

              <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800 mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">What Your Rising Sign Reveals:</h3>
                <ul className="text-sm space-y-2 list-disc list-inside">
                  <li><strong className="text-gray-900 dark:text-white">First Impressions:</strong> How others perceive you when they first meet you</li>
                  <li><strong className="text-gray-900 dark:text-white">Physical Appearance:</strong> Your natural style, mannerisms, and energy</li>
                  <li><strong className="text-gray-900 dark:text-white">Life Approach:</strong> How you navigate new situations and challenges</li>
                  <li><strong className="text-gray-900 dark:text-white">Chart Foundation:</strong> Sets up all 12 houses in your birth chart</li>
                  <li><strong className="text-gray-900 dark:text-white">Personal Evolution:</strong> The qualities you're here to grow into</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 mt-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  <Sunrise className="inline w-5 h-5 mr-2" />
                  Real Example
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Meet Meera, a software engineer from Delhi. She always saw herself as shy and analytical (her Virgo sun),
                  but friends described her as confident and magnetic. It wasn't until she discovered her Leo rising that things clicked.
                  Her Leo ascendant gave off bold, radiant energy that others instantly noticed, even though her inner self was more reserved.
                </p>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                <strong>Important:</strong> To get accurate results, you must know your exact birth time. Check your birth certificate,
                hospital records, or ask family members. Vague answers like "early morning" or "after lunch" won't work—the more precise, the better!
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
