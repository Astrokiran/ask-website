import { Metadata } from 'next'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Heart, Calculator, Star, Sparkles, TrendingUp, Calendar, Sun, Moon, Hash, Flame, Clock, AlertCircle, Car, Sunrise, Smartphone, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Free Astrology Calculators - Love, Numerology, Rashi & Nakshatra | Astrokiran",
  description: "Free online astrology calculators. Calculate love compatibility, life path number, sun sign, rashi, nakshatra, and more. Instant results with detailed insights.",
  keywords: ["love calculator", "numerology calculator", "sun sign calculator", "rashi calculator", "nakshatra calculator", "life path number", "destiny number", "compatibility calculator"],
  alternates: {
    canonical: "https://astrokiran.com/calculators",
  },
}

// Main astrology calculators - featured at top
const mainCalculators = [
  {
    title: "Sun Sign",
    description: "Find your sun sign (zodiac sign) and personality traits",
    icon: Sun,
    href: "/calculators/sun-sign-calculator",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  {
    title: "Rising Sign",
    description: "Discover your ascendant and how the world sees you",
    icon: Sunrise,
    href: "/calculators/rising-sign-calculator",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  {
    title: "Rashi Calculator",
    description: "Calculate your Vedic moon sign (Rashi) accurately",
    icon: Moon,
    href: "/calculators/rashi-calculator",
    color: "text-teal-500",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    borderColor: "border-teal-200 dark:border-teal-800",
  },
  {
    title: "Nakshatra",
    description: "Discover your birth nakshatra (lunar mansion)",
    icon: Star,
    href: "/calculators/nakshatra-calculator",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    title: "Numerology Calculator",
    description: "Get complete numerology analysis with all core numbers",
    icon: Hash,
    href: "/calculators/numerology-calculator",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    borderColor: "border-indigo-200 dark:border-indigo-800",
  },
]

// Other calculators
const otherCalculators = [
  {
    title: "Dasha Calculator",
    description: "Calculate your Vimshottari Dasha periods and timeline",
    icon: Clock,
    href: "/calculators/dasha-calculator",
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  {
    title: "Sade Sati Calculator",
    description: "Check if you're in Saturn's 7.5-year period",
    icon: AlertCircle,
    href: "/calculators/sade-sati-calculator",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    title: "Mangal Dosha Calculator",
    description: "Check for Mars affliction in your birth chart",
    icon: Shield,
    href: "/calculators/mangal-dosha-calculator",
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    title: "Kaal Sarp Dosha Calculator",
    description: "Identify serpent dosha and its type in your chart",
    icon: Zap,
    href: "/calculators/kaal-sarp-dosha-calculator",
    color: "text-violet-500",
    bgColor: "bg-violet-50 dark:bg-violet-950/20",
    borderColor: "border-violet-200 dark:border-violet-800",
  },
  {
    title: "Vehicle Number Numerology",
    description: "Check if your vehicle number is lucky for you",
    icon: Car,
    href: "/calculators/vehicle-number-calculator",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  {
    title: "Mobile Number Numerology",
    description: "Discover the hidden energy in your phone number",
    icon: Smartphone,
    href: "/calculators/mobile-number-calculator",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    title: "Love Calculator",
    description: "Calculate love compatibility percentage between two names",
    icon: Heart,
    href: "/calculators/love-calculator",
    color: "text-pink-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    borderColor: "border-pink-200 dark:border-pink-800",
  },
  {
    title: "FLAMES Calculator",
    description: "Find relationship status using the classic FLAMES game",
    icon: Flame,
    href: "/calculators/flames-calculator",
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    title: "Name Compatibility",
    description: "Check detailed compatibility between two names",
    icon: Sparkles,
    href: "/calculators/name-compatibility",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    title: "Life Path Number",
    description: "Discover your life path number from your birth date",
    icon: TrendingUp,
    href: "/calculators/life-path",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    title: "Destiny Number",
    description: "Calculate your destiny number from your full name",
    icon: Star,
    href: "/calculators/destiny-number",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  {
    title: "Lucky Number",
    description: "Find your personal lucky numbers for success",
    icon: Sparkles,
    href: "/calculators/lucky-number-calculator",
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    title: "Name Numerology",
    description: "Get complete numerology analysis of your name",
    icon: Calculator,
    href: "/calculators/name-numerology",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    borderColor: "border-indigo-200 dark:border-indigo-800",
  },
]

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4 sm:pt-6 md:pt-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-lg font-medium text-sm mb-6">
              Free Calculators
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
              Astrology Calculators
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-2">
              Discover insights about yourself with our free astrology calculators.
              From love compatibility to numerology, get instant results.
            </p>
          </div>

          {/* Main Calculators Section */}
          <div className="max-w-6xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Featured Calculators
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
              {mainCalculators.map((calculator) => (
                <Link
                  key={calculator.title}
                  href={calculator.href}
                  className="group"
                >
                  <div className={`h-full p-6 rounded-xl border-2 ${calculator.borderColor} ${calculator.bgColor} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                    <div className="flex flex-col items-center text-center">
                      <div className={`${calculator.color} mb-4`}>
                        <calculator.icon className="w-12 h-12" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {calculator.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {calculator.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Other Calculators Section */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              More Calculators
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {otherCalculators.map((calculator) => (
                <Link
                  key={calculator.title}
                  href={calculator.href}
                  className="group"
                >
                  <div className={`h-full p-6 rounded-xl border-2 ${calculator.borderColor} ${calculator.bgColor} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                    <div className="flex flex-col items-center text-center">
                      <div className={`${calculator.color} mb-4`}>
                        <calculator.icon className="w-12 h-12" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {calculator.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {calculator.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Why Use Our Calculators?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">100% Free</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">All calculators are completely free with no hidden charges</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Instant Results</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get your results immediately with detailed insights</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Accurate Calculations</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Based on authentic Vedic astrology and numerology principles</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">No Registration</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use all calculators without signing up or login</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
