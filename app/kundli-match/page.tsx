import { Metadata } from 'next'
import KundliMatchingPage from '@/components/kundli-matching/TwoForm'

export const metadata: Metadata = {
  title: "Kundli Matching for Marriage - Love Compatibility Calculator | AstroKiran",
  description: "Free kundli matching for marriage compatibility. Check gun milan, love compatibility score, and marriage predictions. Accurate Vedic matchmaking by name and birth details.",
  keywords: ["kundli matching", "marriage compatibility", "love calculator", "gun milan", "kundli milan by name", "matchmaking"],
  alternates: {
    canonical: "https://astrokiran.com/kundli-match",
  },
}

export default function KundliMatchPage() {
  return (
    <main className="p-8 bg-background min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">
          Kundli Matching for Marriage - Check Compatibility
        </h1>
        <p className="text-lg text-center mb-8 text-gray-600">
          Get accurate kundli matching results for marriage compatibility. Check gun milan score and detailed compatibility analysis.
        </p>
      </div>
      <KundliMatchingPage />
    </main>
  )
}