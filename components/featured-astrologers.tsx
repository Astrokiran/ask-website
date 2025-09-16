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
                      <span className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
                        {currentAstrologer.title}
                      </span>
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">Available Now</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                      <div className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-1">
                        {currentAstrologer.stats.Experience}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Years Experience</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                      <div className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-1 leading-tight">
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

                  {/* WhatsApp CTA Button */}
                  <a
                    href="https://wa.me/918197503574?text=Hi,%20I%20would%20like%20to%20book%20a%20consultation%20with%20an%20astrologer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
                    </svg>
                    WhatsApp Consultation
                  </a>
                </div>

                {/* Right Image */}
                <div className="w-full lg:w-96 relative">
                  {/* Navigation Buttons */}
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-sm hover:shadow-md z-20 transition-all duration-200 hover:scale-[1.02]"
                    aria-label="Previous astrologer"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-sm hover:shadow-md z-20 transition-all duration-200 hover:scale-[1.02]"
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
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 shadow-sm"
                        : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-14 h-14 border-2 border-gray-200 dark:border-gray-600">
                        <AvatarImage src={astrologer.image} alt={astrologer.name} />
                        <AvatarFallback className="bg-blue-600 text-white font-semibold">
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