"use client"

import { useState, useEffect } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Calendar, Clock, MapPin, User, AlertCircle, CheckCircle2, Zap, Sparkles, Info, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface KaalSarpDoshaData {
  is_present: boolean
  present: boolean
  type: string
  one_line: string
  name: string
  report: {
    house_id: number
    report: string
  }
}

interface StoredData {
  name: string
  dateOfBirth: string
  timeOfBirth: string
  placeOfBirth: string
  kaalSarpDosha: KaalSarpDoshaData
}

export default function KaalSarpDoshaResults() {
  const router = useRouter()
  const [storedData, setStoredData] = useState<StoredData | null>(null)

  useEffect(() => {
    const data = sessionStorage.getItem('kaalSarpDoshaCalculatorData')
    if (!data) {
      router.push('/calculators/kaal-sarp-dosha-calculator')
      return
    }

    try {
      const parsedData: StoredData = JSON.parse(data)
      setStoredData(parsedData)
    } catch (error) {
      console.error('Error parsing Kaal Sarp Dosha data:', error)
      alert('Error loading results. Please try again.')
      router.push('/calculators/kaal-sarp-dosha-calculator')
    }
  }, [router])

  if (!storedData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading your Kaal Sarp Dosha analysis...</p>
        </div>
      </div>
    )
  }

  const { kaalSarpDosha } = storedData
  const isPresent = kaalSarpDosha.is_present || kaalSarpDosha.present

  const getColorScheme = () => {
    if (!isPresent) {
      return {
        bg: 'bg-green-50 dark:bg-green-950/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-600 dark:text-green-400',
        icon: CheckCircle2
      }
    } else {
      return {
        bg: 'bg-purple-50 dark:bg-purple-950/20',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-600 dark:text-purple-400',
        icon: Zap
      }
    }
  }

  const colorScheme = getColorScheme()
  const Icon = colorScheme.icon

  const remedies = [
    'Visit Kaal Sarp Dosha Nivaran temples (Trimbakeshwar, Ujjain)',
    'Perform Kaal Sarp Dosha Puja on Nag Panchami',
    'Chant Rahu-Ketu mantras daily',
    'Recite "Om Namah Shivaya" 108 times',
    'Offer milk to Shiva Lingam on Mondays',
    'Float coconut in running water on Saturdays',
    'Donate to snake conservation organizations',
    'Feed birds daily, especially crows',
    'Keep a Kaal Sarp Yantra in your home',
    'Wear Gomed (Hessonite) and Cat\'s Eye after consultation',
    'Avoid harming snakes and other creatures',
    'Practice meditation and yoga for mental peace',
    'Perform Nag Puja on specific days',
    'Light a diya near a Peepal tree on Saturdays',
    'Help orphans and less fortunate people',
    'Chant Maha Mrityunjaya Mantra'
  ]

  const doshaTypes = [
    { name: 'Anant Kaal Sarp', house: 1, effects: 'Affects health, personality, and self-confidence. Creates obstacles in life purpose.' },
    { name: 'Kulik Kaal Sarp', house: 2, effects: 'Impacts family, wealth, and speech. Financial instability and family disputes.' },
    { name: 'Vasuki Kaal Sarp', house: 3, effects: 'Affects courage, siblings, and short travels. Lack of confidence and sibling issues.' },
    { name: 'Shankhapal Kaal Sarp', house: 4, effects: 'Impacts mother, home, and mental peace. Property disputes and lack of domestic harmony.' },
    { name: 'Padam Kaal Sarp', house: 5, effects: 'Affects children, education, and intelligence. Delays in childbirth and education obstacles.' },
    { name: 'Mahapadam Kaal Sarp', house: 6, effects: 'Impacts enemies, health, and loans. Legal issues and chronic health problems.' },
    { name: 'Takshak Kaal Sarp', house: 7, effects: 'Affects marriage and partnerships. Delays or problems in marriage and business partnerships.' },
    { name: 'Karkotak Kaal Sarp', house: 8, effects: 'Impacts longevity, occult, and sudden events. Accidents and sudden setbacks.' },
    { name: 'Shankhachur Kaal Sarp', house: 9, effects: 'Affects luck, father, and spirituality. Lack of father\'s blessings and fortune.' },
    { name: 'Ghatak Kaal Sarp', house: 10, effects: 'Impacts career and reputation. Career obstacles and loss of social status.' },
    { name: 'Vishdhar Kaal Sarp', house: 11, effects: 'Affects gains, friends, and wishes. Unfulfilled desires and false friends.' },
    { name: 'Sheshnag Kaal Sarp', house: 12, effects: 'Impacts expenses, losses, and moksha. High expenses and sleep disturbances, but strong spirituality.' }
  ]

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
            <Link href="/calculators/kaal-sarp-dosha-calculator" className="hover:text-purple-600 dark:hover:text-purple-400">
              Kaal Sarp Dosha Calculator
            </Link>
            <span className="mx-2">/</span>
            <span>Results</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Your Kaal Sarp Dosha Analysis
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Complete analysis of Rahu-Ketu axis and planetary positions
            </p>
          </div>

          {/* Birth Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Birth Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <p className="font-medium text-gray-900 dark:text-white">{storedData.dateOfBirth}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Time of Birth</p>
                  <p className="font-medium text-gray-900 dark:text-white">{storedData.timeOfBirth}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Place of Birth</p>
                  <p className="font-medium text-gray-900 dark:text-white">{storedData.placeOfBirth}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Status Card */}
          <div className={`rounded-xl border-2 p-8 mb-8 ${colorScheme.bg} ${colorScheme.border}`}>
            <div className="text-center">
              <Icon className={`w-16 h-16 mx-auto mb-4 ${colorScheme.text}`} />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {!isPresent ? (
                  'No Kaal Sarp Dosha'
                ) : (
                  kaalSarpDosha.name || 'Kaal Sarp Dosha Present'
                )}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {kaalSarpDosha.one_line || kaalSarpDosha.type}
              </p>

              {isPresent && kaalSarpDosha.report && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-2xl mx-auto">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Rahu Position:</strong> {kaalSarpDosha.report.house_id}th House
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Analysis */}
          {kaalSarpDosha.report && kaalSarpDosha.report.report && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Info className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                Detailed Analysis
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {kaalSarpDosha.report.report}
              </p>
            </div>
          )}

          {/* All Dosha Types Reference */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              12 Types of Kaal Sarp Dosha
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {isPresent
                ? `You have ${kaalSarpDosha.name || 'Kaal Sarp Dosha'}. Here's information about all 12 types:`
                : 'You don\'t have Kaal Sarp Dosha. Here\'s information about all 12 types for reference:'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doshaTypes.map((type, index) => {
                const isCurrentType = isPresent && kaalSarpDosha.name && kaalSarpDosha.name.toLowerCase().includes(type.name.split(' ')[0].toLowerCase())
                return (
                  <div
                    key={index}
                    className={`rounded-lg p-4 border ${
                      isCurrentType
                        ? 'bg-purple-50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-700'
                        : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {isCurrentType && (
                        <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                      )}
                      <h3 className={`font-semibold ${isCurrentType ? 'text-purple-900 dark:text-purple-100' : 'text-gray-900 dark:text-white'}`}>
                        {type.name}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Rahu in {type.house}th House</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{type.effects}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Effects on Life */}
          {isPresent && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Common Effects of Kaal Sarp Dosha
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                  <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">Challenges</h3>
                  <ul className="text-sm space-y-1 text-red-800 dark:text-red-200">
                    <li>• Delays in important life events</li>
                    <li>• Sudden obstacles and setbacks</li>
                    <li>• Mental anxiety and disturbed sleep</li>
                    <li>• Snake-related dreams</li>
                    <li>• Feeling stuck despite hard work</li>
                    <li>• Health issues</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Positive Aspects</h3>
                  <ul className="text-sm space-y-1 text-green-800 dark:text-green-200">
                    <li>• Enhanced spiritual growth</li>
                    <li>• Psychic and intuitive abilities</li>
                    <li>• Success in occult sciences</li>
                    <li>• Karmic cleansing</li>
                    <li>• Deep transformation</li>
                    <li>• Connection with higher purpose</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Remedies */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              {isPresent ? 'Remedies for Kaal Sarp Dosha' : 'General Protection Remedies'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {isPresent
                ? 'These remedies can help reduce the negative effects and enhance positive transformation:'
                : 'While you don\'t have Kaal Sarp Dosha, these remedies bring general protection and spiritual growth:'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {remedies.map((remedy, index) => (
                <div key={index} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{remedy}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Important Understanding
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Kaal Sarp Dosha is often misunderstood as purely negative. In reality, it's a powerful karmic yoga that
              accelerates spiritual evolution. Many successful people, spiritual leaders, and achievers have this dosha.
              It creates intense experiences that push you toward your true life purpose. With awareness, remedies, and
              positive action, this dosha can be transformed into a blessing. The key is to embrace its transformative
              power rather than fear it. Remember: your actions, choices, and mindset matter more than any planetary position.
            </p>
          </div>

          {/* Calculate Again Button */}
          <div className="text-center mb-8">
            <Link
              href="/calculators/kaal-sarp-dosha-calculator"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
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
