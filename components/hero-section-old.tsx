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
        `https:${item.fields.image.fields.file.url}?h=600&w=800&q=75&fm=webp`
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
      <div className="min-h-[90vh] bg-background flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-purple-50/30 dark:from-orange-950/20 dark:via-transparent dark:to-purple-950/10"></div>
        <p className="text-foreground text-xl font-semibold">Loading Cosmic Imagery...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-background relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-purple-50/30 dark:from-orange-950/20 dark:via-transparent dark:to-purple-950/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(251,146,60,0.15)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_40%,rgba(251,146,60,0.08)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.05)_0%,transparent_50%)]"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-orange-400 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-purple-400 rounded-full animate-pulse opacity-40 animation-delay-1000"></div>
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-orange-300 rounded-full animate-pulse opacity-50 animation-delay-2000"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Content */}
          <div className="relative z-10 text-center lg:text-left animate-fadeInUp">
            <div className="animate-fadeInUp">
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-8">
                <span className="bg-gradient-to-r from-orange-500 via-purple-600 to-orange-500 bg-clip-text text-transparent">
                  {title}
                </span>
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl lg:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                onClick={handleRedirect}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white text-xl font-bold rounded-2xl shadow-2xl shadow-orange-500/25 transition-all duration-300"
              >
                ✨ Get your Kundli for Free
                <ChevronRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>

              <motion.a
                href="https://wa.me/918197503574?text=Hi,%20I%20would%20like%20to%20consult%20with%20an%20astrologer"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-card/80 backdrop-blur-sm border-2 border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600 text-foreground text-xl font-semibold rounded-2xl shadow-lg transition-all duration-300"
              >
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
                </svg>
                Chat with Astrologer
              </motion.a>
            </motion.div>
          </div>

          {/* Right Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative"
          >
            <div className="relative h-[500px] lg:h-[600px] group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-orange-500/20 rounded-3xl blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

              {/* Main Image Container */}
              <div className="relative h-full w-full rounded-3xl overflow-hidden border border-orange-200/20 dark:border-orange-800/20 shadow-2xl">
                {heroImages.length > 0 && (
                  <motion.img
                    key={currentImageIndex}
                    initial={{ x: 300, opacity: 0, scale: 1.1 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: -300, opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    src={heroImages[currentImageIndex]}
                    alt={`Cosmic imagery ${currentImageIndex + 1}`}
                    className="h-full w-full object-cover"
                  />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Floating Badge */}
                <div className="absolute top-6 right-6 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                  <p className="text-sm font-semibold text-foreground">✨ Live Guidance</p>
                </div>
              </div>

              {/* Image Navigation Indicators */}
              {heroImages.length > 1 && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? 'bg-orange-500 scale-125'
                          : 'bg-muted-foreground/40 hover:bg-muted-foreground/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}