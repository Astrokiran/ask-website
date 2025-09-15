import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Free ₹1000 Kundli Report - Detailed Birth Chart Analysis | AstroKiran",
  description: "Get your FREE detailed kundli report worth ₹1000 instantly. Complete Vedic birth chart analysis with planetary positions, doshas, and astrological predictions by expert astrologers.",
  keywords: ["free kundli", "free kundli report", "detailed kundli", "birth chart analysis", "vedic astrology", "kundli worth 1000", "online kundli"],
  alternates: {
    canonical: "https://astrokiran.com/free-kundli",
  },
}

export default function FreeKundliLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}