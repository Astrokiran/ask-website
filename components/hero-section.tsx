"use client"

import { ChevronRight, ChevronLeft, Star } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { client } from "./featured-astrologers"; // Reuse the Contentful client

interface Astrologer {
  name: string;
  title: string;
  stats: {
    Experience: string;
    languages: string;
  };
  description: string;
  image: string;
}

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
}

export function HeroSection({
  title = "Ask Astrokiran Kahin Bhi Kabhi Bhi",
  subtitle = "Connect with expert astrologers ✨ for issues related to Health 💪, Business 📈, Finance 💰, Love ❤️, Marriage 💍, and Government Jobs 🏛️. Get instant personal guidance 💡 and quick, easy-to-follow remedies 🙏 at your convenience."
}: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentAstrologerIndex, setCurrentAstrologerIndex] = useState(0);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [astrologersData, setAstrologersData] = useState<Astrologer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const handleRedirect = () => {
    router.push('/free-kundli');
  };

  useEffect(() => {
    setIsLoading(true);

    // Fetch both hero images and astrologers data
    Promise.all([
      client.getEntries({
        content_type: 'heroimages',
        order: ['fields.order']
      }),
      client.getEntries({
        content_type: 'astrologersImages'
      })
    ])
    .then(([heroResponse, astrologersResponse]) => {
      // Process hero images
      if (heroResponse.items) {
        const fetchedImageUrls: string[] = heroResponse.items.map((item: any) =>
          `https:${item.fields.image.fields.file.url}?h=600&w=800&q=75&fm=webp`
        );
        setHeroImages(fetchedImageUrls);
      }

      // Process astrologers data
      if (astrologersResponse.items && astrologersResponse.items.length > 0) {
        const fetchedAstrologers: Astrologer[] = astrologersResponse.items.map((item: any) => ({
          name: item.fields.astrologerName || "N/A",
          title: item.fields.title || "Astrologer",
          stats: {
            Experience: item.fields.experiance || "N/A",
            languages: item.fields.languages || "Hindi, English",
          },
          description: item.fields.description || "No description available.",
          image: item.fields.astrologerImage?.fields?.file?.url
            ? `https:${item.fields.astrologerImage.fields.file.url}`
            : "/ask-logo.png",
        }));
        setAstrologersData(fetchedAstrologers);
      }
    })
    .catch(error => console.error("Error fetching data from Contentful:", error))
    .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (heroImages.length === 0) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroImages]);

  useEffect(() => {
    if (astrologersData.length === 0) return;

    const timer = setInterval(() => {
      setCurrentAstrologerIndex((prev) => (prev + 1) % astrologersData.length);
    }, 6000); // Slightly different timing than images

    return () => clearInterval(timer);
  }, [astrologersData]);

  const handlePrevAstrologer = () => {
    if (astrologersData.length === 0) return;
    setCurrentAstrologerIndex((prev) => (prev - 1 + astrologersData.length) % astrologersData.length);
  };

  const handleNextAstrologer = () => {
    if (astrologersData.length === 0) return;
    setCurrentAstrologerIndex((prev) => (prev + 1) % astrologersData.length);
  };

  if (isLoading) {
    return (
      <div className="bg-background flex items-center justify-center relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-purple-50/30 dark:from-orange-950/20 dark:via-transparent dark:to-purple-950/10"></div>
        <p className="text-foreground text-xl font-semibold">Loading Cosmic Imagery...</p>
      </div>
    );
  }

  return (
    <div className="bg-background relative overflow-hidden">
      {/* Enhanced Dynamic Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-purple-50/60 to-orange-50/40 dark:from-orange-950/30 dark:via-purple-950/20 dark:to-orange-950/15"></div>

      {/* Multiple layered gradients for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,146,60,0.3)_0%,transparent_40%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(251,146,60,0.15)_0%,transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(147,51,234,0.25)_0%,transparent_45%)] dark:bg-[radial-gradient(circle_at_80%_30%,rgba(147,51,234,0.12)_0%,transparent_45%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.2)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.1)_0%,transparent_50%)]"></div>

      {/* Enhanced Floating Elements with varied sizes and animations */}
      <div className="absolute top-16 left-8 w-3 h-3 bg-orange-400 rounded-full animate-pulse opacity-70 shadow-lg"></div>
      <div className="absolute top-24 left-24 w-2 h-2 bg-purple-500 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-32 right-16 w-4 h-4 bg-pink-400 rounded-full animate-bounce opacity-80 shadow-md"></div>
      <div className="absolute top-48 right-32 w-1.5 h-1.5 bg-orange-300 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute bottom-32 left-16 w-3.5 h-3.5 bg-purple-400 rounded-full animate-bounce opacity-70 shadow-lg"></div>
      <div className="absolute bottom-48 left-40 w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping opacity-50"></div>
      <div className="absolute bottom-24 right-20 w-3 h-3 bg-pink-500 rounded-full animate-pulse opacity-65 shadow-md"></div>

      {/* Magical sparkle effects */}
      <div className="absolute top-20 left-1/4 text-orange-400 opacity-80 animate-pulse text-sm">✨</div>
      <div className="absolute top-40 right-1/4 text-purple-500 opacity-70 animate-bounce text-lg">⭐</div>
      <div className="absolute bottom-40 left-1/3 text-pink-400 opacity-75 animate-pulse text-base">🌟</div>
      <div className="absolute bottom-20 right-1/3 text-orange-500 opacity-80 animate-bounce text-sm">✨</div>
      <div className="absolute top-60 left-1/2 text-purple-400 opacity-60 animate-ping text-xs">💫</div>

      {/* Geometric shapes for modern look */}
      <div className="absolute top-28 left-12 w-8 h-8 border-2 border-orange-300 rotate-45 animate-spin opacity-30"></div>
      <div className="absolute bottom-36 right-12 w-6 h-6 border-2 border-purple-400 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute top-72 right-1/4 w-4 h-4 bg-gradient-to-r from-orange-400 to-purple-500 transform rotate-12 animate-bounce opacity-50"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Content */}
          <div className="relative z-10 text-center lg:text-left">
            {/* Enhanced title with multiple effects */}
            <div className="animate-fadeInUp mb-8">
              {/* Animated badge above title */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-sm border border-orange-300/30 rounded-full px-4 py-2 mb-6 animate-pulse">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
                <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">🔥 India's Most Trusted Astrology Platform</span>
              </div>

              <h1 className="text-2xl lg:text-4xl font-black leading-tight mb-6 relative">
                {/* Glowing background effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-purple-600 to-orange-500 blur-xl opacity-30 animate-pulse"></span>
                <span className="relative bg-gradient-to-r from-orange-500 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
                  {title}
                </span>
                {/* Floating sparkle on title */}
                <span className="absolute -top-2 -right-2 text-yellow-400 animate-bounce text-lg">✨</span>
              </h1>

              {/* Enhanced subtitle with effects */}
              <div className="relative mb-8">
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium mb-4">
                  {subtitle}
                </p>
                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-4">
                  Experience authentic Vedic astrology consultations with India's most trusted platform. Our certified astrologers provide personalized insights into your life's journey, offering comprehensive analysis of your birth chart, planetary positions, and cosmic influences that shape your destiny.
                </p>
                <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Whether you seek guidance on relationships, career decisions, health concerns, or spiritual growth, our expert astrologers combine ancient wisdom with modern understanding to illuminate your path forward with clarity and confidence.
                </p>
                {/* Accent line under subtitle */}
                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full mx-auto lg:mx-0 mt-4 animate-pulse"></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              {/* Enhanced primary button */}
              <button
                onClick={handleRedirect}
                className="group relative inline-flex items-center justify-center gap-3 px-12 py-6 bg-gradient-to-r from-orange-500 via-purple-600 to-pink-500 hover:from-orange-600 hover:via-purple-700 hover:to-pink-600 text-white text-xl font-black rounded-2xl shadow-2xl shadow-orange-500/40 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden"
              >
                {/* Animated background shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <span className="relative flex items-center gap-3">
                  <span className="animate-bounce">🎁</span>
                  Get your Kundli for Free
                  <ChevronRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110" />
                </span>
                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400 to-purple-500 blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </button>

              {/* Enhanced secondary button */}
              <a
                href="https://wa.me/918197503574?text=Hi,%20I%20would%20like%20to%20consult%20with%20an%20astrologer"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 px-12 py-6 bg-card/90 backdrop-blur-md border-2 border-orange-300/50 hover:border-orange-400 dark:border-orange-700/50 dark:hover:border-orange-600 text-foreground text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden"
              >
                {/* Animated background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-purple-50/50 dark:from-orange-950/20 dark:to-purple-950/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <span className="relative flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-500 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
                  </svg>
                  <span className="bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent font-black">First Call: ₹51</span>
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">SPECIAL</span>
                </span>
              </a>
            </div>
          </div>

          {/* Right Astrologer Slideshow */}
          <div className="relative">
            <div className="relative h-[500px] lg:h-[600px] group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-orange-500/20 rounded-3xl blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

              {/* Main Astrologer Container */}
              <div className="relative h-full w-full rounded-3xl overflow-hidden border border-orange-200/20 dark:border-orange-800/20 shadow-2xl bg-card/80 backdrop-blur-sm">
                {astrologersData.length > 0 && (
                  <div key={currentAstrologerIndex} className="h-full flex flex-col">
                    {/* Astrologer Image */}
                    <div className="relative flex-1">
                      <img
                        src={astrologersData[currentAstrologerIndex]?.image}
                        alt={astrologersData[currentAstrologerIndex]?.name}
                        className="h-full w-full object-cover transition-all duration-1000"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                      {/* Floating Badge */}
                      <div className="absolute top-6 right-6 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                        <p className="text-sm font-semibold text-foreground">✨ Expert Astrologer</p>
                      </div>

                      {/* Navigation Buttons */}
                      <button
                        onClick={handlePrevAstrologer}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-orange-500/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors z-10"
                      >
                        <ChevronLeft className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={handleNextAstrologer}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-purple-500/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors z-10"
                      >
                        <ChevronRight className="w-5 h-5 text-white" />
                      </button>
                    </div>

                    {/* Astrologer Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/60 to-transparent text-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-1">
                            {astrologersData[currentAstrologerIndex]?.name}
                          </h3>
                          <p className="text-orange-300 font-medium mb-2">
                            {astrologersData[currentAstrologerIndex]?.title}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span>{astrologersData[currentAstrologerIndex]?.stats.Experience} Years</span>
                            </div>
                            <div className="h-4 w-px bg-white/30"></div>
                            <span>{astrologersData[currentAstrologerIndex]?.stats.languages}</span>
                          </div>
                        </div>
                        <Avatar className="w-16 h-16 border-2 border-white/30">
                          <AvatarImage src={astrologersData[currentAstrologerIndex]?.image} />
                          <AvatarFallback className="bg-gradient-to-br from-orange-400 to-purple-500 text-white font-bold">
                            {astrologersData[currentAstrologerIndex]?.name?.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fallback to hero images if no astrologers */}
                {astrologersData.length === 0 && heroImages.length > 0 && (
                  <img
                    key={currentImageIndex}
                    src={heroImages[currentImageIndex]}
                    alt={`Cosmic imagery ${currentImageIndex + 1}`}
                    className="h-full w-full object-cover transition-all duration-1000"
                  />
                )}
              </div>

              {/* Astrologer Navigation Indicators */}
              {astrologersData.length > 1 && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                  {astrologersData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentAstrologerIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentAstrologerIndex
                          ? 'bg-orange-500 scale-125'
                          : 'bg-muted-foreground/40 hover:bg-muted-foreground/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}