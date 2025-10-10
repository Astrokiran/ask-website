"use client"

import { useState, useEffect } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Calendar, Smartphone, Sparkles, Star, AlertCircle, CheckCircle2, Heart, TrendingUp, Info, Phone, Activity, Zap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { analyzeMobileNumber, type MobileNumerologyResult } from '@/lib/mobile-numerology'

interface StoredData {
  dateOfBirth: string
  mobileNumber: string
}

export default function MobileNumberResults() {
  const router = useRouter()
  const [storedData, setStoredData] = useState<StoredData | null>(null)
  const [result, setResult] = useState<MobileNumerologyResult | null>(null)

  useEffect(() => {
    const data = sessionStorage.getItem('mobileNumberCalculatorData')
    if (!data) {
      router.push('/calculators/mobile-number-calculator')
      return
    }

    try {
      const parsedData: StoredData = JSON.parse(data)
      setStoredData(parsedData)

      // Parse date (format: DD/MM/YYYY)
      const [day, month, year] = parsedData.dateOfBirth.split('/')
      const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))

      // Calculate analysis
      const analysis = analyzeMobileNumber(birthDate, parsedData.mobileNumber)
      setResult(analysis)
    } catch (error) {
      console.error('Error analyzing mobile number:', error)
      alert('Error analyzing mobile number. Please try again.')
      router.push('/calculators/mobile-number-calculator')
    }
  }, [router])

  if (!storedData || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Analyzing your mobile number...</p>
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
            <Link href="/calculators" className="hover:text-blue-600 dark:hover:text-blue-400">
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <Link href="/calculators/mobile-number-calculator" className="hover:text-blue-600 dark:hover:text-blue-400">
              Mobile Number Numerology
            </Link>
            <span className="mx-2">/</span>
            <span>Results</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Your Mobile Number Analysis
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Complete numerology analysis and energy report
            </p>
          </div>

          {/* Input Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="font-medium text-gray-900 dark:text-white">{storedData.dateOfBirth}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mobile Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">{result.mobileNumberDetails.original}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Driver Number</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{result.driverNumber}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Ruled by:</strong> {result.driverTraits.planet}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Core Mobile Number</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{result.mobileNumberDetails.coreNumber}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Ruled by:</strong> {result.mobileNumberTraits.planet}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Last 4 Digits Number</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{result.mobileNumberDetails.last4CoreNumber}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Ruled by:</strong> {result.last4Traits.planet}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Detailed Analysis
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {result.analysis}
            </p>
          </div>

          {/* Number Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Number Breakdown</h2>
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 mb-6">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Calculation:</strong> {result.mobileNumberDetails.digits} →
                Sum: {result.mobileNumberDetails.sum} →
                Core Number: {result.mobileNumberDetails.coreNumber}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                <strong>Last 4 Digits:</strong> {result.mobileNumberDetails.last4Digits} →
                Sum: {result.mobileNumberDetails.last4Sum} →
                Number: {result.mobileNumberDetails.last4CoreNumber}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Driver Number */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Your Driver Number ({result.driverNumber})
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Energy</p>
                    <p className="text-gray-600 dark:text-gray-400">{result.driverTraits.energy}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lucky Day</p>
                    <p className="text-gray-600 dark:text-gray-400">{result.driverTraits.day}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lucky Color</p>
                    <p className="text-gray-600 dark:text-gray-400">{result.driverTraits.color}</p>
                  </div>
                </div>
              </div>

              {/* Core Mobile Number */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Core Number ({result.mobileNumberDetails.coreNumber})
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Energy</p>
                    <p className="text-gray-600 dark:text-gray-400">{result.mobileNumberTraits.energy}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Key Traits</p>
                    <div className="flex flex-wrap gap-2">
                      {result.mobileNumberTraits.traits.slice(0, 3).map((trait, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-900 rounded-full text-xs text-gray-700 dark:text-gray-300">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Last 4 Digits */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Last 4 Digits ({result.mobileNumberDetails.last4CoreNumber})
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Energy</p>
                    <p className="text-gray-600 dark:text-gray-400">{result.last4Traits.energy}</p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-2 border border-yellow-200 dark:border-yellow-800">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      ⚡ Most active energy - influences daily communications
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Repeating Patterns */}
          {result.repeatingPatternsAnalysis.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Pattern Analysis
              </h2>
              <div className="space-y-3">
                {result.repeatingPatternsAnalysis.map((pattern, index) => (
                  <div key={index} className="flex items-start gap-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                    <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{pattern}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Impact on Life Areas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Impact on Your Life
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💼 Career</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {result.mobileNumberTraits.impact.career}
                </p>
              </div>
              <div className="bg-pink-50 dark:bg-pink-950/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
                <h3 className="font-semibold text-pink-900 dark:text-pink-100 mb-2">❤️ Love</h3>
                <p className="text-sm text-pink-800 dark:text-pink-200">
                  {result.mobileNumberTraits.impact.love}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">🏥 Health</h3>
                <p className="text-sm text-green-800 dark:text-green-200">
                  {result.mobileNumberTraits.impact.health}
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  )}
                  <p className="text-gray-700 dark:text-gray-300">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Lucky Numbers */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Your Lucky Numbers
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              If you're choosing a new mobile number, consider these numbers that are highly compatible with your driver number:
            </p>
            <div className="flex flex-wrap gap-3">
              {result.luckyNumbers.map((num) => (
                <div
                  key={num}
                  className="w-16 h-16 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-2xl font-bold"
                >
                  {num}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              💡 Tip: When choosing a new number, pay special attention to what the last 4 digits add up to.
            </p>
          </div>

          {/* Remedies */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
              Remedies & Tips
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {result.compatibilityScore >= 70
                ? 'Enhance the positive energy of your mobile number with these remedies:'
                : 'Use these remedies to improve the energy alignment with your mobile number:'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.remedies.map((remedy, index) => (
                <div key={index} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
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
              Mobile number numerology provides insights into the energetic patterns affecting your life through your phone.
              While changing your number can help align energies, it's not a substitute for positive actions, clear communication,
              and practical efforts in your career, relationships, and health. Use this knowledge as a guide to make informed
              decisions, but remember that your choices and actions ultimately shape your destiny.
            </p>
          </div>

          {/* Calculate Again Button */}
          <div className="text-center mb-8">
            <Link
              href="/calculators/mobile-number-calculator"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Analyze Another Number
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
