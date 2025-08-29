"use client";

import { useState, useEffect, FC, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ApiResponse } from "@/app/horoscopes/[zodiac]/page"; 
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";


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

// --- The Main Interactive Component ---
export const HoroscopeViewer: FC<{ initialData: ApiResponse }> = ({ initialData }) => {
  const router = useRouter();
  const [selectedSign, setSelectedSign] = useState<string>(initialData.sign);
  const [horoscopeData, setHoroscopeData] = useState<ApiResponse>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    { title: "Love & Relationships", data: horoscope.love_and_relationships, icon: <Heart className="h-6 w-6 text-red-400" /> },
    { title: "Career & Finance", data: horoscope.career_and_finance, icon: <Briefcase className="h-6 w-6 text-blue-400" /> },
    { title: "Emotions & Mind", data: horoscope.emotions_and_mind, icon: <Brain className="h-6 w-6 text-purple-400" /> },
    { title: "Travel & Movement", data: horoscope.travel_and_movement, icon: <Plane className="h-6 w-6 text-green-400" /> },
    { title: "Remedies", data: horoscope.remedies, icon: <Wand className="h-6 w-6 text-teal-400" /> },
  ];

  const zodiacImages: Record<string, string> = {
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
};

  return (
   <div> 
    <NavBar />
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 py-8">
        
        {/* Left Sticky Selector */}
        <aside className="lg:col-span-3 lg:sticky lg:top-8 h-fit space-y-6">
  {/* Selector */}
  <div className="p-6 bg-white rounded-2xl border border-orange-200 shadow-md">
    <h2 className="text-lg font-bold text-orange-400 mb-4 tracking-wider">SELECT SIGN</h2>
    <Select value={selectedSign} onValueChange={setSelectedSign}>
      <SelectTrigger className="w-full bg-white border-orange-300 text-lg h-12 shadow-sm">
        <SelectValue placeholder="Select a sign" />
      </SelectTrigger>
      <SelectContent className="bg-white border-orange-200 text-slate-900">
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
    <motion.div
      key={selectedSign}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex justify-center"
    >
      <img
        src={zodiacImages[selectedSign]}
        alt={selectedSign}
  className="w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 object-contain drop-shadow-lg"
      />
    </motion.div>
  )}
</aside>

        {/* Right Content */}
        <main className="lg:col-span-9">
          <AnimatePresence mode="wait"> 
            <motion.div
              key={selectedSign}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-96">
                  <Loader2 className="h-16 w-16 animate-spin text-orange-400" />
                </div>
              ) : (
                <div className="space-y-8">
                   <div className="text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold font-serif text-orange-400 drop-shadow-md">
                      {sign}
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                  </div>

                  {/* Lucky Insights */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <InsightCard icon={<Gem className="text-yellow-500"/>} title="Mood" value={horoscope.lucky_insights.mood} />
                      <InsightCard icon={<Palette className="text-orange-400"/>} title="Lucky Color" value={horoscope.lucky_insights.lucky_color} />
                      <InsightCard icon={<Hash className="text-amber-500"/>} title="Lucky Number" value={horoscope.lucky_insights.lucky_number.toString()} />
                      <InsightCard icon={<Clock className="text-orange-300"/>} title="Lucky Time" value={horoscope.lucky_insights.lucky_time} />
                    </div>
                  </motion.div>
                  
                  {/* Overview */}
                  <HoroscopeCard title="🔮 Overview" narrative={horoscope.overview.narrative} reason={horoscope.overview.reason} delay={0.3} />

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
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
       <Footer />

  </div>
  );
};

// --- Reusable Animated Card Components ---
const InsightCard: FC<{ icon: ReactNode, title: string, value: string }> = ({ icon, title, value }) => (
  <div className="p-4 bg-white rounded-xl border border-orange-200 shadow-[4px_4px_12px_rgba(255,165,0,0.12),-4px_-4px_12px_rgba(255,215,0,0.08)] hover:shadow-[6px_6px_16px_rgba(255,140,0,0.18)] transition-all duration-300">
    <div className="flex justify-center items-center gap-2 mb-1 text-slate-600 text-sm">{icon}{title}</div>
    <p className="text-lg font-semibold text-black">{value}</p>
  </div>
);

const HoroscopeCard: FC<{ title: string, narrative: string, reason: string, delay: number, icon?: ReactNode }> = ({ title, narrative, reason, delay, icon }) => (
  <motion.div 
    className="bg-white rounded-2xl border border-orange-200 shadow-[4px_4px_14px_rgba(255,165,0,0.12),-4px_-4px_14px_rgba(255,215,0,0.08)] overflow-hidden"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    whileHover={{ y: -5, boxShadow: "0px 10px 25px rgba(255,165,0,0.25)" }}
  >
    <div className="p-6">
      <h3 className="flex items-center gap-3 text-2xl font-bold mb-4 text-black">
        {icon}{title}
      </h3>
      <p className="text-slate-700 leading-relaxed">{narrative}</p>
    </div>
    <Accordion type="single" collapsible className="px-6 pb-2">
      <AccordionItem value="item-1" className="border-orange-200">
        <AccordionTrigger className="text-slate-600 hover:text-black text-sm">
          Astrological Reason
        </AccordionTrigger>
        <AccordionContent className="text-slate-600 pt-2">{reason}</AccordionContent>
      </AccordionItem>
    </Accordion>
    </motion.div>
);
