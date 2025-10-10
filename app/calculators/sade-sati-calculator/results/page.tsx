"use client"

import { useState, useEffect } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Calendar, User, MapPin, Clock, AlertTriangle, CheckCircle, TrendingUp, Heart, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { calculateSadeSati, type SadeSatiResult } from '@/lib/sade-sati-calculator'

interface StoredResult {
  name: string
  date_of_birth: string
  time_of_birth: string
  place_of_birth: string
  moon_sign: string
  moon_sign_sanskrit: string
  moon_degree: string
}

export default function SadeSatiResults() {
  const router = useRouter()
  const [storedData, setStoredData] = useState<StoredResult | null>(null)
  const [sadeSatiResult, setSadeSatiResult] = useState<SadeSatiResult | null>(null)

  useEffect(() => {
    const data = sessionStorage.getItem('sadeSatiCalculatorResult')
    if (!data) {
      router.push('/calculators/sade-sati-calculator')
      return
    }

    const parsedData: StoredResult = JSON.parse(data)
    setStoredData(parsedData)

    // Calculate Sade Sati using the moon sign
    try {
      const result = calculateSadeSati(parsedData.moon_sign)
      setSadeSatiResult(result)
    } catch (error) {
      console.error('Error calculating Sade Sati:', error)
      alert('Error calculating Sade Sati. Please try again.')
      router.push('/calculators/sade-sati-calculator')
    }
  }, [router])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const day = date.getDate().toString().padStart(2, '0')
    const month = date.toLocaleString('default', { month: 'short' })
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  if (!storedData || !sadeSatiResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Calculating your Sade Sati status...</p>
        </div>
      </div>
    )
  }

  const phaseColors = {
    rising: { bg: 'bg-yellow-50 dark:bg-yellow-950/20', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-600 dark:text-yellow-400' },
    peak: { bg: 'bg-red-50 dark:bg-red-950/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-600 dark:text-red-400' },
    setting: { bg: 'bg-orange-50 dark:bg-orange-950/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-600 dark:text-orange-400' },
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4 sm:pt-6 md:pt-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/calculators" className="hover:text-purple-600 dark:hover:text-purple-400">
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <Link href="/calculators/sade-sati-calculator" className="hover:text-purple-600 dark:hover:text-purple-400">
              Shani Sade Sati
            </Link>
            <span className="mx-2">/</span>
            <span>Results</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Your Sade Sati Analysis
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Complete Saturn transit analysis and guidance
            </p>
          </div>

          {/* Birth Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Birth Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{storedData.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="font-medium text-gray-900 dark:text-white">{storedData.date_of_birth}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Time of Birth</p>
                  <p className="font-medium text-gray-900 dark:text-white">{storedData.time_of_birth}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Place of Birth</p>
                  <p className="font-medium text-gray-900 dark:text-white">{storedData.place_of_birth}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Moon Sign (Rashi)</p>
                  <p className="font-medium text-gray-900 dark:text-white">{storedData.moon_sign_sanskrit} ({storedData.moon_sign})</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Status Card */}
          {sadeSatiResult.isActive ? (
            <div className={`rounded-xl border-2 p-8 mb-8 ${phaseColors[sadeSatiResult.phase!].bg} ${phaseColors[sadeSatiResult.phase!].border}`}>
              <div className="text-center">
                <AlertTriangle className={`w-16 h-16 mx-auto mb-4 ${phaseColors[sadeSatiResult.phase!].text}`} />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  You are in Sade Sati Period
                </h2>
                <p className={`text-xl font-semibold ${phaseColors[sadeSatiResult.phase!].text} mb-4`}>
                  {sadeSatiResult.phaseLabel}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-left">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Phase Duration</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {sadeSatiResult.currentPhaseStart && formatDate(sadeSatiResult.currentPhaseStart)} - {sadeSatiResult.currentPhaseEnd && formatDate(sadeSatiResult.currentPhaseEnd)}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Complete Sade Sati Period</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {sadeSatiResult.sadeSatiStart && formatDate(sadeSatiResult.sadeSatiStart)} - {sadeSatiResult.sadeSatiEnd && formatDate(sadeSatiResult.sadeSatiEnd)}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Impact Level</p>
                    <p className={`font-bold ${
                      sadeSatiResult.impactLevel === 'High' ? 'text-red-600 dark:text-red-400' :
                      sadeSatiResult.impactLevel === 'Moderate' ? 'text-orange-600 dark:text-orange-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {sadeSatiResult.impactLevel}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Saturn Currently In</p>
                    <p className="font-bold text-gray-900 dark:text-white">{sadeSatiResult.currentSaturnSign}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border-2 border-green-200 dark:border-green-800 p-8 mb-8">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  You are NOT in Sade Sati
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Saturn is not currently transiting through the critical houses from your Moon sign
                </p>
                {sadeSatiResult.nextSadeSatiStart && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl mx-auto">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Next Sade Sati Period</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Your next Sade Sati will begin in approximately <span className="font-bold text-gray-900 dark:text-white">{sadeSatiResult.yearsUntilStart} years</span>
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(sadeSatiResult.nextSadeSatiStart)} - {sadeSatiResult.nextSadeSatiEnd && formatDate(sadeSatiResult.nextSadeSatiEnd)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Phase Description */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {sadeSatiResult.isActive ? 'Current Phase Analysis' : 'About This Period'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {sadeSatiResult.phaseDescription}
            </p>
          </div>

          {/* Affected Life Areas */}
          {sadeSatiResult.isActive && sadeSatiResult.lifeAreas.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Affected Life Areas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sadeSatiResult.lifeAreas.map((area, index) => (
                  <div key={index} className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                    <p className="font-medium text-gray-900 dark:text-white">{area}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remedies */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
              Remedies & Guidance
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {sadeSatiResult.isActive ?
                'These remedies can help reduce the negative effects and maximize the positive outcomes of Sade Sati:' :
                'These remedies will help you prepare for future Saturn transits and maintain spiritual balance:'
              }
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sadeSatiResult.remedies.map((remedy, index) => (
                <div key={index} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{remedy}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Current Planetary Positions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Current Position Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Moon Sign</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{sadeSatiResult.natalMoonSign}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Saturn Currently In</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{sadeSatiResult.currentSaturnSign}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">House Position from Moon</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{sadeSatiResult.housePosition}th House</p>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Important Note</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              While Sade Sati is often viewed negatively, it's actually Saturn's way of helping you grow. This period removes what doesn't serve you and builds character, discipline, and spiritual maturity. The challenges faced during Sade Sati often lead to the greatest personal transformations.
            </p>
          </div>

          {/* Calculate Again Button */}
          <div className="text-center mb-8">
            <Link
              href="/calculators/sade-sati-calculator"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Calculate for Another Person
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
