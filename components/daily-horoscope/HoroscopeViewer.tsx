"use client";

import { useState, useEffect, FC } from "react";
import { useRouter } from "next/navigation";
import { ApiResponse } from "@/app/horoscopes/[zodiac]/page";
import { useLanguageStore } from '@/stores/languageStore';
import { LanguageSelector } from '@/components/ui/language-selector';
import { createClient } from 'contentful';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

// --- Interface for the image data we fetch from Contentful ---
interface ZodiacImageMap {
  [key: string]: string; // e.g., { aquarius: 'https://...', leo: 'https://...' }
}

// --- Types ---
interface HoroscopeCategory {
  narrative: string;
  reason: string;
}

interface LuckyInsights {
  mood: string;
  lucky_color: string;
  lucky_number: number;
  lucky_time: string;
}

interface HoroscopeDetails {
  overview: HoroscopeCategory;
  love_and_relationships: HoroscopeCategory;
  career_and_finance: HoroscopeCategory;
  emotions_and_mind: HoroscopeCategory;
  travel_and_movement: HoroscopeCategory;
  remedies: HoroscopeCategory;
  lucky_insights: LuckyInsights;
}

// --- The Main Interactive Component ---
export const HoroscopeViewer: FC<{
  initialData: ApiResponse;
  zodiacSign: string;
  currentLanguage: string;
}> = ({ initialData, zodiacSign, currentLanguage }) => {
  const router = useRouter();
  const { language } = useLanguageStore();
  const [horoscopeData, setHoroscopeData] = useState<ApiResponse>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [zodiacImages, setZodiacImages] = useState<ZodiacImageMap>({});

  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  // Fetch zodiac images from Contentful on component mount
  useEffect(() => {
    const fetchZodiacImages = async () => {
      try {
        const response = await client.getEntries({
          content_type: 'zodiacSigns', // The correct Contentful content type ID
          include: 2, // Include linked assets
        });

        const images: ZodiacImageMap = {};
        response.items.forEach((item: any) => {
          // Contentful entries have 'signName' and 'image' fields
          if (item.fields.signName && item.fields.image && item.fields.image.fields?.file?.url) {
            const sign = item.fields.signName.toLowerCase();
            images[sign] = `https:${item.fields.image.fields.file.url}`;
          }
        });

        setZodiacImages(images);
      } catch (error) {
        console.error('Error fetching zodiac images from Contentful:', error);
      }
    };

    fetchZodiacImages();
  }, []);

  // Update horoscope data when language changes
  useEffect(() => {
    if (language !== currentLanguage || language !== horoscopeData.language) {
      fetchHoroscopeData();
    }
  }, [language, currentLanguage, horoscopeData.language]);

  const fetchHoroscopeData = async () => {
    setIsLoading(true);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_HOROSCOPE_API_URL;
      if (!apiBaseUrl) {
        throw new Error("API URL not configured");
      }

      const response = await fetch(`${apiBaseUrl}/api/v1/kundali/horoscope/daily/${zodiacSign}?language=${language}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      if (data.success) {
        setHoroscopeData(data);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error fetching horoscope data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const { sign, date, horoscope } = horoscopeData;

  // Zodiac sign translations
  const getZodiacSignTranslation = (sign: string, lang: string): string => {
    const zodiacTranslations: { [key: string]: { [lang: string]: string } } = {
      'Aries': { 'en': 'Aries', 'hi': 'मेष' },
      'Taurus': { 'en': 'Taurus', 'hi': 'वृषभ' },
      'Gemini': { 'en': 'Gemini', 'hi': 'मिथुन' },
      'Cancer': { 'en': 'Cancer', 'hi': 'कर्क' },
      'Leo': { 'en': 'Leo', 'hi': 'सिंह' },
      'Virgo': { 'en': 'Virgo', 'hi': 'कन्या' },
      'Libra': { 'en': 'Libra', 'hi': 'तुला' },
      'Scorpio': { 'en': 'Scorpio', 'hi': 'वृश्चिक' },
      'Sagittarius': { 'en': 'Sagittarius', 'hi': 'धनु' },
      'Capricorn': { 'en': 'Capricorn', 'hi': 'मकर' },
      'Aquarius': { 'en': 'Aquarius', 'hi': 'कुंभ' },
      'Pisces': { 'en': 'Pisces', 'hi': 'मीन' }
    };
    return zodiacTranslations[sign]?.[lang] || sign;
  };

  // Planet translations
  const getPlanetTranslation = (text: string, lang: string): string => {
    const planetTranslations: { [key: string]: { [lang: string]: string } } = {
      'Sun': { 'en': 'Sun', 'hi': 'सूर्य' },
      'Moon': { 'en': 'Moon', 'hi': 'चंद्रमा' },
      'Mars': { 'en': 'Mars', 'hi': 'मंगल' },
      'Mercury': { 'en': 'Mercury', 'hi': 'बुध' },
      'Jupiter': { 'en': 'Jupiter', 'hi': 'गुरु' },
      'Venus': { 'en': 'Venus', 'hi': 'शुक्र' },
      'Saturn': { 'en': 'Saturn', 'hi': 'शनि' },
      'Rahu': { 'en': 'Rahu', 'hi': 'राहु' },
      'Ketu': { 'en': 'Ketu', 'hi': 'केतु' }
    };

    let translatedText = text;
    Object.entries(planetTranslations).forEach(([en, translations]) => {
      const regex = new RegExp(`\\b${en}\\b`, 'g');
      translatedText = translatedText.replace(regex, translations[lang] || en);
    });

    return translatedText;
  };

  // Translation helper
  const t = (key: string, fallback: string) => {
    const translatedSign = getZodiacSignTranslation(sign, language);
    const translations: { [key: string]: { [lang: string]: string } } = {
      'horoscope.title': {
        'en': `${sign} Horoscope Today`,
        'hi': `${translatedSign} आज का राशिफल`
      },
      'horoscope.subtitle': {
        'en': `Your daily forecast for ${sign}`,
        'hi': `${translatedSign} के लिए आपका दैनिक पूर्वानुमान`
      },
      'sections.overview': {
        'en': 'Overview',
        'hi': 'सिंहावलोकन'
      },
      'sections.love': {
        'en': 'Love & Relationships',
        'hi': 'प्रेम और रिश्ते'
      },
      'sections.career': {
        'en': 'Career & Finance',
        'hi': 'करियर और वित्त'
      },
      'sections.emotions': {
        'en': 'Emotions & Mind',
        'hi': 'भावनाएं और मन'
      },
      'sections.travel': {
        'en': 'Travel & Movement',
        'hi': 'यात्रा और गतिशील'
      },
      'sections.remedies': {
        'en': 'Remedies',
        'hi': 'उपाय'
      },
      'sections.lucky': {
        'en': 'Lucky Insights',
        'hi': 'भाग्यशाली अंतर्दृष्टियां'
      },
      'loading': {
        'en': 'Loading...',
        'hi': 'लोड हो रहा है...'
      },
      'lucky.color': {
        'en': 'Lucky Color',
        'hi': 'भाग्यशाली रंग'
      },
      'lucky.number': {
        'en': 'Lucky Number',
        'hi': 'भाग्यशाली अंक'
      },
      'lucky.time': {
        'en': 'Lucky Time',
        'hi': 'भाग्यशाली समय'
      },
      'lucky.mood': {
        'en': 'Mood',
        'hi': 'मनोदशा'
      },
      'language.current': {
        'en': 'Language: English',
        'hi': 'भाषा: हिंदी'
      }
    };

    return translations[key]?.[language] || fallback;
  };

  const detailSections = [
    {
      title: t('sections.overview', 'Overview'),
      data: horoscope.overview,
      icon: <Brain className="h-6 w-6 text-orange-500 dark:text-orange-400" />
    },
    {
      title: t('sections.love', 'Love & Relationships'),
      data: horoscope.love_and_relationships,
      icon: <Heart className="h-6 w-6 text-orange-500 dark:text-orange-400" />
    },
    {
      title: t('sections.career', 'Career & Finance'),
      data: horoscope.career_and_finance,
      icon: <Briefcase className="h-6 w-6 text-orange-500 dark:text-orange-400" />
    },
    {
      title: t('sections.emotions', 'Emotions & Mind'),
      data: horoscope.emotions_and_mind,
      icon: <Brain className="h-6 w-6 text-orange-500 dark:text-orange-400" />
    },
    {
      title: t('sections.travel', 'Travel & Movement'),
      data: horoscope.travel_and_movement,
      icon: <Plane className="h-6 w-6 text-orange-500 dark:text-orange-400" />
    },
    {
      title: t('sections.remedies', 'Remedies'),
      data: horoscope.remedies,
      icon: <Wand className="h-6 w-6 text-orange-500 dark:text-orange-400" />
    },
  ];

  // Get zodiac icon (using Contentful images with emoji fallback)
  const getZodiacIcon = (sign: string): { type: 'image' | 'emoji'; content: string } => {
    const signKey = sign.toLowerCase();

    // Check if we have a Contentful image for this zodiac sign
    if (zodiacImages[signKey]) {
      return {
        type: 'image',
        content: zodiacImages[signKey]
      };
    }

    // Fallback to emoji if no Contentful image
    const icons: { [key: string]: string } = {
      "Aries": "♈",
      "Taurus": "♉",
      "Gemini": "♊",
      "Cancer": "♋",
      "Leo": "♌",
      "Virgo": "♍",
      "Libra": "♎",
      "Scorpio": "♏",
      "Sagittarius": "♐",
      "Capricorn": "♑",
      "Aquarius": "♒",
      "Pisces": "♓"
    };

    return {
      type: 'emoji',
      content: icons[sign] || "✨"
    };
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans">
      {/* Header with Language Selector */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {t('horoscope.title', `${sign} Horoscope Today`)}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('horoscope.subtitle', `Your daily forecast for ${sign}`)} • {date}
              </p>
            </div>
            {/* <LanguageSelector /> */}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {t('loading', 'Loading...')}
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Sidebar - Sign Selector */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-4">
              {/* Sign Display */}
              <div className="text-center mb-6">
                <div className="flex justify-center items-center mb-4">
                  {(() => {
                    const icon = getZodiacIcon(sign);
                    return icon.type === 'image' ? (
                      <img
                        src={icon.content}
                        alt={sign}
                        className="w-24 h-24 md:w-28 md:h-28 object-contain"
                      />
                    ) : (
                      <div className="text-6xl">
                        {icon.content}
                      </div>
                    );
                  })()}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {language === 'hi' ? getZodiacSignTranslation(sign, 'hi') : sign}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {date}
                </p>
              </div>

              {/* Language Info */}
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('language.current', language === 'hi' ? 'भाषा: हिंदी' : 'Language: English')}
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Horoscope Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Lucky Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('sections.lucky', 'Lucky Insights')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Palette className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {t('lucky.color', 'Lucky Color')}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {horoscope.lucky_insights.lucky_color}
                  </p>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Hash className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {t('lucky.number', 'Lucky Number')}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {horoscope.lucky_insights.lucky_number}
                  </p>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {t('lucky.time', 'Lucky Time')}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {horoscope.lucky_insights.lucky_time}
                  </p>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Gem className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {t('lucky.mood', 'Mood')}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {horoscope.lucky_insights.mood}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Sections */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <Accordion type="single" collapsible className="space-y-4">
                {detailSections.map((section, index) => (
                  <AccordionItem key={index} value={section.title} className="border border-gray-200 dark:border-gray-700">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between text-left">
                        <div className="flex items-center gap-3">
                          {section.icon}
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            {section.title}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="prose prose-gray-600 dark:prose-gray-400 max-w-none">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                          <p className="text-gray-900 dark:text-white mb-2 font-medium">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {language === 'hi' ? getPlanetTranslation(section.data.narrative, 'hi') : section.data.narrative}
                            </ReactMarkdown>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                            <em>{language === 'hi' ? getPlanetTranslation(section.data.reason, 'hi') : section.data.reason}</em>
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};