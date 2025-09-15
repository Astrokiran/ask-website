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
                {/* Enhanced Hero Section */}
                <div className="relative bg-gradient-to-br from-orange-50/80 via-purple-50/60 to-orange-50/40 dark:from-orange-950/30 dark:via-purple-950/20 dark:to-orange-950/15 py-16 overflow-hidden">
                    {/* Background effects */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,146,60,0.15)_0%,transparent_40%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(147,51,234,0.12)_0%,transparent_45%)]"></div>

                    {/* Floating elements */}
                    <div className="absolute top-8 left-8 w-2 h-2 bg-orange-400 rounded-full animate-pulse opacity-60"></div>
                    <div className="absolute top-12 right-12 w-3 h-3 bg-purple-500 rounded-full animate-bounce opacity-70"></div>
                    <div className="absolute bottom-8 left-1/4 text-orange-400 opacity-60 animate-pulse">✨</div>
                    <div className="absolute bottom-12 right-1/4 text-purple-500 opacity-60 animate-bounce">💰</div>

                    <div className="container mx-auto px-4 relative z-10">
                        {/* Enhanced badge */}
                        <div className="flex justify-center mb-6">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-sm border border-orange-300/30 rounded-full px-4 py-2 animate-pulse">
                                <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
                                <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">💎 Transparent & Affordable Pricing</span>
                            </div>
                        </div>

                        {/* Enhanced title */}
                        <h1 className="text-3xl md:text-5xl font-black text-center mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-orange-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
                                Complete Astrology Services
                            </span>
                            <br />
                            <span className="text-2xl md:text-4xl font-bold text-foreground">
                                Pricing & Rates
                            </span>
                        </h1>

                        {/* Enhanced description */}
                        <div className="max-w-4xl mx-auto text-center mb-8">
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                                Discover our transparent and affordable pricing for all astrology services.
                                Get started with your <span className="font-bold text-orange-600">FREE ₹1000 kundli</span> and explore our comprehensive range of spiritual guidance.
                            </p>

                            {/* Service highlights */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-orange-200/30">
                                    <div className="text-orange-500 text-lg mb-1">🎁</div>
                                    <div className="font-semibold">FREE Kundli</div>
                                    <div className="text-xs text-muted-foreground">Worth ₹1000</div>
                                </div>
                                <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-purple-200/30">
                                    <div className="text-purple-500 text-lg mb-1">🔮</div>
                                    <div className="font-semibold">Tarot Reading</div>
                                    <div className="text-xs text-muted-foreground">Expert guidance</div>
                                </div>
                                <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-orange-200/30">
                                    <div className="text-orange-500 text-lg mb-1">🤝</div>
                                    <div className="font-semibold">Kundali Milan</div>
                                    <div className="text-xs text-muted-foreground">Compatibility</div>
                                </div>
                                <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-green-200/30">
                                    <div className="text-green-500 text-lg mb-1">📱</div>
                                    <div className="font-semibold">WhatsApp</div>
                                    <div className="text-xs text-muted-foreground">Instant chat</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Pricing />
            </main>
            <Footer />
        </div>
    )
}