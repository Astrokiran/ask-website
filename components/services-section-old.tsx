import { Sparkles, Moon, Calculator, WalletCardsIcon as Cards, Gem, Home, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
// import { motion } from "framer-motion"
// import { WhatsAppCtaBanner } from "@components./banners/Whatsapp-banner";




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
  // {
  //   title: "Tarot Reading",
  //   description: "Cards reveal your path",
  //   icon: Cards,
  //   href: "#"
  // },
  // {
  //   title: "Gemstone Consultation",
  //   description: "Find your lucky stone",
  //   icon: Gem,
  //   href: "#"
  // },
  // {
  //   title: "Vastu Shastra",
  //   description: "Harmonize your space",
  //   icon: Home,
  //   href: "#"
  // },
]

export function ServicesSection() {
  return (
    <div className="relative py-20 lg:py-32 overflow-hidden" id="services">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-orange-50/30 dark:from-purple-950/20 dark:via-transparent dark:to-orange-950/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_50%,rgba(147,51,234,0.1)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_60%_50%,rgba(147,51,234,0.05)_0%,transparent_50%)]"></div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-orange-500 to-purple-600 bg-clip-text text-transparent mb-6">
            Our Premium Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover your destiny through our comprehensive astrological services crafted by expert astrologers
          </p>
          <div className="flex justify-center mt-8">
            <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full"></div>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className="relative h-full">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-orange-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Main Card */}
                <div className="relative bg-card/80 backdrop-blur-sm p-8 rounded-3xl border border-border/50 group-hover:border-orange-300/50 dark:group-hover:border-orange-700/50 shadow-lg group-hover:shadow-2xl transition-all duration-300 h-full flex flex-col">

                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Floating particles */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300 animation-delay-500"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-orange-500 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                      {service.description}
                    </p>
                  </div>

                  {/* CTA Link */}
                  <Link href={service.href} className="mt-auto">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="group/link inline-flex items-center gap-3 text-orange-500 hover:text-orange-600 font-semibold text-lg transition-colors duration-300"
                    >
                      Explore Service
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center group-hover/link:bg-orange-200 dark:group-hover/link:bg-orange-900/40 transition-colors duration-300">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  </Link>

                  {/* Popular Badge for first service */}
                  {index === 0 && (
                    <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      ⭐ Most Popular
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-20"
        >
          <div className="bg-card/60 backdrop-blur-sm rounded-3xl p-12 border border-border/50 shadow-2xl">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Ready to Explore Your Cosmic Journey?
            </h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Connect with our expert astrologers for personalized guidance and unlock the mysteries of your destiny
            </p>
            <motion.a
              href="https://wa.me/918197503574?text=Hi,%20I%20would%20like%20to%20know%20more%20about%20your%20astrological%20services"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-purple-500/25 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
              </svg>
              Start Your Reading Today
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
