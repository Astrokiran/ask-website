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

      {/* Banner Image at Top - Mobile Only */}
      <div className="relative w-full lg:hidden">
        <a
          href="https://play.google.com/store/apps/details?id=com.astrokiran.user&pcampaignid=web_share"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full hover:opacity-95 transition-opacity duration-300"
        >
          <img
            src="https://images.ctfassets.net/53lf7jlviu2d/5LmXwfcBez4Z94AmxGIrJ5/303ff1faf4542e379d72d318ca0c2c48/enhancedonerupeebanner.png"
            alt="Download AstroKiran App - Special Offer"
            className="w-full h-auto object-cover"
          />
        </a>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12 lg:py-20">

        {/* Mobile Services Cards - Only visible on mobile */}
        <div className="block lg:hidden">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Service
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Get personalized insights and guidance from expert astrologers
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Quick Connect Card */}
            <button
              onClick={() => {
                const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
                if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
                  window.location.href = "https://apps.apple.com/in/app/ask-astrokiran-astrology/id6748694746";
                } else if (/android/i.test(userAgent)) {
                  window.location.href = "https://play.google.com/store/apps/details?id=com.astrokiran.user&pcampaignid=web_share";
                } else {
                  window.location.href = "https://play.google.com/store/apps/details?id=com.astrokiran.user&pcampaignid=web_share";
                }
              }}
              className="group text-left"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white dark:bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                    <svg className="w-7 h-7" style={{ color: '#D32F2F' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Quick Connect</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Instant Astrology Help</p>
                </div>
              </div>
            </button>

            {/* Free Kundli Card */}
            <a href="/free-kundli" className="group">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white dark:bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                    <img
                      src="/astrology.png"
                      alt="Free Kundli"
                      className="w-10 h-10"
                      style={{
                        filter: 'brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(6539%) hue-rotate(351deg) brightness(88%) contrast(95%)'
                      }}
                    />
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
                  <div className="w-12 h-12 bg-white dark:bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                    <img
                      src="/marriage.png"
                      alt="Kundli Matching"
                      className="w-10 h-10"
                      style={{
                        filter: 'brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(6539%) hue-rotate(351deg) brightness(88%) contrast(95%)'
                      }}
                    />
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
                  <div className="w-12 h-12 bg-white dark:bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                    <img
                      src="/sunset.png"
                      alt="Daily Horoscope"
                      className="w-10 h-10"
                      style={{
                        filter: 'brightness(0) saturate(100%) invert(24%) sepia(91%) saturate(6539%) hue-rotate(351deg) brightness(88%) contrast(95%)'
                      }}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Horoscope</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Daily Predictions</p>
                </div>
              </div>
            </a>
          </div>

          {/* CTA Button for mobile */}
          <div className="text-center">
            <a
              href="https://play.google.com/store/apps/details?id=com.astrokiran.user&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-col items-center gap-1 bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                </svg>
                <span className="font-semibold">Download App</span>
              </div>
              <span className="text-xs">Recharge ₹1, Get 5 min FREE (₹250 value)</span>
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
                href="https://play.google.com/store/apps/details?id=com.astrokiran.user&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex flex-col items-center justify-center gap-1 px-6 py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                  </svg>
                  <span className="font-semibold">Download App</span>
                </div>
                <span className="text-xs">Recharge ₹1, Get 5 min FREE (₹250 value)</span>
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
                <div className="relative flex items-center justify-center w-full max-w-md mx-auto">
                  {/* Previous Button - Fixed Position */}
                  <button
                    onClick={handlePrevAstrologer}
                    className="absolute left-0 z-10 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </button>

                  {/* Main Astrologer Display - Fixed Width Container */}
                  <div key={currentAstrologerIndex} className="flex flex-col items-center w-64 mx-auto">
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
                    <div className="text-center mt-4 w-full">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
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

                  {/* Next Button - Fixed Position */}
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

      {/* Banner Image After Hero Section - Desktop Only */}
      <div className="hidden lg:flex relative w-full justify-center pb-8 lg:pb-12">
        <a
          href="https://play.google.com/store/apps/details?id=com.astrokiran.user&pcampaignid=web_share"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-3/4 xl:w-2/3 hover:opacity-95 transition-opacity duration-300"
        >
          <img
            src="https://images.ctfassets.net/53lf7jlviu2d/5LmXwfcBez4Z94AmxGIrJ5/303ff1faf4542e379d72d318ca0c2c48/enhancedonerupeebanner.png"
            alt="Download AstroKiran App - Special Offer"
            className="w-full h-auto object-cover rounded-xl shadow-lg"
          />
        </a>
      </div>
    </div>
  )
}