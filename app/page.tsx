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
// import { DailyHoroscopeCta } from "@/components/banners/Daily-horoscope";

// Correctly import the new section component

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