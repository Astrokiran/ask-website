"use client"

import { useEffect, useState } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { TrendingUp, ArrowLeft, Calendar, Lightbulb, Calculator, Info } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface LifePathResult {
  number: number
  meaning: string
  birthDate: string
}

export default function LifePathResults() {
  const router = useRouter()
  const [result, setResult] = useState<LifePathResult | null>(null)

  useEffect(() => {
    const storedResult = sessionStorage.getItem('lifePathCalculatorResult')
    if (storedResult) {
      setResult(JSON.parse(storedResult))
    } else {
      router.push('/calculators/life-path')
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

  // Format birth date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Get detailed traits for each life path number
  const getDetailedTraits = (number: number) => {
    const traits: { [key: number]: {
      strengths: string[],
      challenges: string[],
      careerPaths: string[],
      compatibility: string
    } } = {
      1: {
        strengths: ['Natural leadership', 'Independence', 'Innovation', 'Courage', 'Determination'],
        challenges: ['Can be overly aggressive', 'Difficulty accepting help', 'Impatience', 'Tendency to dominate'],
        careerPaths: ['Entrepreneur', 'CEO', 'Pioneer', 'Inventor', 'Military Leader', 'Sales Director'],
        compatibility: 'Most compatible with Life Path Numbers 3, 5, and 6'
      },
      2: {
        strengths: ['Diplomacy', 'Cooperation', 'Sensitivity', 'Peacemaking', 'Intuition'],
        challenges: ['Over-sensitivity', 'Indecisiveness', 'Shyness', 'Dependency on others'],
        careerPaths: ['Counselor', 'Mediator', 'Teacher', 'Diplomat', 'Healthcare Worker', 'Therapist'],
        compatibility: 'Most compatible with Life Path Numbers 4, 6, and 8'
      },
      3: {
        strengths: ['Creativity', 'Self-expression', 'Optimism', 'Social skills', 'Inspiration'],
        challenges: ['Scattered energy', 'Superficiality', 'Difficulty focusing', 'Mood swings'],
        careerPaths: ['Artist', 'Writer', 'Entertainer', 'Designer', 'Public Speaker', 'Marketing Professional'],
        compatibility: 'Most compatible with Life Path Numbers 1, 5, and 7'
      },
      4: {
        strengths: ['Practicality', 'Organization', 'Reliability', 'Hard work', 'Stability'],
        challenges: ['Rigidity', 'Resistance to change', 'Workaholic tendencies', 'Inflexibility'],
        careerPaths: ['Accountant', 'Engineer', 'Architect', 'Project Manager', 'Banker', 'Builder'],
        compatibility: 'Most compatible with Life Path Numbers 2, 6, and 8'
      },
      5: {
        strengths: ['Adaptability', 'Freedom-loving', 'Versatility', 'Adventure', 'Progressive thinking'],
        challenges: ['Restlessness', 'Irresponsibility', 'Inconsistency', 'Impulsiveness'],
        careerPaths: ['Travel Guide', 'Journalist', 'Salesperson', 'Entrepreneur', 'Photographer', 'Event Planner'],
        compatibility: 'Most compatible with Life Path Numbers 1, 3, and 7'
      },
      6: {
        strengths: ['Nurturing', 'Responsibility', 'Harmony', 'Teaching', 'Healing'],
        challenges: ['Self-righteousness', 'Worry', 'Interference', 'Perfectionism'],
        careerPaths: ['Teacher', 'Nurse', 'Social Worker', 'Interior Designer', 'Counselor', 'Chef'],
        compatibility: 'Most compatible with Life Path Numbers 2, 3, and 9'
      },
      7: {
        strengths: ['Analytical mind', 'Wisdom', 'Spirituality', 'Intuition', 'Research skills'],
        challenges: ['Isolation', 'Skepticism', 'Coldness', 'Difficulty expressing emotions'],
        careerPaths: ['Researcher', 'Scientist', 'Philosopher', 'Analyst', 'Spiritual Teacher', 'Detective'],
        compatibility: 'Most compatible with Life Path Numbers 3, 5, and 4'
      },
      8: {
        strengths: ['Business acumen', 'Authority', 'Ambition', 'Efficiency', 'Material success'],
        challenges: ['Materialism', 'Workaholism', 'Ruthlessness', 'Power struggles'],
        careerPaths: ['Business Executive', 'Financial Advisor', 'Real Estate Developer', 'Investor', 'CEO', 'Lawyer'],
        compatibility: 'Most compatible with Life Path Numbers 2, 4, and 6'
      },
      9: {
        strengths: ['Compassion', 'Generosity', 'Idealism', 'Artistic talent', 'Global awareness'],
        challenges: ['Emotional volatility', 'Self-sacrifice', 'Difficulty letting go', 'Scattered focus'],
        careerPaths: ['Humanitarian', 'Artist', 'Teacher', 'Healer', 'Environmentalist', 'Philanthropist'],
        compatibility: 'Most compatible with Life Path Numbers 6, 3, and 2'
      },
      11: {
        strengths: ['Spiritual insight', 'Inspiration', 'Idealism', 'Intuition', 'Visionary thinking'],
        challenges: ['Nervous tension', 'Impracticality', 'Unrealistic expectations', 'Anxiety'],
        careerPaths: ['Spiritual Leader', 'Motivational Speaker', 'Artist', 'Inventor', 'Psychologist', 'Counselor'],
        compatibility: 'Most compatible with Life Path Numbers 2, 6, and 9'
      },
      22: {
        strengths: ['Master builder', 'Practical visionary', 'Leadership', 'Organization', 'Global thinking'],
        challenges: ['Stress from high expectations', 'Overwhelm', 'Self-doubt', 'Inner conflict'],
        careerPaths: ['Architect', 'International Business Leader', 'Diplomat', 'Environmental Engineer', 'City Planner'],
        compatibility: 'Most compatible with Life Path Numbers 4, 6, and 11'
      },
      33: {
        strengths: ['Master teacher', 'Selfless service', 'Healing abilities', 'Compassion', 'Nurturing'],
        challenges: ['Martyrdom', 'Emotional burden', 'Difficulty setting boundaries', 'Self-neglect'],
        careerPaths: ['Teacher', 'Spiritual Guide', 'Healer', 'Counselor', 'Social Reformer', 'Charity Leader'],
        compatibility: 'Most compatible with Life Path Numbers 6, 9, and 11'
      }
    }

    return traits[number] || traits[1]
  }

  const traits = getDetailedTraits(result.number)

  // Calculate step-by-step example
  const getCalculationSteps = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    const reduceNumber = (num: number): { result: number, steps: string[] } => {
      const steps: string[] = []
      let current = num

      while (current > 9 && current !== 11 && current !== 22 && current !== 33) {
        const digits = current.toString().split('').map(Number)
        const sum = digits.reduce((a, b) => a + b, 0)
        steps.push(`${current} = ${digits.join(' + ')} = ${sum}`)
        current = sum
      }

      return { result: current, steps }
    }

    const dayReduction = reduceNumber(day)
    const monthReduction = reduceNumber(month)
    const yearReduction = reduceNumber(year)

    const dayResult = dayReduction.result
    const monthResult = monthReduction.result
    const yearResult = yearReduction.result

    const finalSum = dayResult + monthResult + yearResult
    const finalReduction = reduceNumber(finalSum)

    return {
      day,
      month,
      year,
      dayReduction,
      monthReduction,
      yearReduction,
      dayResult,
      monthResult,
      yearResult,
      finalSum,
      finalReduction
    }
  }

  const calculation = getCalculationSteps(result.birthDate)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4 sm:pt-6 md:pt-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-5xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/calculators" className="hover:text-blue-600 dark:hover:text-blue-400">
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <Link href="/calculators/life-path" className="hover:text-blue-600 dark:hover:text-blue-400">
              Life Path Number
            </Link>
            <span className="mx-2">/</span>
            <span>Results</span>
          </div>

          {/* Back Button */}
          <Link href="/calculators/life-path">
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
                Your Life Path Number Report
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover your life's purpose and destiny through numerology
              </p>
            </div>

            {/* Birth Date Display */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Birth Date</h2>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{formatDate(result.birthDate)}</p>
                </div>
              </div>
            </div>

            {/* Main Life Path Number Result */}
            <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 mb-8">
              <div className="text-center">
                <TrendingUp className="w-20 h-20 mx-auto text-blue-500 mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Your Life Path Number
                </h2>
                <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                  {result.number}
                </div>
                <div className="text-xl text-gray-700 dark:text-gray-300">
                  {result.meaning}
                </div>
              </div>
            </div>

            {/* Detailed Traits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Strengths */}
              <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Your Strengths</h3>
                <div className="space-y-2">
                  {traits.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span className="text-gray-600 dark:text-gray-400">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Challenges */}
              <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Growth Areas</h3>
                <div className="space-y-2">
                  {traits.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                      <span className="text-gray-600 dark:text-gray-400">{challenge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Career Paths */}
            <div className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Ideal Career Paths</h3>
              <div className="flex flex-wrap gap-2">
                {traits.careerPaths.map((career, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium"
                  >
                    {career}
                  </span>
                ))}
              </div>
            </div>

            {/* Compatibility */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Relationship Compatibility</h3>
              <p className="text-gray-600 dark:text-gray-400">{traits.compatibility}</p>
            </div>
          </div>

          {/* Educational Content */}
          <div className="space-y-8 mb-8">
            {/* What is Life Path Number? */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                What is a Life Path Number?
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Your Life Path Number is the most significant number in numerology, derived from your complete birth date. It represents your life's journey, revealing your natural talents, inherent abilities, and the lessons you're here to learn. Think of it as your life's blueprint - a guide to understanding your purpose and the path you're meant to walk.
                </p>
                <p>
                  Unlike other numerology numbers that might change or be influenced by different factors, your Life Path Number remains constant throughout your entire life. It's calculated from the day you were born and provides insights into:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your core personality traits and natural tendencies</li>
                  <li>The purpose and direction of your life journey</li>
                  <li>Your innate talents and abilities</li>
                  <li>The challenges and opportunities you'll encounter</li>
                  <li>Your compatibility with others in relationships and partnerships</li>
                  <li>Career paths that align with your natural strengths</li>
                </ul>
                <p>
                  The Life Path Number is considered the most important number in your numerology chart because it influences all aspects of your life - from your career choices and relationships to your personal growth and spiritual development. Understanding your Life Path Number can help you make decisions that align with your true nature and life purpose.
                </p>
              </div>
            </div>

            {/* How is it Calculated? */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                How is Your Life Path Number Calculated?
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  The Life Path Number is calculated by reducing your birth date to a single digit (or master number 11, 22, or 33) through a process of adding the digits together. Let's walk through the calculation using your birth date as an example:
                </p>

                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Your Birth Date: {formatDate(result.birthDate)}</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-2">Step 1: Reduce the Day</p>
                      <p className="text-sm mb-1">Day: {calculation.day}</p>
                      {calculation.dayReduction.steps.length > 0 ? (
                        <>
                          {calculation.dayReduction.steps.map((step, index) => (
                            <p key={index} className="text-sm text-blue-600 dark:text-blue-400">{step}</p>
                          ))}
                          <p className="text-sm font-semibold mt-1">Reduced day: {calculation.dayResult}</p>
                        </>
                      ) : (
                        <p className="text-sm font-semibold">Reduced day: {calculation.dayResult} (already a single digit)</p>
                      )}
                    </div>

                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-2">Step 2: Reduce the Month</p>
                      <p className="text-sm mb-1">Month: {calculation.month}</p>
                      {calculation.monthReduction.steps.length > 0 ? (
                        <>
                          {calculation.monthReduction.steps.map((step, index) => (
                            <p key={index} className="text-sm text-blue-600 dark:text-blue-400">{step}</p>
                          ))}
                          <p className="text-sm font-semibold mt-1">Reduced month: {calculation.monthResult}</p>
                        </>
                      ) : (
                        <p className="text-sm font-semibold">Reduced month: {calculation.monthResult} (already a single digit)</p>
                      )}
                    </div>

                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-2">Step 3: Reduce the Year</p>
                      <p className="text-sm mb-1">Year: {calculation.year}</p>
                      {calculation.yearReduction.steps.map((step, index) => (
                        <p key={index} className="text-sm text-blue-600 dark:text-blue-400">{step}</p>
                      ))}
                      <p className="text-sm font-semibold mt-1">Reduced year: {calculation.yearResult}</p>
                    </div>

                    <div className="pt-4 border-t border-blue-200 dark:border-blue-700">
                      <p className="font-medium text-gray-900 dark:text-white mb-2">Step 4: Add and Reduce Final Sum</p>
                      <p className="text-sm mb-1">
                        {calculation.dayResult} (day) + {calculation.monthResult} (month) + {calculation.yearResult} (year) = {calculation.finalSum}
                      </p>
                      {calculation.finalReduction.steps.length > 0 ? (
                        <>
                          {calculation.finalReduction.steps.map((step, index) => (
                            <p key={index} className="text-sm text-blue-600 dark:text-blue-400">{step}</p>
                          ))}
                        </>
                      ) : (
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {calculation.finalSum} is already a single digit or master number
                        </p>
                      )}
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-3">
                        Your Life Path Number: {result.number}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <strong className="text-gray-900 dark:text-white">Note:</strong> Master numbers 11, 22, and 33 are not reduced to a single digit because they hold special significance in numerology. If your calculation results in 11, 22, or 33 at any stage, that number is preserved as your Life Path Number.
                </p>
              </div>
            </div>

            {/* How is it Used? */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                How is Your Life Path Number Used?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/10 dark:to-indigo-950/10 rounded-lg border border-blue-200 dark:border-blue-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Career Guidance
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Your Life Path Number reveals careers and professional paths that align with your natural talents and abilities, helping you find fulfilling work that matches your true calling.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/10 dark:to-indigo-950/10 rounded-lg border border-blue-200 dark:border-blue-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Relationship Compatibility
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Understanding Life Path Number compatibility helps you navigate relationships more effectively, identifying potential challenges and harmonious connections with partners, friends, and colleagues.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/10 dark:to-indigo-950/10 rounded-lg border border-blue-200 dark:border-blue-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Personal Development
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Your Life Path Number highlights your strengths to develop and challenges to overcome, providing a roadmap for personal growth and self-improvement throughout your life.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/10 dark:to-indigo-950/10 rounded-lg border border-blue-200 dark:border-blue-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Life Decisions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Use your Life Path Number as a guide when making important life decisions, ensuring your choices align with your natural tendencies and ultimate life purpose.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/10 dark:to-indigo-950/10 rounded-lg border border-blue-200 dark:border-blue-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Understanding Others
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Learning about different Life Path Numbers helps you understand others' motivations and behaviors, improving communication and empathy in all your relationships.
                  </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/10 dark:to-indigo-950/10 rounded-lg border border-blue-200 dark:border-blue-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Spiritual Growth
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Your Life Path Number can guide your spiritual journey, revealing lessons your soul came here to learn and the spiritual gifts you possess.
                  </p>
                </div>
              </div>
            </div>

            {/* Why Does it Matter? */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Why Does Your Life Path Number Matter?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Discover Your True Purpose</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Your Life Path Number reveals the fundamental reason for your existence - the lessons you're meant to learn, the contributions you're meant to make, and the legacy you're destined to leave. Understanding this helps you live with intention and meaning.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Maximize Your Potential</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      By understanding your natural strengths and talents indicated by your Life Path Number, you can focus your energy on areas where you're most likely to excel and find fulfillment, rather than struggling against your true nature.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Navigate Life's Challenges</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Every Life Path Number comes with specific challenges and obstacles. Knowing these in advance allows you to prepare for them, develop strategies to overcome them, and view them as opportunities for growth rather than insurmountable problems.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Improve Relationships</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Understanding your Life Path Number and those of the people in your life helps you appreciate different perspectives, communicate more effectively, and build stronger, more harmonious relationships in both personal and professional settings.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Make Aligned Decisions</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      When faced with important life choices - career changes, relationship decisions, major purchases, or life transitions - your Life Path Number serves as a compass, helping you choose paths that align with your authentic self and ultimate purpose.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Achieve Self-Acceptance</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Your Life Path Number validates who you are at your core. It helps you accept and embrace your unique qualities, quirks, and characteristics, reducing self-judgment and increasing self-compassion as you realize you're exactly who you're meant to be.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 rounded-xl shadow-lg p-6 sm:p-8 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Explore More Numerology Insights</h2>
            <p className="mb-6 text-blue-100">
              Discover more about yourself with our comprehensive numerology calculators and get deeper insights into your personality, destiny, and life path.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/calculators">
                <Button className="bg-white text-blue-600 hover:bg-gray-100">
                  More Calculators
                </Button>
              </Link>
              <Link href="/free-kundli">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Get Free Kundli
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
