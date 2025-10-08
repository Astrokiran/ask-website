"use client"

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "contentful";

// Define a type for the astrologer data
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

export const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '',
});

export function FeaturedAstrologers() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [astrologersData, setAstrologersData] = useState<Astrologer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    client
      .getEntries<any>({ content_type: "astrologersImages" })
      .then((response) => {
        if (response.items && response.items.length > 0) {
          const fetchedAstrologers: Astrologer[] = response.items.map((item: any) => ({
            name: item.fields.astrologerName || "N/A",
            title: item.fields.title || "Astrologer",
            stats: {
              Experience: item.fields.experiance|| "N/A",
              languages: item.fields.languages || "Hindi, English",
            },
            description: item.fields.description || "No description available.",
            image: item.fields.astrologerImage?.fields?.file?.url
              ? `https:${item.fields.astrologerImage.fields.file.url}`
              : "/ask-logo.png",
          }));
          setAstrologersData(fetchedAstrologers);
          setCurrentIndex(0);
        } else {
          console.warn("Contentful returned no astrologers. Using initial static data.");
          setCurrentIndex(0);
        }
      })
      .catch(error => {
        console.error("Error fetching astrologers from Contentful:", error);
        setCurrentIndex(0);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleNext = () => {
    if (astrologersData.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % astrologersData.length);
  };

  const handlePrev = () => {
    if (astrologersData.length === 0) return;
    setCurrentIndex(
      (prev) => (prev - 1 + astrologersData.length) % astrologersData.length
    );
  };

  if (isLoading) {
    return (
      <div className="w-full py-10 md:py-20 text-center" id="astrologers">
        Loading astrologers...
      </div>
    );
  }

  if (astrologersData.length === 0) {
    return (
      <div className="w-full" id="astrologers">
        <div className="py-10 md:py-20 max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-foreground">
            Our Astrologers
          </h2>
          <p className="text-center">No astrologers available at the moment.</p>
        </div>
      </div>
    );
  }

  const currentAstrologer = astrologersData[currentIndex];

  if (!currentAstrologer) {
     console.error("FeaturedAstrologers: currentAstrologer is undefined despite data being present. Resetting index.");
     setCurrentIndex(0);
     return (
        <div className="w-full py-10 md:py-20 text-center" id="astrologers">
            Error displaying astrologer. Please try refreshing.
        </div>
     );
  }

  return (
    <div className="w-full relative" id="astrologers">
      {/* Clean Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"></div>

      <div className="relative py-16 md:py-24 max-w-7xl mx-auto px-4">
        {/* Clean Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4">
            Meet Our Astrologers
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Connect with experienced spiritual guides who illuminate your path through ancient wisdom
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Featured Astrologer */}
          <div className="flex-1 relative">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-10 border border-gray-200 dark:border-gray-700 shadow-sm">

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Content */}
                <div className="flex-1 space-y-6" key={currentIndex}>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-3">
                      {currentAstrologer.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">
                        {currentAstrologer.title}
                      </span>
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">Available Now</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                      <div className="text-2xl font-semibold text-orange-600 dark:text-orange-400 mb-1">
                        {currentAstrologer.stats.Experience}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Years Experience</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                      <div className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-1 leading-tight">
                        {currentAstrologer.stats.languages}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Languages</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">About</h4>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed h-[200px] overflow-y-auto">
                      {currentAstrologer.description}
                    </p>
                  </div>

                  {/* App Download CTA */}
                  <div className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] rounded-xl p-6 shadow-lg">
                    <div className="text-center mb-4">
                      <h4 className="text-white text-xl font-bold mb-2">
                        ✨ Download App Now!
                      </h4>
                      <p className="text-white/90 text-sm">
                        Connect instantly with our expert astrologers
                      </p>
                      <div className="mt-3 inline-block bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                        <p className="text-white font-semibold text-sm">
                          🎁 Special Offer: Recharge ₹1, Get 5 min FREE
                        </p>
                        <p className="text-white/80 text-xs">(Worth ₹250)</p>
                      </div>
                    </div>
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
                      className="w-full bg-white hover:bg-gray-100 text-[#D32F2F] font-bold py-4 px-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                      </svg>
                      Download App Now
                    </button>
                  </div>
                </div>

                {/* Right Image */}
                <div className="w-full lg:w-96 relative">
                  {/* Navigation Buttons */}
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-orange-600 hover:bg-orange-700 rounded-full flex items-center justify-center shadow-sm hover:shadow-md z-20 transition-all duration-200 hover:scale-[1.02]"
                    aria-label="Previous astrologer"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-orange-600 hover:bg-orange-700 rounded-full flex items-center justify-center shadow-sm hover:shadow-md z-20 transition-all duration-200 hover:scale-[1.02]"
                    aria-label="Next astrologer"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>

                  {/* Image Container */}
                  <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
                    <img
                      key={currentIndex}
                      src={currentAstrologer.image}
                      alt={currentAstrologer.name}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                    {/* Status indicator */}
                    <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-sm z-10">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">All Astrologers</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {astrologersData.map((astrologer, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-full text-left flex items-center gap-4 p-4 rounded-xl transition-all duration-200 border hover:scale-[1.02] ${
                      currentIndex === i
                        ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 shadow-sm"
                        : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-14 h-14 border-2 border-gray-200 dark:border-gray-600">
                        <AvatarImage src={astrologer.image} alt={astrologer.name} />
                        <AvatarFallback className="bg-orange-600 text-white font-semibold">
                          {astrologer.name ? astrologer.name.substring(0, 2) : "??"}
                        </AvatarFallback>
                      </Avatar>
                      {currentIndex === i && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-base truncate">
                        {astrologer.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {astrologer.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex text-yellow-500 text-xs">
                          ★★★★★
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">4.9</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}