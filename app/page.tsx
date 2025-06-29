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
// Correctly import the new section component

export default function Home() {
  return (
    <div>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <div className="min-h-screen overflow-x-hidden">
        <NavBar />
        <main>

          <HeroSection />
          <ServicesSection />
          <FeaturedAstrologers />
          <HowItWorks />
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