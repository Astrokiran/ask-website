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
  subtitle = "Connect with expert astrologers for issues related to Health, Business, Finance, Love, Marriage, and Government Jobs. Get instant personal guidance and quick, easy-to-follow remedies at your convenience."
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
    <div className="bg-background relative w-full max-w-full overflow-hidden">
      {/* Clean Apple-style background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/80 dark:from-gray-900/50 dark:to-gray-800/80"></div>

      {/* Subtle geometric elements */}
      <div className="absolute top-20 left-8 w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full opacity-40"></div>
      <div className="absolute bottom-32 right-16 w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full opacity-30"></div>



      <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12 lg:py-20">

        {/* Mobile Services Cards - Only visible on mobile */}
        <div className="block lg:hidden">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Service
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Get personalized insights and guidance from expert astrologers
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Free Kundli Card */}
            <a href="/free-kundli" className="group">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-600 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Free Kundli</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Birth Chart Analysis</p>
                </div>
              </div>
            </a>

            {/* Kundli Matching Card */}
            <a href="/kundli-match" className="group">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                <div className="text-center">
                  <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-pink-600 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Kundli Match</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Marriage Compatibility</p>
                </div>
              </div>
            </a>

            {/* Daily Horoscope Card */}
            <a href="/horoscopes" className="group">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-600 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0V3a.5.5 0 01.5-.5zM21 12a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2a.5.5 0 01.5.5zM12 18.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5zM5.5 12a.5.5 0 01-.5.5H3a.5.5 0 010-1h2a.5.5 0 01.5.5zM7.5 6.5a.5.5 0 010 .707l-1.414 1.414a.5.5 0 11-.707-.707L6.793 6.5a.5.5 0 01.707 0zM18.207 6.5a.5.5 0 01.707 0 .5.5 0 010 .707L17.5 8.621a.5.5 0 11-.707-.707L18.207 6.5zM17.5 15.879a.5.5 0 01.707.707l1.414 1.414a.5.5 0 01-.707.707L17.5 17.293a.5.5 0 010-.707zM7.5 17.293a.5.5 0 01-.707 0 .5.5 0 010-.707l1.414-1.414a.5.5 0 11.707.707L7.5 17.293zM12 8a4 4 0 100 8 4 4 0 000-8z"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Horoscope</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Daily Predictions</p>
                </div>
              </div>
            </a>

            {/* Blog Card */}
            <a href="/blog" className="group">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-600 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Blog</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Astrology Articles</p>
                </div>
              </div>
            </a>
          </div>

          {/* CTA Button for mobile */}
          <div className="text-center">
            <a
              href="https://wa.me/918197503574?text=Hi,%20I%20would%20like%20to%20consult%20with%20an%20astrologer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
              </svg>
              Talk to Astrologer - ₹51
            </a>
          </div>
        </div>

        {/* Desktop Hero Content - Only visible on desktop */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center w-full">

          {/* Left Side - Main Content */}
          <div className="relative z-10 text-center lg:text-left">
            {/* Enhanced title with multiple effects */}
            <div className="animate-fadeInUp mb-8">
              {/* Animated badge above title */}
              <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-black/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">India's Most Trusted Astrology Platform</span>
              </div>

              <h1 className="text-xl lg:text-3xl font-bold leading-tight mb-4 text-gray-900 dark:text-white lg:whitespace-nowrap">
                {title}
              </h1>

              {/* Enhanced subtitle with effects */}
              <div className="relative mb-6">
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium mb-3">
                  {subtitle}
                </p>
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-3">
                  Experience authentic Vedic astrology consultations with India's most trusted platform. Our certified astrologers provide personalized insights into your life's journey, offering comprehensive analysis of your birth chart, planetary positions, and cosmic influences that shape your destiny.
                </p>
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Whether you seek guidance on relationships, career decisions, health concerns, or spiritual growth, our expert astrologers combine ancient wisdom with modern understanding to illuminate your path forward with clarity and confidence.
                </p>
                {/* Accent line under subtitle */}
                <div className="w-20 h-0.5 bg-gray-300 dark:bg-gray-600 mx-auto lg:mx-0 mt-3"></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* Enhanced primary button */}
              <button
                onClick={handleRedirect}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                <span className="flex items-center gap-2">
                  Get your Kundli for Free
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </button>

              {/* Enhanced secondary button */}
              <a
                href="https://wa.me/918197503574?text=Hi,%20I%20would%20like%20to%20consult%20with%20an%20astrologer"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">First Call: ₹51</span>
                  <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">Special</span>
                </span>
              </a>
            </div>
          </div>

          {/* Right Side - Large Astrologer Images with Slider Controls */}
          <div className="relative flex flex-col items-center justify-center space-y-6">
            {/* Astrologer Images Section - Larger and Rounded */}
            {astrologersData.length > 0 && (
              <div className="flex flex-col items-center space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Meet Our Expert Astrologers</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Experienced Vedic astrology specialists</p>
                </div>

                {/* Large Astrologer Image with Navigation */}
                <div className="relative flex items-center justify-center">
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevAstrologer}
                    className="absolute left-0 z-10 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </button>

                  {/* Main Astrologer Display */}
                  <div key={currentAstrologerIndex} className="flex flex-col items-center mx-16">
                    <div className="relative">
                      <img
                        src={astrologersData[currentAstrologerIndex]?.image}
                        alt={astrologersData[currentAstrologerIndex]?.name}
                        className="w-32 h-32 lg:w-40 lg:h-40 object-cover object-center rounded-full border-4 border-orange-300 dark:border-orange-700 shadow-2xl transition-all duration-1000 hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/astrologer.png';
                        }}
                      />
                      {/* Decorative ring around image */}
                      <div className="absolute inset-0 rounded-full border-2 border-orange-200/50 dark:border-orange-800/50 animate-pulse"></div>
                    </div>

                    {/* Astrologer Info */}
                    <div className="text-center mt-4">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {astrologersData[currentAstrologerIndex]?.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {astrologersData[currentAstrologerIndex]?.title}
                      </p>
                      <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>Exp: {astrologersData[currentAstrologerIndex]?.stats.Experience}</span>
                        <span>•</span>
                        <span>{astrologersData[currentAstrologerIndex]?.stats.languages}</span>
                      </div>

                      {/* Star rating */}
                      <div className="flex items-center justify-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">4.8</span>
                      </div>
                    </div>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNextAstrologer}
                    className="absolute right-0 z-10 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                {/* Indicators */}
                {astrologersData.length > 1 && (
                  <div className="flex space-x-2 mt-4">
                    {astrologersData.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentAstrologerIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          index === currentAstrologerIndex
                            ? 'bg-orange-500 scale-110'
                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-orange-300 dark:hover:bg-orange-700'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* End Desktop Hero Content */}

      </div>
    </div>
  )
}