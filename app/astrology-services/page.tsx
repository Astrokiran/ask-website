"use client"

import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Star, Moon, Sun, Sparkles } from "lucide-react"

const APP_DOWNLOAD_LINK = "https://play.google.com/store/apps/details?id=com.astrokiran.user&pcampaignid=web_share"

export default function AstrologyServicesPage() {
  const services = [
    {
      icon: <Star className="w-8 h-8" />,
      title: "Birth Chart Analysis",
      description: "Complete Vedic birth chart reading with planetary positions and predictions",
      color: "orange"
    },
    {
      icon: <Moon className="w-8 h-8" />,
      title: "Yearly Predictions",
      description: "Comprehensive yearly horoscope and life forecasts",
      color: "purple"
    },
    {
      icon: <Sun className="w-8 h-8" />,
      title: "Career Guidance",
      description: "Professional astrology advice for career and business decisions",
      color: "yellow"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Marriage Matching",
      description: "Detailed kundli matching and compatibility analysis",
      color: "pink"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Remedies & Solutions",
      description: "Personalized gemstone and ritual recommendations",
      color: "green"
    },
    {
      icon: <Moon className="w-8 h-8" />,
      title: "Muhurat Selection",
      description: "Auspicious timing for important life events",
      color: "blue"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Dedicated Astrology Services
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Expert Vedic astrology consultations for all aspects of life
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <div className={`w-14 h-14 bg-${service.color}-100 dark:bg-${service.color}-900/20 rounded-full flex items-center justify-center mb-4 text-${service.color}-600 dark:text-${service.color}-400`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-8 rounded-2xl border border-orange-200 dark:border-orange-800">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Book Your Astrology Consultation
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Connect with certified Vedic astrologers
              </p>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl mb-6">
                <p className="text-3xl font-bold text-[#D32F2F] mb-2">
                  Limited Time Offer!
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                 Get Your Offer Now
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  (Worth ₹250)
                </p>
              </div>
              <a
                href={APP_DOWNLOAD_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                </svg>
                Download App & Get Started
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
