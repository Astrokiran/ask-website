"use client"

import { useState, useEffect } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Calendar, Clock, MapPin, User, Heart, AlertCircle, CheckCircle2, XCircle, Shield, Sparkles, TrendingUp, Info } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface MangalDoshaData {
  is_present: boolean
  is_cancelled: boolean
  report: string
  manglik_present_rule: {
    based_on_aspect: string[]
    based_on_house: string[]
  }
  manglik_cancel_rule: string[]
  is_mars_manglik_cancelled: boolean
  manglik_status: string
  percentage_manglik_present: number
  percentage_manglik_after_cancellation: number
  manglik_report: string
}

interface StoredData {
  name: string
  dateOfBirth: string
  timeOfBirth: string
  placeOfBirth: string
  mangalDosha: MangalDoshaData
}

export default function MangalDoshaResults() {
  const router = useRouter()
  const [storedData, setStoredData] = useState<StoredData | null>(null)

  useEffect(() => {
    const data = sessionStorage.getItem('mangalDoshaCalculatorData')
    if (!data) {
      router.push('/calculators/mangal-dosha-calculator')
      return
    }

    try {
      const parsedData: StoredData = JSON.parse(data)
      setStoredData(parsedData)
    } catch (error) {
      console.error('Error parsing Mangal Dosha data:', error)
      alert('Error loading results. Please try again.')
      router.push('/calculators/mangal-dosha-calculator')
    }
  }, [router])

  if (!storedData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading your Mangal Dosha analysis...</p>
        </div>
      </div>
    )
  }

  const { mangalDosha } = storedData
  const finalPercentage = mangalDosha.percentage_manglik_after_cancellation

  // Determine severity
  const getSeverity = () => {
    if (!mangalDosha.is_present) {
      return { level: 'No Dosha', color: 'green', icon: CheckCircle2 }
    }
    if (mangalDosha.is_cancelled) {
      return { level: 'Cancelled', color: 'blue', icon: Shield }
    }
    if (finalPercentage >= 70) {
      return { level: 'High', color: 'red', icon: AlertCircle }
    } else if (finalPercentage >= 40) {
      return { level: 'Moderate', color: 'orange', icon: AlertCircle }
    } else {
      return { level: 'Low', color: 'yellow', icon: AlertCircle }
    }
  }

  const severity = getSeverity()

  const getColorScheme = () => {
    if (severity.color === 'green') {
      return {
        bg: 'bg-green-50 dark:bg-green-950/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-600 dark:text-green-400',
        progressBg: 'bg-green-500'
      }
    } else if (severity.color === 'blue') {
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-600 dark:text-blue-400',
        progressBg: 'bg-blue-500'
      }
    } else if (severity.color === 'yellow') {
      return {
        bg: 'bg-yellow-50 dark:bg-yellow-950/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-600 dark:text-yellow-400',
        progressBg: 'bg-yellow-500'
      }
    } else if (severity.color === 'orange') {
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
  const Icon = severity.icon

  const remedies = [
    'Chant Hanuman Chalisa daily',
    'Visit Hanuman temple on Tuesdays',
    'Donate red lentils (masoor dal) on Tuesdays',
    'Wear red coral (Moonga) gemstone after consulting an astrologer',
    'Fast on Tuesdays',
    'Recite Mars (Mangal) mantra: "Om Angarakaya Namaha"',
    'Perform Mars Shanti Puja',
    'Feed birds and animals, especially on Tuesdays',
    'Keep good relations with siblings',
    'Help the less fortunate',
    'Maintain patience in relationships',
    'Plant red flowering plants'
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4 sm:pt-6 md:pt-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/calculators" className="hover:text-red-600 dark:hover:text-red-400">
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <Link href="/calculators/mangal-dosha-calculator" className="hover:text-red-600 dark:hover:text-red-400">
              Mangal Dosha Calculator
            </Link>
            <span className="mx-2">/</span>
            <span>Results</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Your Mangal Dosha Analysis
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Complete analysis of Mars placement and its effects
            </p>
          </div>

          {/* Birth Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Birth Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{storedData.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="font-medium text-gray-900 dark:text-white">{storedData.dateOfBirth}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Time of Birth</p>
                  <p className="font-medium text-gray-900 dark:text-white">{storedData.timeOfBirth}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Place of Birth</p>
                  <p className="font-medium text-gray-900 dark:text-white">{storedData.placeOfBirth}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Status Card */}
          <div className={`rounded-xl border-2 p-8 mb-8 ${colorScheme.bg} ${colorScheme.border}`}>
            <div className="text-center mb-6">
              <Icon className={`w-16 h-16 mx-auto mb-4 ${colorScheme.text}`} />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {!mangalDosha.is_present ? (
                  'No Mangal Dosha'
                ) : mangalDosha.is_cancelled ? (
                  'Mangal Dosha - Cancelled'
                ) : (
                  `Mangal Dosha Present - ${severity.level} Severity`
                )}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {mangalDosha.manglik_status}
              </p>

              {/* Percentage Display */}
              {mangalDosha.is_present && (
                <>
                  <div className="max-w-md mx-auto mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Initial Severity</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {mangalDosha.percentage_manglik_present}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-red-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${mangalDosha.percentage_manglik_present}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="max-w-md mx-auto">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">After Cancellation</span>
                      <span className={`font-bold ${colorScheme.text}`}>
                        {finalPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`${colorScheme.progressBg} h-3 rounded-full transition-all duration-1000`}
                        style={{ width: `${finalPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-red-600 dark:text-red-400" />
              Detailed Analysis
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {mangalDosha.manglik_report || mangalDosha.report}
            </p>
          </div>

          {/* Dosha Formation Rules */}
          {mangalDosha.is_present && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                How Dosha Was Formed
              </h2>

              {mangalDosha.manglik_present_rule.based_on_house.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Based on House Position:</h3>
                  <div className="space-y-2">
                    {mangalDosha.manglik_present_rule.based_on_house.map((rule, index) => (
                      <div key={index} className="flex items-start gap-3 bg-red-50 dark:bg-red-950/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 dark:text-gray-300">{rule}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mangalDosha.manglik_present_rule.based_on_aspect.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Based on Aspects:</h3>
                  <div className="space-y-2">
                    {mangalDosha.manglik_present_rule.based_on_aspect.map((rule, index) => (
                      <div key={index} className="flex items-start gap-3 bg-red-50 dark:bg-red-950/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 dark:text-gray-300">{rule}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cancellation Rules */}
          {mangalDosha.is_present && mangalDosha.manglik_cancel_rule.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                Cancellation Factors
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The following factors are reducing or cancelling the Mangal Dosha effects:
              </p>
              <div className="space-y-2">
                {mangalDosha.manglik_cancel_rule.map((rule, index) => (
                  <div key={index} className="flex items-start gap-3 bg-green-50 dark:bg-green-950/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Marriage Compatibility */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              Marriage Compatibility Guidance
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              {!mangalDosha.is_present ? (
                <p className="text-green-600 dark:text-green-400 font-medium">
                  ✓ You do not have Mangal Dosha. There are no Mars-related restrictions for marriage compatibility.
                  You can marry anyone without concern about Manglik matching.
                </p>
              ) : mangalDosha.is_cancelled ? (
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  ✓ Your Mangal Dosha is cancelled due to the factors mentioned above. The effects are neutralized,
                  and you can proceed with marriage without major concerns. However, it's still good to check overall
                  compatibility with your partner.
                </p>
              ) : finalPercentage >= 70 ? (
                <>
                  <p className="text-red-600 dark:text-red-400 font-medium">
                    ⚠ You have high Mangal Dosha. For best results:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Marry someone who also has Mangal Dosha (mutual cancellation)</li>
                    <li>Consider marrying after age 28 (natural reduction of effects)</li>
                    <li>Perform recommended remedies before marriage</li>
                    <li>Consult with an experienced astrologer for detailed matching</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="text-orange-600 dark:text-orange-400 font-medium">
                    ⚠ You have moderate Mangal Dosha. Recommendations:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Check if your partner also has Mangal Dosha for mutual cancellation</li>
                    <li>Perform remedies regularly to minimize effects</li>
                    <li>Focus on overall horoscope compatibility, not just Manglik status</li>
                    <li>Maintain patience and understanding in relationships</li>
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Remedies */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              Remedies for Mangal Dosha
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {!mangalDosha.is_present
                ? 'While you don\'t have Mangal Dosha, these Mars-strengthening remedies can bring positive energy:'
                : mangalDosha.is_cancelled
                ? 'These remedies will help maintain the cancellation and bring positive Mars energy:'
                : 'These remedies can help reduce the negative effects of Mangal Dosha:'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {remedies.map((remedy, index) => (
                <div key={index} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
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
              Mangal Dosha is just one factor in marriage compatibility. A complete horoscope matching considers
              36 Gunas (Ashtakoota), planetary positions, Dashas, and many other factors. Don't let Mangal Dosha
              alone determine your marriage decisions. Modern astrology also emphasizes that mutual understanding,
              respect, and compatibility at the personality level are equally important. Many couples with Mangal
              Dosha have very happy marriages by following simple remedies and maintaining good communication.
            </p>
          </div>

          {/* Calculate Again Button */}
          <div className="text-center mb-8">
            <Link
              href="/calculators/mangal-dosha-calculator"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Check for Another Person
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
