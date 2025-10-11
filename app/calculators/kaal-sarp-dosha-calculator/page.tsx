"use client"

import { useState, useRef } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, AlertCircle, Sparkles, User, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'

const libraries: ("places")[] = ['places']

export default function KaalSarpDoshaCalculator() {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doshas`, {
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
        throw new Error('Failed to calculate Kaal Sarp Dosha')
      }

      const data = await response.json()

      // Store data in sessionStorage
      sessionStorage.setItem('kaalSarpDoshaCalculatorData', JSON.stringify({
        name: formData.name,
        dateOfBirth: `${dayNumber}/${monthNumber}/${selectedYear}`,
        timeOfBirth: `${selectedHour}:${selectedMinute} ${selectedAmPm}`,
        placeOfBirth: formData.pob,
        kaalSarpDosha: data.kalasarpa_dosha
      }))

      // Redirect to results page
      router.push('/calculators/kaal-sarp-dosha-calculator/results')
    } catch (error) {
      console.error('Error calculating Kaal Sarp Dosha:', error)
      alert('Error calculating Kaal Sarp Dosha. Please check your details and try again.')
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
            <Link href="/calculators" className="hover:text-purple-600 dark:hover:text-purple-400">
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <span>Kaal Sarp Dosha Calculator</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-lg font-medium text-sm mb-4">
              Kaal Sarp Dosha / Kala Sarpa Yoga
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Check Your Kaal Sarp Dosha
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover if you have Kaal Sarp Dosha and learn about its type and effects
            </p>
          </div>

          {/* Info Alert */}
          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">What is Kaal Sarp Dosha?</h3>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Kaal Sarp Dosha occurs when all seven planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn)
                  are hemmed between Rahu and Ketu (the lunar nodes). There are 12 types based on Rahu's house position.
                  While considered challenging, it can also bring transformation and spiritual growth.
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
                  <User className="inline w-4 h-4 mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
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
                  <Clock className="inline w-4 h-4 mr-1" />
                  Exact Time of Birth *
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
                      <option key={minute} value={minute}>{minute}</option>
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
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  </Autocomplete>
                ) : (
                  <input
                    type="text"
                    value={formData.pob}
                    onChange={(e) => setFormData({ ...formData, pob: e.target.value })}
                    placeholder="Enter your birth city"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Check Kaal Sarp Dosha
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Understanding Kaal Sarp Dosha
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Kaal Sarp Dosha is a significant astrological combination that occurs when all seven major planets are positioned
                between Rahu (North Node) and Ketu (South Node) in a birth chart. The term "Kaal" means time/death and "Sarp"
                means serpent, symbolizing the karmic nature of this yoga.
              </p>

              <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800 mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">12 Types of Kaal Sarp Dosha:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {[
                    '1. Anant Kaal Sarp - Rahu in 1st',
                    '2. Kulik Kaal Sarp - Rahu in 2nd',
                    '3. Vasuki Kaal Sarp - Rahu in 3rd',
                    '4. Shankhapal Kaal Sarp - Rahu in 4th',
                    '5. Padam Kaal Sarp - Rahu in 5th',
                    '6. Mahapadam Kaal Sarp - Rahu in 6th',
                    '7. Takshak Kaal Sarp - Rahu in 7th',
                    '8. Karkotak Kaal Sarp - Rahu in 8th',
                    '9. Shankhachur Kaal Sarp - Rahu in 9th',
                    '10. Ghatak Kaal Sarp - Rahu in 10th',
                    '11. Vishdhar Kaal Sarp - Rahu in 11th',
                    '12. Sheshnag Kaal Sarp - Rahu in 12th'
                  ].map((type, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-purple-600 dark:text-purple-400">•</span>
                      <span>{type}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 mt-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  <AlertCircle className="inline w-5 h-5 mr-2" />
                  Effects of Kaal Sarp Dosha
                </h3>
                <ul className="text-sm space-y-1 list-disc list-inside text-blue-800 dark:text-blue-200">
                  <li>Delays and obstacles in various life areas</li>
                  <li>Mental anxiety and disturbed sleep (snake-related dreams)</li>
                  <li>Sudden ups and downs in career and relationships</li>
                  <li>Feeling of being stuck despite hard work</li>
                  <li>Health issues that are difficult to diagnose</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800 mt-4">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Positive Aspects
                </h3>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Not all is negative! Kaal Sarp Dosha can also bring intense spiritual growth, psychic abilities,
                  and success in occult sciences. Many successful people have this yoga. It pushes you toward your
                  life purpose and helps burn karmic debts. With proper remedies and awareness, this dosha can be
                  transformed into a powerful yoga for spiritual evolution.
                </p>
              </div>

              <p className="mt-4">
                <strong className="text-gray-900 dark:text-white">Note:</strong> The severity of Kaal Sarp Dosha depends
                on the overall strength of the chart, planetary periods (dashas), and whether planets are outside the
                Rahu-Ketu axis by even a small degree (partial dosha is less severe).
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
