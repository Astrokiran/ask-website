"use client"

import { useState, useEffect } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Clock, Calendar, User, MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface DashaResult {
  name: string
  date_of_birth: string
  time_of_birth: string
  place_of_birth: string
  vimshottari_dasha: {
    planet: string
    start_date: string
    end_date: string
    duration_years: number
    sub_periods: {
      planet: string
      start_date: string
      end_date: string
      duration_years: number
    }[]
  }[]
  planets: {
    planet: string
    sign: string
    house: number
    degree_dms: string
  }[]
}

export default function DashaResults() {
  const router = useRouter()
  const [result, setResult] = useState<DashaResult | null>(null)
  const [expandedDasha, setExpandedDasha] = useState<string | null>(null)
  const [currentMahaDasha, setCurrentMahaDasha] = useState<any>(null)
  const [currentAntarDasha, setCurrentAntarDasha] = useState<any>(null)

  useEffect(() => {
    const data = sessionStorage.getItem('dashaCalculatorResult')
    if (!data) {
      router.push('/calculators/dasha-calculator')
      return
    }

    const parsedResult: DashaResult = JSON.parse(data)
    setResult(parsedResult)

    // Calculate current dasha based on today's date
    const today = new Date()

    // Find current Mahadasha
    const currentMaha = parsedResult.vimshottari_dasha.find(dasha => {
      const start = new Date(dasha.start_date)
      const end = new Date(dasha.end_date)
      return today >= start && today <= end
    })

    if (currentMaha) {
      setCurrentMahaDasha(currentMaha)

      // Find current Antardasha
      const currentAntar = currentMaha.sub_periods?.find(sub => {
        const start = new Date(sub.start_date)
        const end = new Date(sub.end_date)
        return today >= start && today <= end
      })

      setCurrentAntarDasha(currentAntar)
      setExpandedDasha(currentMaha.planet) // Auto-expand current Mahadasha
    }
  }, [router])

  const getPlanetInfo = (planetName: string) => {
    return result?.planets.find(p => p.planet.toLowerCase() === planetName.toLowerCase())
  }

  const formatDate = (dateStr: string, isBirth = false) => {
    if (isBirth) return 'Birth'
    const date = new Date(dateStr)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const toggleDasha = (planet: string) => {
    setExpandedDasha(expandedDasha === planet ? null : planet)
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p>Loading your Dasha periods...</p>
        </div>
      </div>
    )
  }

  const planetColors: { [key: string]: { bg: string; border: string; text: string } } = {
    'Sun': { bg: 'bg-orange-50 dark:bg-orange-950/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-600 dark:text-orange-400' },
    'Moon': { bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-600 dark:text-blue-400' },
    'Mars': { bg: 'bg-red-50 dark:bg-red-950/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-600 dark:text-red-400' },
    'Mercury': { bg: 'bg-green-50 dark:bg-green-950/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-600 dark:text-green-400' },
    'Jupiter': { bg: 'bg-yellow-50 dark:bg-yellow-950/20', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-600 dark:text-yellow-400' },
    'Venus': { bg: 'bg-pink-50 dark:bg-pink-950/20', border: 'border-pink-200 dark:border-pink-800', text: 'text-pink-600 dark:text-pink-400' },
    'Saturn': { bg: 'bg-purple-50 dark:bg-purple-950/20', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-600 dark:text-purple-400' },
    'Rahu': { bg: 'bg-indigo-50 dark:bg-indigo-950/20', border: 'border-indigo-200 dark:border-indigo-800', text: 'text-indigo-600 dark:text-indigo-400' },
    'Ketu': { bg: 'bg-gray-50 dark:bg-gray-950/20', border: 'border-gray-200 dark:border-gray-800', text: 'text-gray-600 dark:text-gray-400' },
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4 sm:pt-6 md:pt-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/calculators" className="hover:text-amber-600 dark:hover:text-amber-400">
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <Link href="/calculators/dasha-calculator" className="hover:text-amber-600 dark:hover:text-amber-400">
              Vimshottari Dasha
            </Link>
            <span className="mx-2">/</span>
            <span>Results</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Your Vimshottari Dasha Periods
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              Complete planetary timeline and current dasha details
            </p>
          </div>

          {/* Birth Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Birth Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{result.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="font-medium text-gray-900 dark:text-white">{result.date_of_birth}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Time of Birth</p>
                  <p className="font-medium text-gray-900 dark:text-white">{result.time_of_birth}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Place of Birth</p>
                  <p className="font-medium text-gray-900 dark:text-white">{result.place_of_birth}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Dasha Card */}
          {currentMahaDasha && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl border-2 border-amber-200 dark:border-amber-800 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                Currently Running Dasha
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mahadasha */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-amber-200 dark:border-amber-800">
                  <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400 mb-3">Mahadasha</h3>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentMahaDasha.planet}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Period:</span> {formatDate(currentMahaDasha.start_date, currentMahaDasha.start_date === result.vimshottari_dasha[0]?.start_date)} - {formatDate(currentMahaDasha.end_date)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Duration:</span> {currentMahaDasha.duration_years} years
                    </p>
                    {getPlanetInfo(currentMahaDasha.planet) && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-gray-900 dark:text-white">{currentMahaDasha.planet}</span> is in <span className="font-medium text-gray-900 dark:text-white">{getPlanetInfo(currentMahaDasha.planet)?.sign}</span> sign and <span className="font-medium text-gray-900 dark:text-white">{getPlanetInfo(currentMahaDasha.planet)?.house}th house</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Antardasha */}
                {currentAntarDasha && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-amber-200 dark:border-amber-800">
                    <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400 mb-3">Antardasha</h3>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentAntarDasha.planet}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Period:</span> {formatDate(currentAntarDasha.start_date)} - {formatDate(currentAntarDasha.end_date)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Duration:</span> {currentAntarDasha.duration_years.toFixed(2)} years
                      </p>
                      {getPlanetInfo(currentAntarDasha.planet) && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium text-gray-900 dark:text-white">{currentAntarDasha.planet}</span> is in <span className="font-medium text-gray-900 dark:text-white">{getPlanetInfo(currentAntarDasha.planet)?.sign}</span> sign and <span className="font-medium text-gray-900 dark:text-white">{getPlanetInfo(currentAntarDasha.planet)?.house}th house</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Complete Dasha Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Complete Vimshottari Dasha Timeline</h2>

            <div className="space-y-4">
              {result.vimshottari_dasha.map((dasha, index) => {
                const planetInfo = getPlanetInfo(dasha.planet)
                const colors = planetColors[dasha.planet] || planetColors['Sun']
                const isExpanded = expandedDasha === dasha.planet
                const isCurrent = currentMahaDasha?.planet === dasha.planet

                return (
                  <div key={index} className={`border-2 rounded-lg overflow-hidden transition-all ${isCurrent ? 'border-amber-400 dark:border-amber-600' : colors.border}`}>
                    {/* Mahadasha Header */}
                    <div
                      onClick={() => toggleDasha(dasha.planet)}
                      className={`${colors.bg} p-4 cursor-pointer hover:opacity-80 transition-opacity`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`text-xl font-bold ${colors.text}`}>
                              {dasha.planet} Mahadasha
                              {isCurrent && <span className="ml-2 text-xs bg-amber-500 text-white px-2 py-1 rounded">Current</span>}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {formatDate(dasha.start_date, index === 0)} - {formatDate(dasha.end_date)} ({dasha.duration_years} years)
                          </p>
                          {planetInfo && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Your <span className="font-semibold text-gray-900 dark:text-white">{dasha.planet}</span> is in <span className="font-semibold text-gray-900 dark:text-white">{planetInfo.sign}</span> sign and <span className="font-semibold text-gray-900 dark:text-white">{planetInfo.house}th house</span>
                            </p>
                          )}
                        </div>
                        <div>
                          {isExpanded ? (
                            <ChevronUp className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Antardasha List */}
                    {isExpanded && dasha.sub_periods && (
                      <div className="bg-white dark:bg-gray-900 p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Antardashas under {dasha.planet} Mahadasha:</h4>
                        <div className="space-y-2">
                          {dasha.sub_periods.map((sub, subIndex) => {
                            const isCurrentAntar = currentAntarDasha?.planet === sub.planet && isCurrent
                            return (
                              <div
                                key={subIndex}
                                className={`flex items-center justify-between p-3 rounded-lg border ${
                                  isCurrentAntar
                                    ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700'
                                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                }`}
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {dasha.planet} - {sub.planet}
                                    {isCurrentAntar && <span className="ml-2 text-xs bg-amber-500 text-white px-2 py-1 rounded">Current</span>}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {formatDate(sub.start_date)} - {formatDate(sub.end_date)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {sub.duration_years.toFixed(2)} years
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Understanding Your Dasha Periods</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                <strong className="text-gray-900 dark:text-white">Mahadasha</strong> represents the major planetary period that influences your life. Each planet rules for a specific number of years, bringing its unique energy and effects.
              </p>
              <p>
                <strong className="text-gray-900 dark:text-white">Antardasha</strong> is the sub-period within a Mahadasha. It shows the combined influence of two planets and helps predict specific events and timing.
              </p>
              <p>
                The effects of each Dasha depend on the planet's placement in your birth chart (sign and house), its strength, aspects, and relationships with other planets.
              </p>
              <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800 mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How to use this information:</h3>
                <ul className="text-sm space-y-2 list-disc list-inside">
                  <li>Focus on your current Mahadasha and Antardasha for present circumstances</li>
                  <li>Plan ahead by understanding upcoming planetary periods</li>
                  <li>The planet's house position shows which life area is activated</li>
                  <li>The sign placement indicates how the planet expresses its energy</li>
                  <li>Consult an astrologer for personalized predictions and remedies</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Calculate Again Button */}
          <div className="text-center mb-8">
            <Link
              href="/calculators/dasha-calculator"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
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
