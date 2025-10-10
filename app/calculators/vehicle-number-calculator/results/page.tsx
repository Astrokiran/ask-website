"use client"

import { useState, useEffect } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Calendar, Car, Sparkles, Star, AlertCircle, CheckCircle2, Heart, TrendingUp, Info } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { analyzeVehicleNumber, type VehicleNumerologyResult } from '@/lib/vehicle-numerology'

interface StoredData {
  dateOfBirth: string
  vehicleNumber: string
}

export default function VehicleNumberResults() {
  const router = useRouter()
  const [storedData, setStoredData] = useState<StoredData | null>(null)
  const [result, setResult] = useState<VehicleNumerologyResult | null>(null)

  useEffect(() => {
    const data = sessionStorage.getItem('vehicleNumberCalculatorData')
    if (!data) {
      router.push('/calculators/vehicle-number-calculator')
      return
    }

    try {
      const parsedData: StoredData = JSON.parse(data)
      setStoredData(parsedData)

      // Parse date (format: DD/MM/YYYY)
      const [day, month, year] = parsedData.dateOfBirth.split('/')
      const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

      // Calculate analysis
      const analysis = analyzeVehicleNumber(birthDate, parsedData.vehicleNumber)
      setResult(analysis)
    } catch (error) {
      console.error('Error analyzing vehicle number:', error)
      alert('Error analyzing vehicle number. Please try again.')
      router.push('/calculators/vehicle-number-calculator')
    }
  }, [router])

  if (!storedData || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p>Analyzing your vehicle number...</p>
        </div>
      </div>
    )
  }

  // Color scheme based on compatibility level
  const getColorScheme = () => {
    const score = result.compatibilityScore
    if (score >= 85) {
      return {
        bg: 'bg-green-50 dark:bg-green-950/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-600 dark:text-green-400',
        progressBg: 'bg-green-500'
      }
    } else if (score >= 70) {
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-600 dark:text-blue-400',
        progressBg: 'bg-blue-500'
      }
    } else if (score >= 55) {
      return {
        bg: 'bg-yellow-50 dark:bg-yellow-950/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-600 dark:text-yellow-400',
        progressBg: 'bg-yellow-500'
      }
    } else if (score >= 40) {
      return {
        bg: 'bg-orange-50 dark:bg-orange-950/20',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-600 dark:text-orange-400',
        progressBg: 'bg-orange-500'
      }
    } else {
      return {
        bg: 'bg-red-50 dark:bg-red-950/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-600 dark:text-red-400',
        progressBg: 'bg-red-500'
      }
    }
  }

  const colorScheme = getColorScheme()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4 sm:pt-6 md:pt-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/calculators" className="hover:text-emerald-600 dark:hover:text-emerald-400">
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <Link href="/calculators/vehicle-number-calculator" className="hover:text-emerald-600 dark:hover:text-emerald-400">
              Vehicle Number Numerology
            </Link>
            <span className="mx-2">/</span>
            <span>Results</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Your Vehicle Number Analysis
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Complete numerology analysis and compatibility report
            </p>
          </div>

          {/* Input Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="font-medium text-gray-900 dark:text-white">{storedData.dateOfBirth}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Vehicle Number</p>
                  <p className="font-medium text-gray-900 dark:text-white uppercase">{result.vehicleNumberDetails.original}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Compatibility Score Card */}
          <div className={`rounded-xl border-2 p-8 mb-8 ${colorScheme.bg} ${colorScheme.border}`}>
            <div className="text-center mb-6">
              <div className="text-6xl mb-2">{result.compatibilityLevel.icon}</div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {result.compatibilityLevel.level}
              </h2>
              <p className={`text-2xl font-bold ${colorScheme.text}`}>
                {result.compatibilityScore}% Compatible
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6">
              <div
                className={`${colorScheme.progressBg} h-4 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${result.compatibilityScore}%` }}
              ></div>
            </div>

            {/* Number Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Life Path Number</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{result.lifePathNumber}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Ruled by:</strong> {result.lifePathTraits.planet}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Vehicle Number</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{result.vehicleNumberDetails.reducedNumber}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Ruled by:</strong> {result.vehicleNumberTraits.planet}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              Detailed Analysis
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {result.analysis}
            </p>
          </div>

          {/* Number Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Number Breakdown</h2>
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800 mb-6">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Calculation:</strong> {result.vehicleNumberDetails.original} → Digits: {result.vehicleNumberDetails.digits} →
                Sum: {result.vehicleNumberDetails.sum} → Reduced: {result.vehicleNumberDetails.reducedNumber}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Life Path Traits */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Your Life Path ({result.lifePathNumber})
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Planet</p>
                    <p className="text-gray-600 dark:text-gray-400">{result.lifePathTraits.planet}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Energy</p>
                    <p className="text-gray-600 dark:text-gray-400">{result.lifePathTraits.energy}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Key Traits</p>
                    <div className="flex flex-wrap gap-2">
                      {result.lifePathTraits.traits.map((trait, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-900 rounded-full text-xs text-gray-700 dark:text-gray-300">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Number Traits */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Car className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Vehicle Number ({result.vehicleNumberDetails.reducedNumber})
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Planet</p>
                    <p className="text-gray-600 dark:text-gray-400">{result.vehicleNumberTraits.planet}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Energy</p>
                    <p className="text-gray-600 dark:text-gray-400">{result.vehicleNumberTraits.energy}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Key Traits</p>
                    <div className="flex flex-wrap gap-2">
                      {result.vehicleNumberTraits.traits.map((trait, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-900 rounded-full text-xs text-gray-700 dark:text-gray-300">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Best For</p>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {result.vehicleNumberTraits.bestFor.map((purpose, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-emerald-600 dark:text-emerald-400">•</span>
                          {purpose}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              Recommendations
            </h2>
            <div className="space-y-3">
              {result.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  {index === 0 ? (
                    result.compatibilityScore >= 70 ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    )
                  ) : (
                    <div className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  )}
                  <p className="text-gray-700 dark:text-gray-300">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Lucky Numbers */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              Your Lucky Numbers
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              If you're choosing a new vehicle number, consider these numbers that are highly compatible with your life path:
            </p>
            <div className="flex flex-wrap gap-3">
              {result.luckyNumbers.map((num) => (
                <div
                  key={num}
                  className="w-16 h-16 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-2xl font-bold"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>

          {/* Remedies */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
              Remedies & Tips
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {result.compatibilityScore >= 70
                ? 'Enhance the positive energy of your vehicle with these remedies:'
                : 'Use these remedies to improve the energy alignment with your vehicle:'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.remedies.map((remedy, index) => (
                <div key={index} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{remedy}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Important Note
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              While numerology provides valuable insights about energy compatibility, remember that safe driving practices, regular vehicle maintenance, and following traffic rules are always the most important factors for a smooth and safe journey. Use this analysis as guidance, not as a substitute for responsible vehicle ownership.
            </p>
          </div>

          {/* Calculate Again Button */}
          <div className="text-center mb-8">
            <Link
              href="/calculators/vehicle-number-calculator"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Check Another Vehicle Number
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
