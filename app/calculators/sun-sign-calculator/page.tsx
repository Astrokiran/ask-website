"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Sun, Calendar, Clock, MapPin, User } from 'lucide-react'
import Link from 'next/link'

const libraries: ("places")[] = ['places'];

export default function SunSignCalculator() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    tob: '',
    pob: '',
  })

  const [selectedDay, setSelectedDay] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedHour, setSelectedHour] = useState('')
  const [selectedMinute, setSelectedMinute] = useState('')
  const [selectedAmPm, setSelectedAmPm] = useState('AM')

  const [autocompleteInstance, setAutocompleteInstance] = useState<google.maps.places.Autocomplete | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

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
      if (errors.pob) {
        setErrors(prevErrors => ({ ...prevErrors, pob: '' }))
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!selectedDay || !selectedMonth || !selectedYear) {
      newErrors.dob = 'Full Date of Birth is required'
    }
    if (!selectedHour || !selectedMinute) {
      newErrors.tob = 'Time of Birth is required'
    }
    if (!formData.pob.trim()) newErrors.pob = 'Place of Birth is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    if (selectedDay && selectedMonth && selectedYear) {
      const formattedMonth = selectedMonth.padStart(2, '0')
      const formattedDay = selectedDay.padStart(2, '0')
      setFormData(prev => ({ ...prev, dob: `${selectedYear}-${formattedMonth}-${formattedDay}` }))
      if (errors.dob) setErrors(prevErrors => ({ ...prevErrors, dob: '' }))
    }
  }, [selectedDay, selectedMonth, selectedYear])

  useEffect(() => {
    if (selectedHour && selectedMinute) {
      let hour24 = parseInt(selectedHour, 10)
      if (selectedAmPm === 'PM' && hour24 < 12) hour24 += 12
      if (selectedAmPm === 'AM' && hour24 === 12) hour24 = 0

      const formattedHour = hour24.toString().padStart(2, '0')
      const formattedMinute = selectedMinute.padStart(2, '0')
      setFormData(prev => ({ ...prev, tob: `${formattedHour}:${formattedMinute}:00` }))
      if (errors.tob) setErrors(prevErrors => ({ ...prevErrors, tob: '' }))
    }
  }, [selectedHour, selectedMinute, selectedAmPm])

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)

    const [year, month, day] = formData.dob.split('-')
    const formattedDobForApi = `${day}/${month}/${year}`

    const [hourStr, minuteStr] = formData.tob.split(':')
    let hour = parseInt(hourStr, 10)
    const minute = parseInt(minuteStr, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    hour = hour % 12
    hour = hour ? hour : 12
    const formattedTobForApi = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}${ampm}`

    const apiPayload = {
      name: formData.name,
      date_of_birth: formattedDobForApi,
      time_of_birth: formattedTobForApi,
      place_of_birth: formData.pob,
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/calculators/sun-sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      })

      if (!response.ok) {
        throw new Error('Failed to calculate Sun Sign')
      }

      const data = await response.json()

      // Store result in sessionStorage and navigate to results page
      sessionStorage.setItem('sunSignCalculatorResult', JSON.stringify(data))
      router.push('/calculators/sun-sign-calculator/results')
    } catch (error) {
      console.error('Error calculating Sun Sign:', error)
      alert('Error calculating Sun Sign. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i)
  const monthOptions = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' },
    { value: '3', label: 'March' }, { value: '4', label: 'April' },
    { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' },
    { value: '9', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
  ]
  const hourOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'))
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4 sm:pt-6 md:pt-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/calculators" className="hover:text-yellow-600 dark:hover:text-yellow-400">
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <span>Sun Sign</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-lg font-medium text-sm mb-4">
              Sun Sign Calculator
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Find Your Sun Sign (Zodiac Sign)
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover your sun sign based on your birth details
            </p>
          </div>

          {/* Calculator Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <form onSubmit={handleCalculate} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none`}
                  placeholder="Enter your name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Date of Birth
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className={`px-3 py-3 rounded-lg border ${errors.dob ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none`}
                  >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className={`px-3 py-3 rounded-lg border ${errors.dob ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none`}
                  >
                    <option value="">Month</option>
                    {monthOptions.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className={`px-3 py-3 rounded-lg border ${errors.dob ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none`}
                  >
                    <option value="">Year</option>
                    {yearOptions.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
              </div>

              {/* Time of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Time of Birth
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(e.target.value)}
                    className={`px-3 py-3 rounded-lg border ${errors.tob ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none`}
                  >
                    <option value="">Hour</option>
                    {hourOptions.map(hour => (
                      <option key={hour} value={hour}>{hour}</option>
                    ))}
                  </select>
                  <select
                    value={selectedMinute}
                    onChange={(e) => setSelectedMinute(e.target.value)}
                    className={`px-3 py-3 rounded-lg border ${errors.tob ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none`}
                  >
                    <option value="">Minute</option>
                    {minuteOptions.map(minute => (
                      <option key={minute} value={minute}>{minute}</option>
                    ))}
                  </select>
                  <select
                    value={selectedAmPm}
                    onChange={(e) => setSelectedAmPm(e.target.value)}
                    className={`px-3 py-3 rounded-lg border ${errors.tob ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none`}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
                {errors.tob && <p className="text-red-500 text-xs mt-1">{errors.tob}</p>}
              </div>

              {/* Place of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Place of Birth
                </label>
                {isLoaded && !loadError ? (
                  <Autocomplete
                    onLoad={onLoadAutocomplete}
                    onPlaceChanged={onPlaceChanged}
                    options={{ types: ['(cities)'] }}
                  >
                    <input
                      type="text"
                      defaultValue={formData.pob}
                      onChange={(e) => setFormData(prev => ({ ...prev, pob: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.pob ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 outline-none`}
                      placeholder="Type and select your city"
                    />
                  </Autocomplete>
                ) : (
                  <input
                    type="text"
                    value={formData.pob}
                    onChange={(e) => setFormData(prev => ({ ...prev, pob: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.pob ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
                    placeholder="Enter place of birth (Maps loading...)"
                  />
                )}
                {errors.pob && <p className="text-red-500 text-xs mt-1">{errors.pob}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-6 text-lg font-semibold disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculating...
                  </span>
                ) : (
                  <>
                    <Sun className="w-5 h-5 mr-2" />
                    Calculate Sun Sign
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              About Sun Sign
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Your Sun Sign (also known as your Zodiac Sign) is determined by the position of the Sun at the time of your birth. It represents your core personality, ego, and life force.
              </p>
              <p>
                The Sun Sign is the most well-known aspect of astrology and provides insights into your basic nature, motivations, and how you express yourself to the world.
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                ✓ Based on your birth date and time<br />
                ✓ Represents your core identity and ego<br />
                ✓ Widely used in Western astrology
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
