"use client"

import { Sparkles, Moon, Calculator, WalletCardsIcon as Cards, Gem, Home, ArrowRight, BookOpen, Gamepad2, Zap, Stars, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const services = [
  {
    title: "Quick Connect",
    summary: "Connect instantly with expert astrologers via phone, chat, or video for immediate guidance",
    icon: Zap,
    href: "/quick-connect",
    isExternal: true,
    useWhiteBg: true,
  },
  {
    title: "Horoscope Reading",
    summary: "Get your free daily horoscope based on your zodiac sign with personalized insights",
    icon: Moon,
    href: "/horoscopes",
    customIcon: "/sunset.png"
  },
  {
    title: "Kundli Analysis",
    summary: "Enter your birth details and get a complete free Kundli with planetary positions & predictions",
    icon: Sparkles,
    href: "/free-kundli",
    customIcon: "/astrology.png"
  },
  {
    title: "Kundli Matching",
    summary: "Check marriage compatibility by entering both partners' birth details for free matching",
    icon: Calculator,
    href: "/kundli-match",
    customIcon: "/marriage.png"
  },
  {
    title: "Tarot Services",
    summary: "Get personalized tarot card readings from experienced tarot readers for life guidance",
    icon: Cards,
    href: "/tarot",
    customIcon: "/taro.png"
  },
  {
    title: "Astrology Services",
    summary: "Comprehensive astrology consultations covering career, health, relationships and more",
    icon: Stars,
    href: "/astrology-services",
    customIcon: "/solar-system.png"
  },
  {
    title: "Blogs",
    summary: "Read expert articles on astrology, festivals, remedies and spiritual guidance for free",
    icon: BookOpen,
    href: "/blog",
    customIcon: "/blog.png"
  },
  {
    title: "Games",
    summary: "Play interactive astrology games and take personality quizzes to learn about yourself",
    icon: Gamepad2,
    href: "/games",
    customIcon: "/games.png"
  },
]

export function ServicesSection() {
  const handleServiceClick = (e: React.MouseEvent, service: typeof services[0]) => {
    if (service.isExternal) {
      e.preventDefault();
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

      // iOS detection
      if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
        window.location.href = "https://apps.apple.com/in/app/ask-astrokiran-astrology/id6748694746";
      }
      // Android detection
      else if (/android/i.test(userAgent)) {
        window.location.href = "https://play.google.com/store/apps/details?id=com.astrokiran.user&pcampaignid=web_share";
      }
      // Default fallback (desktop or other)
      else {
        window.location.href = "https://play.google.com/store/apps/details?id=com.astrokiran.user&pcampaignid=web_share";
      }
    }
  };

  return (
    <div className="relative py-8 lg:py-12 overflow-hidden" id="services">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/80 dark:from-gray-900/50 dark:to-gray-800/80"></div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fadeInUp">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Complementary Astrological Services
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover your destiny through our comprehensive astrological services crafted by expert astrologers
          </p>
          <div className="flex justify-center mt-8">
            <div className="h-0.5 w-24 bg-gray-300 dark:bg-gray-600"></div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Link
              key={service.title}
              href={service.href}
              onClick={(e) => handleServiceClick(e, service)}
              className="group relative animate-fadeInUp hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-full">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gray-100/50 dark:bg-gray-800/50 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Main Card */}
                <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 group-hover:border-gray-300/70 dark:group-hover:border-gray-600/70 shadow-lg group-hover:shadow-xl transition-all duration-300 h-full flex flex-col">

                  {/* Icon Container */}
                  <div className="relative mb-4">
                    {(service as any).customIcon ? (
                      <div className="w-16 h-16 bg-white dark:bg-white rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-lg mx-auto p-2">
                        <img
                          src={(service as any).customIcon}
                          alt={service.title}
                          className="w-full h-full object-contain"
                          style={{
                            filter: 'brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(6539%) hue-rotate(351deg) brightness(88%) contrast(95%)'
                          }}
                        />
                      </div>
                    ) : (service as any).useWhiteBg ? (
                      <div className="w-16 h-16 bg-white dark:bg-white rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-lg mx-auto">
                        <service.icon className="w-8 h-8" style={{ color: '#D32F2F' }} />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-lg mx-auto">
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                      {service.summary}
                    </p>
                  </div>

                  {/* Hover Arrow Indicator */}
                  <div className="flex justify-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-6 h-6 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-orange-500" />
                    </div>
                  </div>

                  {/* Popular Badge for first service */}
                  {index === 0 && (
                    <div className="absolute -top-4 -right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}