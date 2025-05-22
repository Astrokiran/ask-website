"use client"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
}

const images = [
  "/guide.png?height=600&width=800",
  "/girl-on-hone.png?height=600&width=800",
  "/astrologer.png?height=600&width=800",
  // Add more image paths as needed
];

export function HeroSection({
  title = "Discover Your Cosmic Path",
  subtitle = "Connect with expert astrologers for personalized guidance and unlock the mysteries of your destiny"
}: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const whatsappNumber = "+918197503574";
  const message = "Hello, I would like to get an astrology consultation.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-[500px] bg-[#1a1b2e] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-15">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side content */}
          <div className="relative z-20">
            <h1 className="text-5xl font-bold text-white mb-4">{title}</h1>
            <p className="text-lg text-gray-300 mb-8">
              {subtitle}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-8">
              <Button
                className="bg-[#25D366] hover:bg-[#22c35e] text-white font-semibold px-8 py-6 rounded-xl shadow-lg flex items-center gap-2 transition-all duration-200 text-xl"
                onClick={() => window.open(whatsappLink, '_blank')}
              >
                Consult on Whatsapp
                <img
                  src="/social.png"
                  alt="WhatsApp"
                  className="w-10 h-10"
                />
              </Button>
            </div>
          </div>

          {/* Right side carousel */}
          <div className="relative h-[400px] md:h-[500px]">
            <div className="relative h-full w-full">
              <motion.img
                key={currentImageIndex}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                src={images[currentImageIndex]}
                alt={`Slide ${currentImageIndex + 1}`}
                className="h-full w-full object-cover object-center rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#1a1b2e]/20 to-[#1a1b2e]/40 rounded-lg" />

              {/* Navigation buttons */}
              {/* <button
                onClick={previousImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight size={24} />
              </button> */}

              {/* Dots indicator */}
              {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                  />
                ))}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
