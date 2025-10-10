"use client"

import { useEffect, useState } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Hash, ArrowLeft, Calendar, User, Heart, Eye, Target, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface NumerologyResult {
  name: string
  birth_info: {
    date_of_birth: string
  }
  numerology: {
    life_path_number: {
      number: number
      meaning: string
      calculation: string
    }
    destiny_number: {
      number: number
      meaning: string
      calculation: string
    }
    soul_urge_number: {
      number: number
      meaning: string
      calculation: string
    }
    personality_number: {
      number: number
      meaning: string
      calculation: string
    }
    lucky_numbers: number[]
    master_number: boolean
  }
}

export default function NumerologyResults() {
  const router = useRouter()
  const [result, setResult] = useState<NumerologyResult | null>(null)

  useEffect(() => {
    const storedResult = sessionStorage.getItem('numerologyCalculatorResult')
    if (storedResult) {
      setResult(JSON.parse(storedResult))
    } else {
      router.push('/calculators/numerology-calculator')
    }
  }, [router])

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4 sm:pt-6 md:pt-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-5xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/calculators" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <Link href="/calculators/numerology-calculator" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Numerology
            </Link>
            <span className="mx-2">/</span>
            <span>Results</span>
          </div>

          {/* Back Button */}
          <Link href="/calculators/numerology-calculator">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Calculate Again
            </Button>
          </Link>

          {/* Results Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Your Numerology Report
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover the hidden meanings in your numbers
              </p>
            </div>

            {/* Birth Details */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-500">Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{result.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-500">Date of Birth</p>
                    <p className="font-medium text-gray-900 dark:text-white">{result.birth_info.date_of_birth}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Numbers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Life Path Number */}
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl border-2 border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Life Path Number</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your life's purpose</p>
                  </div>
                </div>
                <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">
                  {result.numerology.life_path_number.number}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {result.numerology.life_path_number.meaning}
                </p>
              </div>

              {/* Destiny Number */}
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-600 dark:bg-purple-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Destiny Number</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your life's mission</p>
                  </div>
                </div>
                <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-3">
                  {result.numerology.destiny_number.number}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {result.numerology.destiny_number.meaning}
                </p>
              </div>

              {/* Soul Urge Number */}
              <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-xl border-2 border-pink-200 dark:border-pink-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-pink-600 dark:bg-pink-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Soul Urge Number</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your heart's desire</p>
                  </div>
                </div>
                <div className="text-5xl font-bold text-pink-600 dark:text-pink-400 mb-3">
                  {result.numerology.soul_urge_number.number}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {result.numerology.soul_urge_number.meaning}
                </p>
              </div>

              {/* Personality Number */}
              <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-xl border-2 border-cyan-200 dark:border-cyan-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-cyan-600 dark:bg-cyan-500 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Personality Number</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">How others see you</p>
                  </div>
                </div>
                <div className="text-5xl font-bold text-cyan-600 dark:text-cyan-400 mb-3">
                  {result.numerology.personality_number.number}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {result.numerology.personality_number.meaning}
                </p>
              </div>
            </div>

            {/* Lucky Numbers */}
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg border-2 border-indigo-200 dark:border-indigo-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Your Lucky Numbers
              </h3>
              <div className="flex flex-wrap gap-3">
                {result.numerology.lucky_numbers.map((number, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg flex items-center justify-center text-xl font-bold"
                  >
                    {number}
                  </div>
                ))}
              </div>
              {result.numerology.master_number && (
                <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                  <strong>Master Number Detected!</strong> You have a Master Number in your chart, which carries special spiritual significance.
                </p>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className="space-y-8 mb-8">
            {/* What is Numerology? */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <Hash className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                What is Numerology?
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Numerology is an ancient metaphysical science that explores the mystical relationship between numbers and life events. Dating back thousands of years to ancient civilizations including Babylon, Egypt, Greece, and China, numerology reveals how numbers influence our lives, personalities, and destinies.
                </p>
                <p>
                  The modern system of numerology is largely based on the work of Greek mathematician and philosopher Pythagoras (569-470 BCE), who believed that the entire universe could be expressed through numbers. He discovered that numbers have their own unique vibrations and energies that affect everything in existence.
                </p>
                <p>
                  In numerology, every number from 1 to 9 carries specific characteristics and meanings. Additionally, there are three "Master Numbers" - 11, 22, and 33 - which carry higher spiritual vibrations and are not reduced to single digits.
                </p>
                <p>
                  Your numerology chart is calculated using two key pieces of information:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-gray-900 dark:text-white">Your birth date</strong> - Used to calculate your Life Path Number</li>
                  <li><strong className="text-gray-900 dark:text-white">Your full name</strong> - Used to calculate Destiny, Soul Urge, and Personality Numbers</li>
                </ul>
              </div>
            </div>

            {/* How is it Calculated? */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                How Are Your Numbers Calculated?
              </h2>
              <div className="space-y-6 text-gray-600 dark:text-gray-400">
                <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Your Details:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                      <span><strong>Name:</strong> {result.name}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
                      <span><strong>Date of Birth:</strong> {result.birth_info.date_of_birth}</span>
                    </li>
                  </ul>
                </div>

                {/* Life Path Number Calculation */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Life Path Number: {result.numerology.life_path_number.number}
                  </h3>
                  <p className="mb-3">
                    Your Life Path Number is calculated by reducing your birth date to a single digit (or Master Number):
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                      {result.numerology.life_path_number.calculation}
                    </p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Your Life Path Number is <strong className="text-indigo-600 dark:text-indigo-400">{result.numerology.life_path_number.number}</strong>
                  </p>
                </div>

                {/* Destiny Number Calculation */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Destiny Number: {result.numerology.destiny_number.number}
                  </h3>
                  <p className="mb-3">
                    Your Destiny Number is calculated from your full birth name ({result.name}) using the Pythagorean system:
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                      {result.numerology.destiny_number.calculation}
                    </p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Your Destiny Number is <strong className="text-purple-600 dark:text-purple-400">{result.numerology.destiny_number.number}</strong>
                  </p>
                </div>

                {/* Soul Urge Number Calculation */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    Soul Urge Number: {result.numerology.soul_urge_number.number}
                  </h3>
                  <p className="mb-3">
                    Your Soul Urge Number (also called Heart's Desire) is calculated using only the vowels in your name:
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                      {result.numerology.soul_urge_number.calculation}
                    </p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Your Soul Urge Number is <strong className="text-pink-600 dark:text-pink-400">{result.numerology.soul_urge_number.number}</strong>
                  </p>
                </div>

                {/* Personality Number Calculation */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    Personality Number: {result.numerology.personality_number.number}
                  </h3>
                  <p className="mb-3">
                    Your Personality Number is calculated using only the consonants in your name:
                  </p>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                      {result.numerology.personality_number.calculation}
                    </p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Your Personality Number is <strong className="text-cyan-600 dark:text-cyan-400">{result.numerology.personality_number.number}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* How is it Used? */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                How Are Your Numerology Numbers Used?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/10 dark:to-purple-950/10 rounded-lg border border-indigo-200 dark:border-indigo-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Self-Discovery
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Understanding your core numbers helps you recognize your strengths, weaknesses, natural talents, and life purpose, providing deep self-awareness.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/10 dark:to-purple-950/10 rounded-lg border border-indigo-200 dark:border-indigo-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    Relationship Compatibility
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Comparing numerology numbers between partners helps assess compatibility, understand relationship dynamics, and navigate challenges effectively.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/10 dark:to-purple-950/10 rounded-lg border border-indigo-200 dark:border-indigo-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Career Guidance
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Your numbers reveal your natural abilities and career paths that align with your life purpose, helping you make better professional decisions.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/10 dark:to-purple-950/10 rounded-lg border border-indigo-200 dark:border-indigo-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Life Cycles
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Personal year, month, and day numbers help you understand current energies and choose auspicious timing for important decisions and events.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/10 dark:to-purple-950/10 rounded-lg border border-indigo-200 dark:border-indigo-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    Personal Development
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Knowing your challenges and karmic lessons helps you focus on personal growth areas and work towards becoming your best self.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/10 dark:to-purple-950/10 rounded-lg border border-indigo-200 dark:border-indigo-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Hash className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Decision Making
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Numerology provides insights that help you make aligned decisions about relationships, career moves, relocations, and life changes.
                  </p>
                </div>
              </div>
            </div>

            {/* Why Does it Matter? */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Why Does Your Numerology Matter?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Understand Your Life Purpose</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Your Life Path Number reveals your soul's mission in this lifetime. Understanding this helps you align your actions and decisions with your true purpose, leading to greater fulfillment and meaning.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Unlock Your Potential</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Your Destiny Number shows your innate talents and abilities. Knowing these helps you leverage your natural gifts and work on areas that need development to reach your full potential.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Honor Your Inner Truth</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Your Soul Urge Number reveals what truly matters to you at the deepest level. Living in alignment with these core desires leads to authentic happiness and emotional fulfillment.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Improve First Impressions</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Your Personality Number shows how others perceive you. Understanding this helps you present yourself more effectively and bridge the gap between how you see yourself and how others see you.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <Hash className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Navigate Life Transitions</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Numerology provides a framework for understanding life cycles and patterns. This helps you navigate major transitions, anticipate challenges, and make the most of opportunities.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Connect to Ancient Wisdom</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Numerology has been used for thousands of years across cultures worldwide. Exploring your numbers connects you to this ancient wisdom tradition and provides time-tested insights for modern life.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-900 dark:to-purple-900 rounded-xl shadow-lg p-6 sm:p-8 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Explore More About Your Cosmic Blueprint</h2>
            <p className="mb-6 text-indigo-100">
              Get your complete Kundli analysis with detailed predictions, planetary positions, and personalized insights.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/free-kundli">
                <Button className="bg-white text-indigo-600 hover:bg-gray-100">
                  Get Free Kundli
                </Button>
              </Link>
              <Link href="/calculators">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  More Calculators
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
