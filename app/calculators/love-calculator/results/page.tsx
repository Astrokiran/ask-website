"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Heart, ArrowLeft, Sparkles, Calculator, BookOpen, Users, Lightbulb } from 'lucide-react'
import Link from 'next/link'

interface LoveResult {
  name1: string
  name2: string
  percentage: number
  message: string
}

export default function LoveCalculatorResults() {
  const router = useRouter()
  const [result, setResult] = useState<LoveResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedResult = sessionStorage.getItem('loveCalculatorResult')
    if (storedResult) {
      setResult(JSON.parse(storedResult))
    } else {
      router.push('/calculators/love-calculator')
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Calculating your love compatibility...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return null
  }

  const getHeartColor = (percentage: number) => {
    if (percentage >= 80) return 'text-pink-500'
    if (percentage >= 60) return 'text-pink-400'
    return 'text-pink-300'
  }

  const getCompatibilityLevel = (percentage: number) => {
    if (percentage >= 90) return 'Perfect Match'
    if (percentage >= 80) return 'Excellent Match'
    if (percentage >= 70) return 'Great Match'
    if (percentage >= 60) return 'Good Match'
    if (percentage >= 50) return 'Fair Match'
    return 'Challenging Match'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4 sm:pt-6 md:pt-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-5xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/calculators" className="hover:text-pink-600 dark:hover:text-pink-400">
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <Link href="/calculators/love-calculator" className="hover:text-pink-600 dark:hover:text-pink-400">
              Love Calculator
            </Link>
            <span className="mx-2">/</span>
            <span>Results</span>
          </div>

          {/* Back Button */}
          <Link href="/calculators/love-calculator">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Calculate Again
            </Button>
          </Link>

          {/* Main Result Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Love Compatibility Report
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Based on name numerology and compatibility analysis
              </p>
            </div>

            {/* Love Percentage Display */}
            <div className="p-8 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-xl border-2 border-pink-200 dark:border-pink-800 mb-8">
              <div className="text-center">
                <Heart className={`w-20 h-20 mx-auto ${getHeartColor(result.percentage)} mb-6 animate-pulse`} />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {result.name1} & {result.name2}
                </h2>
                <div className="text-7xl sm:text-8xl font-bold text-pink-600 dark:text-pink-400 mb-4">
                  {result.percentage}%
                </div>
                <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  {getCompatibilityLevel(result.percentage)}
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  {result.message}
                </p>

                {/* Progress Bar */}
                <div className="w-full max-w-md mx-auto bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-center text-white text-sm font-semibold"
                    style={{ width: `${result.percentage}%` }}
                  >
                    {result.percentage}%
                  </div>
                </div>
              </div>
            </div>

            {/* Names Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-6 bg-pink-50 dark:bg-pink-950/20 rounded-lg border border-pink-200 dark:border-pink-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">First Person</h3>
                <p className="text-2xl text-pink-600 dark:text-pink-400 font-bold">{result.name1}</p>
              </div>
              <div className="p-6 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Second Person</h3>
                <p className="text-2xl text-purple-600 dark:text-purple-400 font-bold">{result.name2}</p>
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <div className="space-y-8 mb-8">
            {/* What is Love Compatibility? */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                What is Love Compatibility?
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Love compatibility is a measure of how well two people match in terms of personality, values, emotions, and life goals. It provides insights into the potential harmony and understanding between partners in a romantic relationship. While no calculator can predict the future of a relationship, understanding compatibility factors can help partners appreciate their strengths and work on areas that need attention.
                </p>
                <p>
                  Our Love Calculator uses ancient numerology principles combined with modern compatibility analysis to calculate a percentage that represents the potential harmony between two individuals based on their names. The concept is rooted in the belief that names carry vibrational energy that influences personality traits and interpersonal dynamics.
                </p>
                <p>
                  Love compatibility encompasses various aspects including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Emotional connection and understanding</li>
                  <li>Communication styles and effectiveness</li>
                  <li>Shared values and life goals</li>
                  <li>Personality traits and temperament</li>
                  <li>Mutual respect and support</li>
                  <li>Physical and spiritual attraction</li>
                </ul>
                <p>
                  Remember, while compatibility scores provide interesting insights, the success of any relationship ultimately depends on mutual effort, understanding, communication, and commitment from both partners.
                </p>
              </div>
            </div>

            {/* How is it Calculated? */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                How is Love Compatibility Calculated?
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Our Love Calculator uses a sophisticated algorithm based on name numerology, which is an ancient practice that assigns numerical values to letters and derives meaning from these numbers. Here's how the calculation works:
                </p>

                <div className="bg-pink-50 dark:bg-pink-950/20 rounded-lg p-6 border border-pink-200 dark:border-pink-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">The Algorithm:</h3>
                  <ol className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-pink-600 dark:bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <div>
                        <strong className="text-gray-900 dark:text-white">Name Numerology Values:</strong> Each letter in both names is assigned a numerical value based on the Pythagorean numerology system. For example: A=1, B=2, C=3... and so on, cycling through 1-9.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-pink-600 dark:bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <div>
                        <strong className="text-gray-900 dark:text-white">Letter Matching (FLAMES-inspired):</strong> The algorithm identifies common letters between both names, similar to the traditional FLAMES method. Common letters indicate shared characteristics and values.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-pink-600 dark:bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <div>
                        <strong className="text-gray-900 dark:text-white">Numerology Sum:</strong> The numerical values of all letters in both names are added together and reduced to create a base compatibility score. This reflects the overall energetic harmony between the names.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-pink-600 dark:bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                      <div>
                        <strong className="text-gray-900 dark:text-white">Name Length Compatibility:</strong> The algorithm considers the difference in name lengths. Similar name lengths often indicate balanced personalities and communication styles.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-pink-600 dark:bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                      <div>
                        <strong className="text-gray-900 dark:text-white">Vibrational Energy:</strong> Each name carries a unique vibrational signature. The algorithm calculates how well these vibrations harmonize by analyzing the product of name values and letter patterns.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-pink-600 dark:bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
                      <div>
                        <strong className="text-gray-900 dark:text-white">Final Percentage:</strong> All factors are combined using weighted calculations to produce a compatibility percentage ranging from 45% to 99%, ensuring meaningful and varied results.
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/10 dark:to-purple-950/10 rounded-lg p-5 border border-pink-200 dark:border-pink-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    Example Calculation
                  </h3>
                  <p className="text-sm mb-3">
                    For <strong className="text-pink-600 dark:text-pink-400">{result.name1}</strong> and <strong className="text-purple-600 dark:text-purple-400">{result.name2}</strong>:
                  </p>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Names are converted to numerical values based on letter positions</li>
                    <li>• Common letters are identified and counted for bonus points</li>
                    <li>• Name length compatibility is factored in</li>
                    <li>• Vibrational harmony is calculated using multiple factors</li>
                    <li>• <strong className="text-gray-900 dark:text-white">Result: {result.percentage}% compatibility</strong></li>
                  </ul>
                </div>

                <p className="text-sm bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <strong className="text-gray-900 dark:text-white">Note:</strong> While this calculator uses established numerology principles, it's designed primarily for entertainment and self-reflection. Real relationship compatibility involves many complex factors including shared experiences, emotional maturity, communication skills, and conscious effort from both partners.
                </p>
              </div>
            </div>

            {/* How is it Used? */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                How is Love Compatibility Used?
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Love compatibility calculations can be valuable tools for understanding relationships and personal dynamics. Here's how people commonly use compatibility insights:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  <div className="p-5 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/10 dark:to-purple-950/10 rounded-lg border border-pink-200 dark:border-pink-900">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                      Relationship Insights
                    </h3>
                    <p className="text-sm">
                      Understanding compatibility percentages helps couples identify their natural harmony and areas where they complement each other. It provides a fun starting point for deeper conversations about the relationship.
                    </p>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/10 dark:to-purple-950/10 rounded-lg border border-pink-200 dark:border-pink-900">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                      Self-Discovery
                    </h3>
                    <p className="text-sm">
                      Name numerology reveals personality traits and characteristics associated with your name. This self-awareness can help you understand your approach to relationships and love.
                    </p>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/10 dark:to-purple-950/10 rounded-lg border border-pink-200 dark:border-pink-900">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                      Communication Starter
                    </h3>
                    <p className="text-sm">
                      Compatibility scores often spark meaningful discussions between partners about their relationship, expectations, and how they can strengthen their bond together.
                    </p>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/10 dark:to-purple-950/10 rounded-lg border border-pink-200 dark:border-pink-900">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                      Understanding Challenges
                    </h3>
                    <p className="text-sm">
                      Even low compatibility scores can be informative, highlighting potential challenges or differences that couples should be aware of and work through together.
                    </p>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/10 dark:to-purple-950/10 rounded-lg border border-pink-200 dark:border-pink-900">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                      Dating & New Relationships
                    </h3>
                    <p className="text-sm">
                      Many people use compatibility calculators in the early stages of dating as a fun way to explore potential connections and learn about their partner's characteristics.
                    </p>
                  </div>

                  <div className="p-5 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/10 dark:to-purple-950/10 rounded-lg border border-pink-200 dark:border-pink-900">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                      Entertainment Value
                    </h3>
                    <p className="text-sm">
                      Beyond serious analysis, love calculators offer an enjoyable and lighthearted way to engage with numerology and explore the mystical aspects of relationships.
                    </p>
                  </div>
                </div>

                <div className="bg-pink-50 dark:bg-pink-950/20 rounded-lg p-5 border border-pink-200 dark:border-pink-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Practical Applications:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 dark:text-pink-400 font-bold mt-0.5">•</span>
                      <span><strong>Relationship Counseling:</strong> Some counselors use compatibility insights as conversation starters to help couples explore their dynamics.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 dark:text-pink-400 font-bold mt-0.5">•</span>
                      <span><strong>Personal Growth:</strong> Understanding your numerological profile can guide personal development and relationship skills.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 dark:text-pink-400 font-bold mt-0.5">•</span>
                      <span><strong>Social Connection:</strong> Sharing compatibility results with friends is a popular social activity that brings people together.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 dark:text-pink-400 font-bold mt-0.5">•</span>
                      <span><strong>Wedding Planning:</strong> Some couples check compatibility as part of their pre-wedding traditions, especially in cultures that value numerology.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Why Does it Matter? */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                Why Does Love Compatibility Matter?
              </h2>
              <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-400">
                  While love compatibility scores shouldn't be the sole determinant of relationship decisions, understanding compatibility can provide valuable insights that contribute to healthier, more fulfilling relationships. Here's why it matters:
                </p>

                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Enhanced Self-Awareness</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Understanding your own numerological profile and compatibility patterns helps you recognize your strengths, weaknesses, and relationship tendencies. This self-awareness is crucial for personal growth and building healthy relationships. When you understand your innate characteristics, you can work on areas that need improvement and leverage your strengths.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Better Communication</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Compatibility insights can open doors to important conversations between partners. Discussing compatibility scores, personality traits, and relationship dynamics helps couples communicate more openly about their expectations, needs, and concerns. Good communication is the foundation of every successful relationship.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Relationship Optimization</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Even couples with high compatibility scores can benefit from understanding their dynamics. Knowing your compatibility factors helps you capitalize on your strengths as a couple while being mindful of potential challenges. It provides a roadmap for nurturing your relationship and growing together over time.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Cultural & Spiritual Connection</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Name numerology has been practiced for thousands of years across various cultures. Engaging with these ancient wisdom traditions connects you to a rich cultural heritage and can add a spiritual dimension to your understanding of relationships. It acknowledges that love involves more than just practical considerations.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Realistic Expectations</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Understanding compatibility helps set realistic expectations in relationships. No couple is 100% compatible in every way, and that's perfectly normal. Knowing this helps couples appreciate their differences and work through challenges without unrealistic pressure for perfection.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Conflict Resolution</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        When conflicts arise, understanding your compatibility profile can provide perspective. You can recognize that disagreements might stem from fundamental personality differences rather than lack of love or commitment. This understanding promotes empathy and more effective conflict resolution strategies.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Appreciation of Differences</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Compatibility analysis highlights both similarities and differences between partners. This helps couples appreciate how their differences can complement each other and add richness to the relationship, rather than viewing them as obstacles. Successful relationships often thrive on the balance of similarities and differences.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg p-6 border border-pink-200 dark:border-pink-800 mt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                    The Bottom Line
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Love compatibility matters because it provides a framework for understanding relationships, but it should never replace genuine connection, effort, and commitment. The most successful relationships are built on mutual respect, communication, shared values, and the conscious choice to love and support each other daily. Use compatibility insights as a tool for growth and understanding, not as a definitive judgment of your relationship's potential.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-3">
                    <strong className="text-gray-900 dark:text-white">Your {result.percentage}% compatibility score with {result.name1 === result.name1 ? result.name2 : result.name1}</strong> is just one data point. What truly matters is how you both choose to nurture, understand, and grow with each other every single day.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-pink-600 to-purple-600 dark:from-pink-900 dark:to-purple-900 rounded-xl shadow-lg p-6 sm:p-8 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Discover More About Your Relationships</h2>
            <p className="mb-6 text-pink-100">
              Get your complete Kundli for deeper insights into love, marriage compatibility, and life path predictions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/free-kundli">
                <Button className="bg-white text-pink-600 hover:bg-gray-100">
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
