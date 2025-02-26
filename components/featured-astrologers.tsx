"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const astrologers = [{
  name: "Pandit Sharma",
  title: "Vedic Astrologer",
  stats: {
    matches: "10",
    consultations: "163",
    languages: "3",
    rating: "155.23",
  },
  description: "Expert in Vedic astrology with deep knowledge of planetary movements and their effects. Specializes in career guidance, relationship counseling, and life path analysis.",
  image: "/astrologer-profile.png",
}, {
  name: "Aditya Pandey",
  title: "Vedic Astrologer",
  stats: {
    matches: "10",
    consultations: "163",
    languages: "3",
    rating: "155.23",
  },
  description: "Expert in Vedic astrology with deep knowledge of planetary movements and their effects. Specializes in career guidance, relationship counseling, and life path analysis.",
  image: "/astrologer-profile.png",
}, {
  name: "Mohit Kumar",
  title: "Vedic Astrologer",
  stats: {
    matches: "10",
    consultations: "163",
    languages: "3",
    rating: "155.23",
  },
  description: "Expert in Vedic astrology with deep knowledge of planetary movements and their effects. Specializes in career guidance, relationship counseling, and life path analysis.",
  image: "/astrologer-profile.png",
}, {
  name: "OP Singh",
  title: "Vedic Astrologer",
  stats: {
    matches: "10",
    consultations: "163",
    languages: "3",
    rating: "155.23",
  },
  description: "Expert in Vedic astrology with deep knowledge of planetary movements and their effects. Specializes in career guidance, relationship counseling, and life path analysis.",
  image: "/astrologer-profile.png",
}, {
  name: "Abhishek Kumar",
  title: "Vedic Astrologer",
  stats: {
    matches: "10",
    consultations: "163",
    languages: "3",
    rating: "155.23",
  },
  description: "Expert in Vedic astrology with deep knowledge of planetary movements and their effects. Specializes in career guidance, relationship counseling, and life path analysis.",
  image: "/astrologer-profile.png",
}]

export function FeaturedAstrologers() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % astrologers.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + astrologers.length) % astrologers.length)
  }

  return (
    <div className="py-20 bg-gray-50" id="astrologers">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-3xl font-bold text-center mb-12">Astrologers</h2>

        <div className="flex gap-8">
          {/* Main Featured Astrologer */}
          <div className="flex-1 bg-white rounded-xl p-8 relative">
            <div className="flex gap-8">
              {/* Left Content */}
              <div className="flex-1">
                <div className="mb-4">
                  <h3 className="text-4xl font-bold text-purple-900">{astrologers[currentIndex].name}</h3>
                  <p className="text-sm bg-purple-100 text-purple-700 inline-block px-3 py-1 rounded-full mt-2">
                    {astrologers[currentIndex].title}
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-8 mb-6">
                  <div>
                    <div className="text-2xl font-bold">{astrologers[currentIndex].stats.matches}</div>
                    <div className="text-sm text-gray-600">MATCHES</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{astrologers[currentIndex].stats.consultations}</div>
                    <div className="text-sm text-gray-600">CONSULTATIONS</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{astrologers[currentIndex].stats.languages}</div>
                    <div className="text-sm text-gray-600">LANGUAGES</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{astrologers[currentIndex].stats.rating}</div>
                    <div className="text-sm text-gray-600">RATING</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{astrologers[currentIndex].description}</p>
              </div>

              {/* Right Image */}
              <div className="w-96 relative">
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 z-10"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 z-10"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
                <img
                  src={astrologers[currentIndex].image}
                  alt={astrologers[currentIndex].name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Vertical Scroll of Other Astrologers */}
          <div className="w-72">
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {astrologers.map((astrologer, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-full text-left flex items-center gap-4 bg-white p-4 rounded-lg transition-all hover:shadow-md ${currentIndex === i ? 'ring-2 ring-yellow-400' : ''
                    }`}
                >
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={astrologer.image} />
                    <AvatarFallback>PS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-purple-900">{astrologer.name}</h4>
                    <p className="text-sm text-gray-600">{astrologer.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

