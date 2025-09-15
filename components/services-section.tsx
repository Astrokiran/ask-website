import { Sparkles, Moon, Calculator, WalletCardsIcon as Cards, Gem, Home, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const services = [
  {
    title: "Horoscope Reading",
    description: "Daily, weekly & monthly predictions",
    icon: Moon,
    href: "/horoscopes",
  },
  {
    title: "Kundli Analysis",
    description: "Detailed birth chart analysis",
    icon: Sparkles,
    href: "/free-kundli",
  },
  {
    title: "Kundli Matching",
    description: "Compatibility analysis for couples",
    icon: Calculator,
    href: "/kundli-match"
  },
]

export function ServicesSection() {
  return (
    <div className="relative py-8 lg:py-12 overflow-hidden" id="services">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/80 dark:from-gray-900/50 dark:to-gray-800/80"></div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fadeInUp">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Our Premium Services
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover your destiny through our comprehensive astrological services crafted by expert astrologers
          </p>
          <div className="flex justify-center mt-8">
            <div className="h-0.5 w-24 bg-gray-300 dark:bg-gray-600"></div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative animate-fadeInUp hover:-translate-y-2 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-full">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gray-100/50 dark:bg-gray-800/50 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Main Card */}
                <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-3xl border border-gray-200/50 dark:border-gray-700/50 group-hover:border-gray-300/70 dark:group-hover:border-gray-600/70 shadow-lg group-hover:shadow-xl transition-all duration-300 h-full flex flex-col">

                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-lg">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Floating particles */}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4 sm:mb-6 text-base sm:text-lg">
                      {service.description}
                    </p>
                  </div>

                  {/* CTA Link */}
                  <Link href={service.href} className="mt-auto">
                    <div className="group/link inline-flex items-center gap-3 text-blue-500 hover:text-blue-600 font-medium text-base sm:text-lg transition-all duration-200 hover:translate-x-1">
                      Explore Service
                      <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center group-hover/link:bg-blue-100 dark:group-hover/link:bg-blue-900/40 transition-colors duration-200">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>

                  {/* Popular Badge for first service */}
                  {index === 0 && (
                    <div className="absolute -top-4 -right-4 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}