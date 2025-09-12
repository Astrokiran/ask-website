"use client"

import { ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { client } from "./featured-astrologers"; // Reuse the Contentful client


interface HeroSectionProps {
  title?: string;
  subtitle?: string;
}

export function HeroSection({
  title = "Discover Your Cosmic Path",
  subtitle = "Connect with expert astrologers for personalized guidance and unlock the mysteries of your destiny"
}: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/free-kundli');
  };

  useEffect(() => {
    setIsLoading(true);
    client.getEntries({
      content_type: 'heroimages', // Matches your Contentful model ID
      order: ['fields.order']
    })
    .then((response) => {
      if (response.items) {
        const fetchedImageUrls: string[] = response.items.map((item: any) => 
          `https:${item.fields.image.fields.file.url}?h=600&w=800`
        );
        setHeroImages(fetchedImageUrls);
      }
    })
    .catch(error => console.error("Error fetching hero images from Contentful:", error))
    .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (heroImages.length === 0) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); 

    return () => clearInterval(timer);
  }, [heroImages]);

  if (isLoading) {
    return (
        <div className="min-h-[500px] bg-[#1a1b2e] flex items-center justify-center">
            <p className="text-white text-xl">Loading Cosmic Imagery...</p>
        </div>
    );
  }

  return (
    <div className="min-h-[500px] bg-[#1a1b2e] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-15">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative z-20">
            <h1 className="text-5xl font-bold text-white mb-4">{title}</h1>
            <p className="text-lg text-gray-300 mb-8">{subtitle}</p>
            <div className="mt-10">
                <button
                    onClick={handleRedirect}
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-400/50"
                >
                    Get your Kundli for Free
                    <ChevronRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
            </div>
          </div>

          <div className="relative h-[400px] md:h-[500px]">
            <div className="relative h-full w-full">
              {heroImages.length > 0 && (
                <motion.img
                    key={currentImageIndex}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    src={heroImages[currentImageIndex]}
                    alt={`Slide ${currentImageIndex + 1}`}
                    className="h-full w-full object-cover object-center rounded-lg shadow-lg"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#1a1b2e]/20 to-[#1a1b2e]/40 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}