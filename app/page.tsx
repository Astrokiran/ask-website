import { NavBar } from "@/components/nav-bar"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { ServicesSection } from "@/components/services-section"
import { HowItWorks } from "@/components/how-it-works"
import { FeaturedAstrologers } from "@/components/featured-astrologers"
import { Testimonials } from "@/components/testimonials"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"
import { ReportGeneration } from "@/components/report-generation"

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <NavBar />
      <main>
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        {/* <ReportGeneration /> */}
        <HowItWorks />
        <FeaturedAstrologers />
        <Testimonials />
        {/* <Newsletter /> */}
      </main>
      <Footer />
    </div>
  )
}
