import { Metadata } from 'next'
import { NavBar } from "@/components/nav-bar"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { ServicesSection } from "@/components/services-section"
import { FeaturedAstrologers } from "@/components/featured-astrologers"
import { Testimonials } from "@/components/testimonials"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"
import { ReportGeneration } from "@/components/report-generation"

export const metadata: Metadata = {
  title: "Free ₹1000 Kundli, Tarot & Astrology Services - Astrokiran",
  description: "Get FREE detailed kundli worth ₹1000, tarot card readings, prashna kundali, palmistry, hastrekha reading, numerology, and kundali milan. Expert astrology consultations via WhatsApp across India.",
  keywords: ["free kundli", "tarot card reading", "prashna kundali", "palmistry", "hastrekha reading", "numerology", "kundali milan", "astrology consultation", "whatsapp astrologer", "detailed horoscope"],
  alternates: {
    canonical: "https://astrokiran.com",
  },
}

export default function Home() {
  return (
    <div>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="google-site-verification" content="bsao8SV-Yrt9Dh06rZN6WKx86dnPMM_N4srDx2d01BE" />
      <div className="min-h-screen overflow-x-hidden">
        <NavBar />
        {/* <DailyHoroscopeCta phoneNumber={"918197503574"}/> */}
        <main>

          <HeroSection />
          <ServicesSection />
          <FeaturedAstrologers />
          <ReportGeneration />
          {/* <StatsSection /> */}
          {/* <Testimonials /> */}
          {/* <Newsletter /> */}
        </main>
        <Footer />
      </div>
    </div>
  )
}