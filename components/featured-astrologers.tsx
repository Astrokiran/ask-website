"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

const astrologers = [{
  name: "Dr. Ujjwal Agarwal",
  title: "Jyotish",
  stats: {
    Experience: "20+",
    languages: "Hindi, English",
  },
  description: "Dr. Ujjwal Agarwal is an internationally renowned Vedic & Medical Astrologer; Expert in Vastu, Mantra & Yantra Shastra. He has a vast knowledge in Indian Astrology and Vastu Shastra. With over 20 years of experience practicing Vedic Astrology, his knowledge leads to positive results for each individual. He has knowledge of various fields of astrology such like Horoscope Reading, Muhurat Shastra, Vastu Shastra, Gemstones Recommendations, Remedies through Yantra and Mantra and many more astrology related fields.",
  image: "/ujjawal-astrologer-bg-rm.png",
}, {
  name: "Sheel Kumar Gupta",
  title: "Senior Astrologer",
  stats: {
    Experience: "26+",
    languages: "Hindi, English",
  },
  description: "Expert in Vedic astrology with deep knowledge of planetary movements and their effects. Specializes in career guidance, relationship counseling, and life path analysis.",
  image: "/sheel-astrologer.png",
}, {
  name: "Mohit Nigam",
  title: "Senior Astrologer",
  stats: {
    Experience: "10+",
    languages: "Hindi, English",
  },
  description: "Astrologer & Vastu Consultant with 10+ years of working experience. Have on-field work experience includes: 10K+ Astro Consultations; 800+ Vastu Consultations; 600+ Numero Consultations. Scientific thinking and philosophically bent Astrologer & Vastu Consultant since last decade, with a strong liking for Astrology and all its allied branches. Coming from a family of Astrologers and from childhood learnt Astrology traditionally. Highly skilled in translation of Astrological and other texts from Hindi, Sanskrit to English and vice versa.",
  image: "/mohit-nigam.png",
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
    <div className="w-full bg-gray-50" id="astrologers">
      <div className="py-10 md:py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Astrologers</h2>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Main Featured Astrologer */}
          <div className="flex-1 bg-white rounded-xl p-4 md:p-8 relative">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Left Content */}
              <motion.div
                className="flex-1"
                key={currentIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <h3 className="text-2xl md:text-4xl font-bold text-purple-900">{astrologers[currentIndex].name}</h3>
                  <p className="text-sm bg-purple-100 text-purple-700 inline-block px-3 py-1 rounded-full mt-2">
                    {astrologers[currentIndex].title}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-6">
                  <div>
                    <div className="text-2xl font-bold">{astrologers[currentIndex].stats.Experience}</div>
                    <div className="text-sm text-gray-600">Experience</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold">{astrologers[currentIndex].stats.languages}</div>
                    <div className="text-sm text-gray-600">LANGUAGES</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 h-[200px] overflow-y-auto">{astrologers[currentIndex].description}</p>
              </motion.div>

              {/* Right Image */}
              <div className="w-full md:w-96 relative h-[300px] md:h-auto">
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 z-10"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 z-10"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </button>
                <motion.img
                  key={currentIndex}
                  src={astrologers[currentIndex].image}
                  alt={astrologers[currentIndex].name}
                  className="w-full h-full object-cover rounded-lg"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>

          {/* Vertical Scroll of Other Astrologers */}
          <div className="w-full md:w-72">
            <div className="space-y-4 max-h-[400px] md:max-h-[600px] overflow-y-auto">
              {astrologers.map((astrologer, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-full text-left flex items-center gap-4 bg-white p-3 md:p-4 rounded-lg transition-all hover:shadow-md ${currentIndex === i ? 'ring-2 ring-yellow-400' : ''
                    }`}
                >
                  <Avatar className="w-12 h-12 md:w-16 md:h-16">
                    <AvatarImage src={astrologer.image} />
                    <AvatarFallback>PS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-purple-900 text-sm md:text-base">{astrologer.name}</h4>
                    <p className="text-xs md:text-sm text-gray-600">{astrologer.title}</p>
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

