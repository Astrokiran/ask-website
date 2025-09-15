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
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-orange-50/30 dark:from-purple-950/20 dark:via-transparent dark:to-orange-950/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_50%,rgba(147,51,234,0.1)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_60%_50%,rgba(147,51,234,0.05)_0%,transparent_50%)]"></div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fadeInUp">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-orange-500 to-purple-600 bg-clip-text text-transparent mb-6">
            Our Premium Services
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover your destiny through our comprehensive astrological services crafted by expert astrologers
          </p>
          <div className="flex justify-center mt-8">
            <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full"></div>
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
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-orange-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Main Card */}
                <div className="relative bg-card/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-3xl border border-border/50 group-hover:border-orange-300/50 dark:group-hover:border-orange-700/50 shadow-lg group-hover:shadow-2xl transition-all duration-300 h-full flex flex-col">

                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Floating particles */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 group-hover:text-orange-500 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4 sm:mb-6 text-base sm:text-lg">
                      {service.description}
                    </p>
                  </div>

                  {/* CTA Link */}
                  <Link href={service.href} className="mt-auto">
                    <div className="group/link inline-flex items-center gap-3 text-orange-500 hover:text-orange-600 font-semibold text-base sm:text-lg transition-all duration-300 hover:translate-x-1">
                      Explore Service
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center group-hover/link:bg-orange-200 dark:group-hover/link:bg-orange-900/40 transition-colors duration-300">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>

                  {/* Popular Badge for first service */}
                  {index === 0 && (
                    <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      ⭐ Most Popular
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