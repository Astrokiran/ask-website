"use client";

import { useState, useEffect, FC, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/app/horoscopes/[zodiac]/page";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { DailyHoroscopeCta } from "@/components/banners/Daily-horoscope";
import { createClient } from 'contentful';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, Gem, Palette, Hash, Clock, Brain, Plane, Wand, Heart, Briefcase } from 'lucide-react';

// --- Contentful Client Initialization ---
const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '',
});

// --- Interface for zodiac signs ---
interface ZodiacSign {
  name: string;
  imageUrl: string;
}

const zodiacOrder = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

// --- The Main Interactive Component ---
export const HoroscopeViewer: FC<{ initialData: ApiResponse }> = ({ initialData }) => {
  const router = useRouter();
  const [selectedSign, setSelectedSign] = useState<string>(initialData.sign);
  const [horoscopeData, setHoroscopeData] = useState<ApiResponse>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [zodiacImages, setZodiacImages] = useState<Record<string, string>>({});
  const [imagesLoading, setImagesLoading] = useState<boolean>(true);

  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  useEffect(() => {
    if (selectedSign === initialData.sign) {
      setHoroscopeData(initialData);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      const apiBaseUrl = process.env.NEXT_PUBLIC_HOROSCOPE_API_URL;
      const response = await fetch(`${apiBaseUrl}/api/v1/kundali/horoscope/daily/${selectedSign}`);
      
      if (!response.ok) {
        setIsLoading(false);
        return;
      }

      const data: ApiResponse = await response.json();
      if (data.success) {
        setHoroscopeData(data);
        router.push(`/horoscopes/${selectedSign.toLowerCase()}`, { scroll: false });
      }
      setIsLoading(false);
    };

    fetchData();
  }, [selectedSign, initialData, router]);

  const { sign, date, horoscope } = horoscopeData;

  const detailSections = [
    { title: "Love & Relationships", data: horoscope.love_and_relationships, icon: <Heart className="h-6 w-6 text-orange-500 dark:text-orange-400" /> },
    { title: "Career & Finance", data: horoscope.career_and_finance, icon: <Briefcase className="h-6 w-6 text-orange-500 dark:text-orange-400" /> },
    { title: "Emotions & Mind", data: horoscope.emotions_and_mind, icon: <Brain className="h-6 w-6 text-orange-500 dark:text-orange-400" /> },
    { title: "Travel & Movement", data: horoscope.travel_and_movement, icon: <Plane className="h-6 w-6 text-orange-500 dark:text-orange-400" /> },
    { title: "Remedies", data: horoscope.remedies, icon: <Wand className="h-6 w-6 text-orange-500 dark:text-orange-400" /> },
  ];

  // Fetch zodiac images from CMS
  useEffect(() => {
    const fetchZodiacImages = async () => {
      setImagesLoading(true);
      try {
        const response = await client.getEntries<any>({
          content_type: 'zodiacSigns'
        });

        if (response.items) {
          const imagesMap: Record<string, string> = {};
          response.items.forEach((item: any) => {
            const signName = item.fields.signName;
            const imageUrl = `https:${item.fields.image.fields.file.url}`;
            imagesMap[signName] = imageUrl;
          });
          setZodiacImages(imagesMap);
        }
      } catch (error) {
        console.error("Error fetching zodiac images from CMS:", error);
        // Fallback to default images if CMS fails
        setZodiacImages({
          Aries: "/aries2.jpg",
          Taurus: "/taurus2.jpg",
          Gemini: "/gemini2.jpg",
          Cancer: "/cancer2.jpg",
          Leo: "/leo2.jpg",
          Virgo: "/virgo2.jpg",
          Libra: "/libra2.jpg",
          Scorpio: "/scorpio2.jpg",
          Sagittarius: "/sagrititus2.jpg",
          Capricorn: "/capricorn2.jpg",
          Aquarius: "/aquarius.jpg",
          Pisces: "/pisces2.jpg",
        });
      } finally {
        setImagesLoading(false);
      }
    };

    fetchZodiacImages();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 py-8">
        
        {/* Left Sticky Selector */}
        <aside className="lg:col-span-3 lg:sticky lg:top-8 h-fit space-y-6">
  {/* Selector */}
  <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
    <h2 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-4 tracking-wider">SELECT SIGN</h2>
    <Select value={selectedSign} onValueChange={setSelectedSign}>
      <SelectTrigger className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-lg h-12 shadow-sm">
        <SelectValue placeholder="Select a sign" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
        {zodiacSigns.map((s) => (
          <SelectItem key={s} value={s} className="text-lg">
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* Sign Image */}
  {selectedSign && (
    <div
      key={selectedSign}
      className="flex justify-center animate-fadeInUp"
    >
      {imagesLoading ? (
        <div className="w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 flex items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-orange-500" />
        </div>
      ) : (
        <img
          src={zodiacImages[selectedSign] || "/default-zodiac.png"}
          alt={selectedSign}
          className="w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 object-contain drop-shadow-lg"
        />
      )}
    </div>
  )}
</aside>

        {/* Right Content */}
        <main className="lg:col-span-9">
            <div
              key={selectedSign}
              className="animate-fadeInUp"
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-96">
                  <Loader2 className="h-16 w-16 animate-spin text-orange-500" />
                </div>
              ) : (
                <div className="space-y-8">
                   <div className="text-center">
                    <h1 className="text-5xl md:text-7xl font-semibold text-orange-600 dark:text-orange-400">
                      {sign}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                  </div>

                  {/* Lucky Insights */}
                  <div className="animate-fadeInUp">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <InsightCard icon={<Gem className="text-orange-500 dark:text-orange-400"/>} title="Mood" value={horoscope.lucky_insights.mood} />
                      <InsightCard icon={<Palette className="text-orange-500 dark:text-orange-400"/>} title="Lucky Color" value={horoscope.lucky_insights.lucky_color} />
                      <InsightCard icon={<Hash className="text-orange-500 dark:text-orange-400"/>} title="Lucky Number" value={horoscope.lucky_insights.lucky_number.toString()} />
                      <InsightCard icon={<Clock className="text-orange-500 dark:text-orange-400"/>} title="Lucky Time" value={horoscope.lucky_insights.lucky_time} />
                    </div>
                  </div>
                  
                  {/* Overview */}
                  <HoroscopeCard title="Overview" narrative={horoscope.overview.narrative} reason={horoscope.overview.reason} delay={0.3} />

                  {/* Details */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {detailSections.map((section, index) => (
                       <HoroscopeCard 
                          key={section.title}
                          title={section.title} 
                          icon={section.icon}
                          narrative={section.data.narrative} 
                          reason={section.data.reason} 
                          delay={0.4 + index * 0.1}
                        />
                    ))}
                  </div>
                </div>
              )}
            </div>
        </main>
      </div>
    </div>
  );
};

// --- Reusable Animated Card Components ---
const InsightCard: FC<{ icon: ReactNode, title: string, value: string }> = ({ icon, title, value }) => (
  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex justify-center items-center gap-2 mb-1 text-gray-600 dark:text-gray-400 text-sm">{icon}{title}</div>
    <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
  </div>
);

const HoroscopeCard: FC<{ title: string, narrative: string, reason: string, delay?: number, icon?: ReactNode }> = ({ title, narrative, reason, delay = 0, icon }) => {
  // Special handling for Overview section
  let overviewContent: ReactNode = narrative;

  if (title === "Overview") {
    // Split the narrative into parts
    const [intro, positivePart, negativePart] = narrative.split(/Positive Career Traits:|Negative Career Traits:/);

    const positiveTraits = positivePart?.split(",").map(t => t.trim()).filter(Boolean);
    const negativeTraits = negativePart?.split(",").map(t => t.trim()).filter(Boolean);

    overviewContent = (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{intro.trim()}</p>
        {positiveTraits && (
          <div>
            <h4 className="font-semibold text-green-600 dark:text-green-400">Positive Career Traits:</h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
              {positiveTraits.map((trait, i) => (
                <li key={i}>{trait}</li>
              ))}
            </ul>
          </div>
        )}
        {negativeTraits && (
          <div>
            <h4 className="font-semibold text-red-500 dark:text-red-400">Negative Career Traits:</h4>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
              {negativeTraits.map((trait, i) => (
                <li key={i}>{trait}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md animate-fadeInUp"
    >
      <div className="p-6">
        <h3 className="flex items-center gap-3 text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          {icon}{title}
        </h3>
        {title === "Overview" ? overviewContent : (
          <div className="text-gray-600 dark:text-gray-400 leading-relaxed prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {narrative}
            </ReactMarkdown>
          </div>
        )}
      </div>
      <Accordion type="single" collapsible className="px-6 pb-2">
        <AccordionItem value="item-1" className="border-gray-200 dark:border-gray-700">
          <AccordionTrigger className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
            Astrological Reason
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 dark:text-gray-400 pt-2">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {reason}
              </ReactMarkdown>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
