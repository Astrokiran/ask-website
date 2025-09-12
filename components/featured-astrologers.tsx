"use client"

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
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
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});


export function FeaturedAstrologers() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [astrologersData, setAstrologersData] = useState<Astrologer[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    setIsLoading(true); // Start loading
    client
      .getEntries<any>({ content_type: "astrologersImages" })
      .then((response) => {
        if (response.items && response.items.length > 0) {
          const fetchedAstrologers: Astrologer[] = response.items.map((item: any) => ({
            // Map fields from Contentful, providing fallbacks
            name: item.fields.astrologerName || "N/A",
            title: item.fields.title || "Astrologer",
            stats: {
              Experience: item.fields.experiance|| "N/A",
              languages: item.fields.languages || "Hindi, English", // Fallback to default languages
            },
            description: item.fields.description || "No description available.",
            image: item.fields.astrologerImage?.fields?.file?.url
              ? `https:${item.fields.astrologerImage.fields.file.url}`
              : "/ask-logo.png", 
          }));
          setAstrologersData(fetchedAstrologers);
          setCurrentIndex(0); // Reset index to 0 when new data is loaded
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
    if (astrologersData.length === 0) return; // Prevent division by zero if array is empty
    setCurrentIndex((prev) => (prev + 1) % astrologersData.length);
  };

  const handlePrev = () => {
    if (astrologersData.length === 0) return; // Prevent issues if array is empty
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
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            Our Astrologers
          </h2>
          <p className="text-center">No astrologers available at the moment.</p>
        </div>
      </div>
    );
  }

  // If we reach here, astrologersData is not empty and currentIndex should be valid
  const currentAstrologer = astrologersData[currentIndex];

  // Defensive check - should ideally not be needed with correct state management
  if (!currentAstrologer) {
     console.error("FeaturedAstrologers: currentAstrologer is undefined despite data being present. Resetting index.");
     setCurrentIndex(0); // Attempt to recover
     return (
        <div className="w-full py-10 md:py-20 text-center" id="astrologers">
            Error displaying astrologer. Please try refreshing.
        </div>
     );
  }



  return (
    <div className="w-full" id="astrologers">
      <div className="py-10 md:py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
          Our Astrologers
        </h2>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Main Featured Astrologer */}
          <div className="flex-1 bg-white rounded-xl p-4 md:p-8 relative">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Left Content */}
              <motion.div
                className="flex-1"
                key={currentIndex} // Key helps motion detect changes
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <h3 className="text-2xl md:text-4xl font-bold text-purple-900">
                    {currentAstrologer.name}
                  </h3>
                  <p className="text-sm bg-purple-100 text-purple-700 inline-block px-3 py-1 rounded-full mt-2">
                    {currentAstrologer.title}
                  </p>
                </div>

                <div className="grid md:grid-cols-4 gap-4 md:gap-8 mb-6">
                  <div>
                    <div className="text-2xl font-bold">
                      {currentAstrologer.stats.Experience}
                    </div>
                    <div className="text-sm text-gray-600">Experience</div>
                  </div>
                  <div className="col-span-3 mt-1">
                    <div className="text-xl font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                      {currentAstrologer.stats.languages}
                    </div>
                    <div className="text-sm text-gray-600">Languages</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 h-[240px] overflow-y-auto">
                  {currentAstrologer.description}
                </p>
              </motion.div>

              {/* Right Image */}
              <div className="w-full md:w-96 relative h-[350px] md:h-[480px]">
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 z-10"
                  aria-label="Previous astrologer" // Add accessibility label
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-500 z-10"
                  aria-label="Next astrologer" // Add accessibility label
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </button>
                <motion.img
                  key={currentIndex} // Key helps motion detect changes
                  src={currentAstrologer.image}
                  alt={currentAstrologer.name}
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
              {astrologersData.map((astrologer, i) => (
                <button
                  key={i} // Using index as key is okay here as list order is stable
                  onClick={() => setCurrentIndex(i)}
                  className={`w-full text-left flex items-center gap-4 bg-white p-3 md:p-4 rounded-lg transition-all hover:shadow-md ${
                    currentIndex === i ? "ring-2 ring-yellow-400" : ""
                  }`}
                >
                  <Avatar className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
                    <AvatarImage src={astrologer.image} alt={astrologer.name} /> {/* Add alt text */}
                    <AvatarFallback>
                      {astrologer.name ? astrologer.name.substring(0, 2) : "???"} {/* Handle potential empty name */}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-purple-900 text-sm md:text-base">
                      {astrologer.name}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-600">
                      {astrologer.title}
                    </p>
                  </div>
                </button>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  
  );
  
}