import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export function HeroSection() {
  return (
    <div className="min-h-[600px] bg-[#1a1b2e] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side content */}
          <div className="relative z-20">
            <h1 className="text-5xl font-bold text-white mb-4">Discover Your Cosmic Path</h1>
            <p className="text-lg text-gray-300 mb-8">
              Connect with expert astrologers for personalized guidance and unlock the mysteries of your destiny
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-8">
              <Button className="bg-orange-500 hover:bg-orange-600">Connect on WhatsApp</Button>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <span className="text-sm text-gray-300">20,000+ consultations</span>
              </div>
            </div>
          </div>

          {/* Right side image */}
          <div className="relative h-[400px] md:h-[600px]">
            <img
              src="/guide.png?height=600&width=800"
              alt="Cosmic background"
              className="h-full w-full object-cover object-center rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#1a1b2e]/20 to-[#1a1b2e]/40 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}

