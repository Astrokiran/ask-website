export interface Horoscope {
  zodiac: string;
  prediction: string;
  date: string;
  timestamp: string;
}

export const zodiacSigns = [
  "Aries",
  "Taurus", 
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces"
] as const;

export type ZodiacSign = typeof zodiacSigns[number];

export function getZodiacName(index: string | number): ZodiacSign {
  const numericIndex = typeof index === 'string' ? parseInt(index) : index;
  return zodiacSigns[numericIndex - 1];
}
