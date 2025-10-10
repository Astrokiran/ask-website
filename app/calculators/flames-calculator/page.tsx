"use client"

import { useState } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Heart, Flame, Users, HeartHandshake, UserPlus, X } from 'lucide-react'
import Link from 'next/link'

const FLAMES_MEANINGS = {
  F: { label: 'Friends', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-950/20', borderColor: 'border-blue-200 dark:border-blue-800', description: 'You two are destined to be great friends! Your bond is built on trust, understanding, and mutual respect.' },
  L: { label: 'Lovers', icon: Heart, color: 'text-pink-500', bgColor: 'bg-pink-50 dark:bg-pink-950/20', borderColor: 'border-pink-200 dark:border-pink-800', description: 'Love is in the air! You share a romantic connection filled with passion and deep affection.' },
  A: { label: 'Affection', icon: HeartHandshake, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-950/20', borderColor: 'border-purple-200 dark:border-purple-800', description: 'There\'s a special affection between you two - a caring and tender relationship full of warmth.' },
  M: { label: 'Marriage', icon: Heart, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-950/20', borderColor: 'border-red-200 dark:border-red-800', description: 'Wedding bells might be in your future! You share a deep, committed connection.' },
  E: { label: 'Enemies', icon: X, color: 'text-gray-500', bgColor: 'bg-gray-50 dark:bg-gray-950/20', borderColor: 'border-gray-200 dark:border-gray-800', description: 'Opposite personalities create friction. But remember, even enemies can become friends!' },
  S: { label: 'Siblings', icon: UserPlus, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-950/20', borderColor: 'border-orange-200 dark:border-orange-800', description: 'You share a sibling-like bond - playful, caring, and built on a foundation of familial love.' },
}

export default function FlamesCalculator() {
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [calculationSteps, setCalculationSteps] = useState<string[]>([])

  const calculateFlames = (n1: string, n2: string) => {
    // Convert to uppercase and remove spaces
    const name1Clean = n1.toUpperCase().replace(/\s/g, '')
    const name2Clean = n2.toUpperCase().replace(/\s/g, '')

    const steps: string[] = []
    steps.push(`Name 1: ${name1Clean}`)
    steps.push(`Name 2: ${name2Clean}`)

    // Create arrays for both names
    const name1Array = name1Clean.split('')
    const name2Array = name2Clean.split('')

    // Find and remove common letters
    const name1Remaining = [...name1Array]
    const name2Remaining = [...name2Array]

    for (let i = name1Remaining.length - 1; i >= 0; i--) {
      const letter = name1Remaining[i]
      const indexInName2 = name2Remaining.indexOf(letter)

      if (indexInName2 !== -1) {
        name1Remaining.splice(i, 1)
        name2Remaining.splice(indexInName2, 1)
      }
    }

    steps.push(`After removing common letters:`)
    steps.push(`Remaining from Name 1: ${name1Remaining.join('') || 'None'}`)
    steps.push(`Remaining from Name 2: ${name2Remaining.join('') || 'None'}`)

    // Count remaining letters
    const remainingCount = name1Remaining.length + name2Remaining.length
    steps.push(`Total remaining letters: ${remainingCount}`)

    if (remainingCount === 0) {
      steps.push('All letters matched! Result: Friends (F)')
      return { result: 'F', steps }
    }

    // FLAMES algorithm
    let flames = ['F', 'L', 'A', 'M', 'E', 'S']
    let currentIndex = 0

    while (flames.length > 1) {
      // Count and remove
      currentIndex = (currentIndex + remainingCount - 1) % flames.length
      const removed = flames.splice(currentIndex, 1)[0]
      steps.push(`Strike out: ${removed}, Remaining: ${flames.join(' ')}`)

      // Adjust index if we're at the end
      if (currentIndex >= flames.length && flames.length > 0) {
        currentIndex = 0
      }
    }

    const finalResult = flames[0]
    steps.push(`Final Result: ${FLAMES_MEANINGS[finalResult as keyof typeof FLAMES_MEANINGS].label} (${finalResult})`)

    return { result: finalResult, steps }
  }

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name1.trim() || !name2.trim()) {
      alert('Please enter both names')
      return
    }

    const { result: flamesResult, steps } = calculateFlames(name1.trim(), name2.trim())
    setResult(flamesResult)
    setCalculationSteps(steps)
    setShowResult(true)
  }

  const handleReset = () => {
    setName1('')
    setName2('')
    setResult(null)
    setShowResult(false)
    setCalculationSteps([])
  }

  const resultData = result ? FLAMES_MEANINGS[result as keyof typeof FLAMES_MEANINGS] : null

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
            <span>FLAMES</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg font-medium text-sm mb-4">
              FLAMES Calculator
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              FLAMES Relationship Test
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find out your relationship status using the classic FLAMES game
            </p>
          </div>

          {/* Calculator Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <form onSubmit={handleCalculate} className="space-y-6">
              {/* Name Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={name1}
                    onChange={(e) => setName1(e.target.value)}
                    placeholder="Enter first name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Second Name
                  </label>
                  <input
                    type="text"
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                    placeholder="Enter second name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-semibold"
                >
                  <Flame className="w-5 h-5 mr-2" />
                  Calculate FLAMES
                </Button>
                {showResult && (
                  <Button
                    type="button"
                    onClick={handleReset}
                    variant="outline"
                    className="px-6 py-6"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </form>

            {/* Result Display */}
            {showResult && resultData && (
              <div className="mt-8 space-y-6 animate-fadeIn">
                {/* Main Result */}
                <div className={`p-8 bg-gradient-to-br ${resultData.bgColor} rounded-xl border-2 ${resultData.borderColor}`}>
                  <div className="text-center">
                    <resultData.icon className={`w-20 h-20 mx-auto ${resultData.color} mb-6`} />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {name1} & {name2}
                    </h2>
                    <div className={`text-6xl font-bold ${resultData.color} mb-4`}>
                      {result}
                    </div>
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      {resultData.label}
                    </div>
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                      {resultData.description}
                    </p>
                  </div>
                </div>

                {/* Calculation Steps */}
                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">How it was calculated:</h3>
                  <div className="space-y-2">
                    {calculationSteps.map((step, index) => (
                      <p key={index} className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                        {step}
                      </p>
                    ))}
                  </div>
                </div>

                {/* All FLAMES Meanings */}
                <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">FLAMES Meanings:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(FLAMES_MEANINGS).map(([letter, data]) => (
                      <div
                        key={letter}
                        className={`p-3 rounded-lg border ${data.borderColor} ${data.bgColor} ${
                          result === letter ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <data.icon className={`w-4 h-4 ${data.color}`} />
                          <span className={`font-bold ${data.color}`}>{letter}</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">{data.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Flame className="w-6 h-6 text-red-500" />
              About FLAMES
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                FLAMES is a popular game among young people to determine the relationship between two individuals. The name is an acronym that stands for <strong className="text-gray-900 dark:text-white">F</strong>riends, <strong className="text-gray-900 dark:text-white">L</strong>overs, <strong className="text-gray-900 dark:text-white">A</strong>ffection, <strong className="text-gray-900 dark:text-white">M</strong>arriage, <strong className="text-gray-900 dark:text-white">E</strong>nemies, and <strong className="text-gray-900 dark:text-white">S</strong>iblings.
              </p>
              <p>
                The game is played by taking the names of two people, removing the common letters, and then using the count of remaining letters to strike out letters from "FLAMES" until only one letter remains. That final letter reveals the relationship between the two people!
              </p>
              <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 border border-red-200 dark:border-red-800 mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How it works:</h3>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Write both names and remove all spaces</li>
                  <li>Cross out common letters (one-to-one matching)</li>
                  <li>Count the remaining letters</li>
                  <li>Use that count to strike out letters from FLAMES in circular fashion</li>
                  <li>The last remaining letter is your result!</li>
                </ol>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                <strong>Note:</strong> FLAMES is a fun game and should be taken lightly as entertainment. Real relationships are built on understanding, communication, and mutual respect!
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
