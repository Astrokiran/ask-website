"use client";

import { useLanguageStore } from '@/stores/languageStore';

interface ZodiacTitleProps {
  zodiac: string;
}

export function ZodiacTitle({ zodiac }: ZodiacTitleProps) {
  const { language } = useLanguageStore();

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

  const translatedSign = getZodiacSignTranslation(zodiac, language);
  const title = language === 'hi' ? `${translatedSign} आज का राशिफल` : `${zodiac} Horoscope Today`;

  return (
    <h1 className="text-4xl font-semibold mb-4 text-gray-900 dark:text-white">
      {title}
    </h1>
  );
}