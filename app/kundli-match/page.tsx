import { Metadata } from 'next'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import KundliMatchingPage from '@/components/kundli-matching/TwoForm'

export const metadata: Metadata = {
  title: "Kundli Matching - Marriage Compatibility | Astrokiran",
  description: "Free kundli matching for marriage compatibility. Check gun milan, love compatibility score, and marriage predictions. Accurate Vedic matchmaking by name and birth details.",
  keywords: ["kundli matching", "marriage compatibility", "love calculator", "gun milan", "kundli milan by name", "matchmaking"],
  alternates: {
    canonical: "https://astrokiran.com/kundli-match",
  },
}

export default function KundliMatchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <main className="flex-1 bg-background pt-4 sm:pt-6 md:pt-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-orange-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
              Kundli Matching for Marriage - Check Compatibility
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-2">
              Get accurate kundli matching results for marriage compatibility. Check gun milan score and detailed compatibility analysis.
            </p>
          </div>
        </div>
        <KundliMatchingPage />
      </main>
      <Footer />
    </div>
  )
}