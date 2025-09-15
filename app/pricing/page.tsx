import { Metadata } from 'next'
import { NavBar } from "@/components/nav-bar"
import Pricing from "@/components/pricing"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Astrology Services Pricing - Tarot, Palmistry, Numerology & Consultation Rates",
  description: "Transparent pricing for complete astrology services including FREE ₹1000 kundli, tarot reading, prashna kundali, palmistry, hastrekha, numerology, and WhatsApp consultations across India.",
  keywords: ["astrology pricing", "tarot reading cost", "palmistry rates", "numerology fees", "prashna kundali price", "whatsapp consultation rates", "affordable astrology India"],
  alternates: {
    canonical: "https://astrokiran.com/pricing",
  },
}

export default function PricingPage() {
    return (
        <div className="min-h-screen">
            <NavBar />
            <main>
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold text-center mb-8">
                        Complete Astrology Services Pricing - Transparent Rates
                    </h1>
                    <p className="text-lg text-center mb-8 text-gray-600">
                        Affordable pricing for all services: FREE ₹1000 kundli, tarot reading, prashna kundali, palmistry, hastrekha, numerology, kundali milan & WhatsApp consultations.
                    </p>
                </div>
                <Pricing />
            </main>
            <Footer />
        </div>
    )
}