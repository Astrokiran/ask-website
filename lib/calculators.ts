// Love Calculator Logic - Using Numerology-based Algorithm
export function calculateLovePercentage(name1: string, name2: string): number {
  // Clean and normalize names
  const cleanName1 = name1.toLowerCase().replace(/[^a-z]/g, '');
  const cleanName2 = name2.toLowerCase().replace(/[^a-z]/g, '');

  if (!cleanName1 || !cleanName2) return 50;

  // Calculate numerology values for both names
  const value1 = getNameValue(cleanName1);
  const value2 = getNameValue(cleanName2);

  // Calculate base compatibility from numerology
  const sum = value1 + value2;
  const product = value1 * value2;

  // Use FLAMES-style letter matching
  const combined = cleanName1 + cleanName2;
  let letterCount = 0;
  const counted = new Set<string>();

  for (const char of cleanName1) {
    if (!counted.has(char) && cleanName2.includes(char)) {
      letterCount++;
      counted.add(char);
    }
  }

  // Calculate base percentage using multiple factors
  let percentage = 0;

  // Factor 1: Numerology sum (reduced to 2 digits)
  const numSum = (sum % 89) + 10; // Range: 10-98

  // Factor 2: Common letters bonus (0-15%)
  const commonBonus = Math.min(15, letterCount * 3);

  // Factor 3: Name length compatibility
  const lengthDiff = Math.abs(cleanName1.length - cleanName2.length);
  const lengthPenalty = Math.min(10, lengthDiff * 2);

  // Factor 4: Product influence
  const productFactor = (product % 20) - 10;

  // Combine all factors
  percentage = numSum + commonBonus - lengthPenalty + productFactor;

  // Apply final adjustments for consistency
  const nameHash = (cleanName1 + cleanName2).split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);

  const finalAdjustment = (Math.abs(nameHash) % 15) - 7;
  percentage += finalAdjustment;

  // Ensure percentage is between 45 and 99
  percentage = Math.max(45, Math.min(99, Math.round(percentage)));

  return percentage;
}

export function getLoveMessage(percentage: number): string {
  if (percentage >= 90) return "Perfect Match! You two are meant to be together!";
  if (percentage >= 80) return "Excellent Match! Strong compatibility and understanding.";
  if (percentage >= 70) return "Great Match! You complement each other well.";
  if (percentage >= 60) return "Good Match! With effort, this can be wonderful.";
  if (percentage >= 50) return "Fair Match. Communication is key to success.";
  return "Challenging Match. Requires patience and understanding.";
}

// Numerology Calculations
export function calculateLifePathNumber(birthDate: Date): number {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();

  // Reduce each component
  const reducedDay = reduceToSingleDigit(day);
  const reducedMonth = reduceToSingleDigit(month);
  const reducedYear = reduceToSingleDigit(year);

  // Sum and reduce again
  return reduceToSingleDigit(reducedDay + reducedMonth + reducedYear);
}

export function calculateDestinyNumber(fullName: string): number {
  const nameValue = getNameValue(fullName);
  return reduceToSingleDigit(nameValue);
}

export function calculateLuckyNumber(birthDate: Date): number[] {
  const lifePathNumber = calculateLifePathNumber(birthDate);
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;

  const luckyNumbers = [
    lifePathNumber,
    reduceToSingleDigit(day),
    reduceToSingleDigit(month),
    reduceToSingleDigit(day + month),
    reduceToSingleDigit(lifePathNumber * 2),
  ];

  // Return unique lucky numbers
  return [...new Set(luckyNumbers)].sort((a, b) => a - b);
}

export function calculateNameNumerology(name: string) {
  const nameValue = getNameValue(name);
  const nameNumber = reduceToSingleDigit(nameValue);

  // Calculate vowels (soul urge number)
  const vowels = 'aeiou';
  const vowelValue = name
    .toLowerCase()
    .split('')
    .filter(char => vowels.includes(char))
    .reduce((sum, char) => sum + getLetterValue(char), 0);
  const soulUrgeNumber = reduceToSingleDigit(vowelValue);

  // Calculate consonants (personality number)
  const consonantValue = name
    .toLowerCase()
    .split('')
    .filter(char => char.match(/[a-z]/) && !vowels.includes(char))
    .reduce((sum, char) => sum + getLetterValue(char), 0);
  const personalityNumber = reduceToSingleDigit(consonantValue);

  return {
    nameNumber,
    soulUrgeNumber,
    personalityNumber,
  };
}

// Helper Functions
function reduceToSingleDigit(num: number): number {
  // Keep master numbers 11, 22, 33
  if (num === 11 || num === 22 || num === 33) return num;

  while (num > 9) {
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
}

function getLetterValue(letter: string): number {
  const values: { [key: string]: number } = {
    a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
    j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
    s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
  };
  return values[letter.toLowerCase()] || 0;
}

function getNameValue(name: string): number {
  return name
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .split('')
    .reduce((sum, char) => sum + getLetterValue(char), 0);
}

// Life Path Number Meanings
export function getLifePathMeaning(number: number): string {
  const meanings: { [key: number]: string } = {
    1: "The Leader - Independent, ambitious, and pioneering. You are a natural leader with strong willpower.",
    2: "The Peacemaker - Diplomatic, cooperative, and sensitive. You excel in partnerships and teamwork.",
    3: "The Creative - Expressive, optimistic, and social. You have a gift for communication and creativity.",
    4: "The Builder - Practical, disciplined, and hardworking. You create solid foundations and value stability.",
    5: "The Freedom Seeker - Adventurous, versatile, and energetic. You love freedom and new experiences.",
    6: "The Nurturer - Responsible, caring, and harmonious. You're devoted to family and community service.",
    7: "The Seeker - Analytical, spiritual, and introspective. You seek knowledge and deeper understanding.",
    8: "The Powerhouse - Ambitious, authoritative, and material success-oriented. You have strong business acumen.",
    9: "The Humanitarian - Compassionate, generous, and idealistic. You're devoted to making the world better.",
    11: "The Visionary - Intuitive, inspirational, and enlightened. A master number with spiritual insights.",
    22: "The Master Builder - Practical visionary who can turn dreams into reality on a large scale.",
    33: "The Master Teacher - Devoted to uplifting humanity through selfless service and guidance.",
  };
  return meanings[number] || "Unique path with special significance.";
}

// Destiny Number Meanings
export function getDestinyNumberMeaning(number: number): string {
  const meanings: { [key: number]: string } = {
    1: "You're destined to be a leader and pioneer, breaking new ground and inspiring others.",
    2: "Your destiny involves diplomacy, partnership, and bringing people together in harmony.",
    3: "You're meant to express yourself creatively and bring joy to others through your talents.",
    4: "Your destiny is to build lasting structures and provide stability for yourself and others.",
    5: "You're destined for a life of adventure, change, and helping others embrace freedom.",
    6: "Your destiny involves nurturing, teaching, and creating harmony in your community.",
    7: "You're meant to seek and share wisdom, pursuing spiritual and intellectual growth.",
    8: "Your destiny involves achieving material success and using it to benefit others.",
    9: "You're destined to serve humanity and make significant contributions to society.",
    11: "Your destiny is to inspire and enlighten others with your spiritual insights.",
    22: "You're meant to turn grand visions into tangible reality that benefits many.",
    33: "Your destiny is to teach and uplift humanity through compassionate service.",
  };
  return meanings[number] || "You have a unique destiny path.";
}

// Name Compatibility
export function calculateNameCompatibility(name1: string, name2: string) {
  const num1 = calculateDestinyNumber(name1);
  const num2 = calculateDestinyNumber(name2);

  // Compatibility matrix
  const compatibilityScore = getNumberCompatibility(num1, num2);

  return {
    name1Number: num1,
    name2Number: num2,
    compatibilityScore,
    message: getCompatibilityMessage(compatibilityScore),
  };
}

function getNumberCompatibility(num1: number, num2: number): number {
  // Simplified compatibility based on numerology principles
  const compatibilityMatrix: { [key: string]: number } = {
    '1-1': 75, '1-2': 70, '1-3': 85, '1-4': 65, '1-5': 90, '1-6': 70, '1-7': 60, '1-8': 80, '1-9': 75,
    '2-2': 80, '2-3': 75, '2-4': 85, '2-5': 60, '2-6': 95, '2-7': 70, '2-8': 75, '2-9': 80,
    '3-3': 70, '3-4': 60, '3-5': 85, '3-6': 80, '3-7': 65, '3-8': 70, '3-9': 90,
    '4-4': 75, '4-5': 55, '4-6': 85, '4-7': 80, '4-8': 90, '4-9': 65,
    '5-5': 80, '5-6': 60, '5-7': 75, '5-8': 70, '5-9': 85,
    '6-6': 90, '6-7': 65, '6-8': 75, '6-9': 95,
    '7-7': 85, '7-8': 70, '7-9': 80,
    '8-8': 85, '8-9': 75,
    '9-9': 90,
  };

  const key1 = `${Math.min(num1, num2)}-${Math.max(num1, num2)}`;
  return compatibilityMatrix[key1] || 70;
}

function getCompatibilityMessage(score: number): string {
  if (score >= 90) return "Exceptional compatibility! You're perfectly aligned.";
  if (score >= 80) return "Excellent match! Strong natural harmony between you.";
  if (score >= 70) return "Good compatibility with great potential for success.";
  if (score >= 60) return "Fair compatibility. Effort will strengthen your bond.";
  return "Challenging but growth-oriented relationship.";
}

// ==================== VEDIC ASTROLOGY CALCULATORS ====================

// Sun Sign Calculator (Western/Tropical Zodiac)
export interface SunSignResult {
  sign: string;
  element: string;
  quality: string;
  rulingPlanet: string;
  symbol: string;
  description: string;
  traits: string[];
  luckyColor: string;
  luckyNumber: number;
}

export function calculateSunSign(birthDate: Date): SunSignResult {
  const month = birthDate.getMonth() + 1; // 1-12
  const day = birthDate.getDate();

  let sign = '';

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) sign = 'Aries';
  else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) sign = 'Taurus';
  else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) sign = 'Gemini';
  else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) sign = 'Cancer';
  else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) sign = 'Leo';
  else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) sign = 'Virgo';
  else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) sign = 'Libra';
  else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) sign = 'Scorpio';
  else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) sign = 'Sagittarius';
  else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) sign = 'Capricorn';
  else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) sign = 'Aquarius';
  else sign = 'Pisces';

  return getSunSignDetails(sign);
}

function getSunSignDetails(sign: string): SunSignResult {
  const sunSigns: { [key: string]: SunSignResult } = {
    Aries: {
      sign: 'Aries',
      element: 'Fire',
      quality: 'Cardinal',
      rulingPlanet: 'Mars',
      symbol: '♈',
      description: 'The Ram - Bold, ambitious, and enthusiastic',
      traits: ['Courageous', 'Passionate', 'Confident', 'Direct', 'Independent'],
      luckyColor: 'Red',
      luckyNumber: 9,
    },
    Taurus: {
      sign: 'Taurus',
      element: 'Earth',
      quality: 'Fixed',
      rulingPlanet: 'Venus',
      symbol: '♉',
      description: 'The Bull - Reliable, patient, and devoted',
      traits: ['Practical', 'Loyal', 'Sensual', 'Determined', 'Stable'],
      luckyColor: 'Green',
      luckyNumber: 6,
    },
    Gemini: {
      sign: 'Gemini',
      element: 'Air',
      quality: 'Mutable',
      rulingPlanet: 'Mercury',
      symbol: '♊',
      description: 'The Twins - Curious, adaptable, and communicative',
      traits: ['Versatile', 'Witty', 'Social', 'Quick-thinking', 'Expressive'],
      luckyColor: 'Yellow',
      luckyNumber: 5,
    },
    Cancer: {
      sign: 'Cancer',
      element: 'Water',
      quality: 'Cardinal',
      rulingPlanet: 'Moon',
      symbol: '♋',
      description: 'The Crab - Intuitive, emotional, and nurturing',
      traits: ['Caring', 'Protective', 'Emotional', 'Intuitive', 'Loyal'],
      luckyColor: 'Silver',
      luckyNumber: 2,
    },
    Leo: {
      sign: 'Leo',
      element: 'Fire',
      quality: 'Fixed',
      rulingPlanet: 'Sun',
      symbol: '♌',
      description: 'The Lion - Confident, generous, and charismatic',
      traits: ['Creative', 'Passionate', 'Generous', 'Warm-hearted', 'Cheerful'],
      luckyColor: 'Gold',
      luckyNumber: 1,
    },
    Virgo: {
      sign: 'Virgo',
      element: 'Earth',
      quality: 'Mutable',
      rulingPlanet: 'Mercury',
      symbol: '♍',
      description: 'The Virgin - Analytical, practical, and meticulous',
      traits: ['Detail-oriented', 'Practical', 'Hardworking', 'Reliable', 'Kind'],
      luckyColor: 'Navy Blue',
      luckyNumber: 5,
    },
    Libra: {
      sign: 'Libra',
      element: 'Air',
      quality: 'Cardinal',
      rulingPlanet: 'Venus',
      symbol: '♎',
      description: 'The Scales - Diplomatic, fair, and social',
      traits: ['Balanced', 'Diplomatic', 'Social', 'Fair-minded', 'Gracious'],
      luckyColor: 'Pink',
      luckyNumber: 6,
    },
    Scorpio: {
      sign: 'Scorpio',
      element: 'Water',
      quality: 'Fixed',
      rulingPlanet: 'Mars/Pluto',
      symbol: '♏',
      description: 'The Scorpion - Passionate, resourceful, and intense',
      traits: ['Passionate', 'Brave', 'Resourceful', 'Stubborn', 'Loyal'],
      luckyColor: 'Maroon',
      luckyNumber: 9,
    },
    Sagittarius: {
      sign: 'Sagittarius',
      element: 'Fire',
      quality: 'Mutable',
      rulingPlanet: 'Jupiter',
      symbol: '♐',
      description: 'The Archer - Optimistic, adventurous, and philosophical',
      traits: ['Adventurous', 'Optimistic', 'Honest', 'Independent', 'Philosophical'],
      luckyColor: 'Purple',
      luckyNumber: 3,
    },
    Capricorn: {
      sign: 'Capricorn',
      element: 'Earth',
      quality: 'Cardinal',
      rulingPlanet: 'Saturn',
      symbol: '♑',
      description: 'The Goat - Disciplined, responsible, and ambitious',
      traits: ['Responsible', 'Disciplined', 'Self-controlled', 'Ambitious', 'Patient'],
      luckyColor: 'Brown',
      luckyNumber: 8,
    },
    Aquarius: {
      sign: 'Aquarius',
      element: 'Air',
      quality: 'Fixed',
      rulingPlanet: 'Saturn/Uranus',
      symbol: '♒',
      description: 'The Water Bearer - Progressive, original, and humanitarian',
      traits: ['Independent', 'Progressive', 'Original', 'Humanitarian', 'Intellectual'],
      luckyColor: 'Electric Blue',
      luckyNumber: 4,
    },
    Pisces: {
      sign: 'Pisces',
      element: 'Water',
      quality: 'Mutable',
      rulingPlanet: 'Jupiter/Neptune',
      symbol: '♓',
      description: 'The Fish - Compassionate, artistic, and intuitive',
      traits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Wise'],
      luckyColor: 'Sea Green',
      luckyNumber: 7,
    },
  };

  return sunSigns[sign];
}

// Rashi (Moon Sign) Calculator - Vedic/Sidereal Zodiac
export interface RashiResult {
  rashi: string;
  rashiLord: string;
  element: string;
  quality: string;
  symbol: string;
  description: string;
  characteristics: string[];
  luckyGem: string;
}

export function calculateRashi(birthDate: Date): RashiResult {
  // Simplified Rashi calculation based on sun position with sidereal adjustment
  // For 100% accuracy, would need birth time and moon position calculation
  // This uses an approximate method based on date

  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();

  let rashi = '';

  // Sidereal zodiac (shifted ~24 days from tropical)
  if ((month === 4 && day >= 13) || (month === 5 && day <= 14)) rashi = 'Mesha';
  else if ((month === 5 && day >= 15) || (month === 6 && day <= 14)) rashi = 'Vrishabha';
  else if ((month === 6 && day >= 15) || (month === 7 && day <= 14)) rashi = 'Mithuna';
  else if ((month === 7 && day >= 15) || (month === 8 && day <= 14)) rashi = 'Karka';
  else if ((month === 8 && day >= 15) || (month === 9 && day <= 15)) rashi = 'Simha';
  else if ((month === 9 && day >= 16) || (month === 10 && day <= 15)) rashi = 'Kanya';
  else if ((month === 10 && day >= 16) || (month === 11 && day <= 14)) rashi = 'Tula';
  else if ((month === 11 && day >= 15) || (month === 12 && day <= 14)) rashi = 'Vrishchika';
  else if ((month === 12 && day >= 15) || (month === 1 && day <= 13)) rashi = 'Dhanu';
  else if ((month === 1 && day >= 14) || (month === 2 && day <= 12)) rashi = 'Makara';
  else if ((month === 2 && day >= 13) || (month === 3 && day <= 13)) rashi = 'Kumbha';
  else rashi = 'Meena';

  return getRashiDetails(rashi);
}

function getRashiDetails(rashi: string): RashiResult {
  const rashiData: { [key: string]: RashiResult } = {
    Mesha: {
      rashi: 'Mesha (Aries)',
      rashiLord: 'Mars (Mangal)',
      element: 'Fire',
      quality: 'Movable',
      symbol: '♈',
      description: 'Bold and pioneering, natural leaders',
      characteristics: ['Energetic', 'Courageous', 'Quick-tempered', 'Leadership', 'Impulsive'],
      luckyGem: 'Red Coral',
    },
    Vrishabha: {
      rashi: 'Vrishabha (Taurus)',
      rashiLord: 'Venus (Shukra)',
      element: 'Earth',
      quality: 'Fixed',
      symbol: '♉',
      description: 'Stable and pleasure-seeking, value security',
      characteristics: ['Practical', 'Sensual', 'Stubborn', 'Loyal', 'Patient'],
      luckyGem: 'Diamond',
    },
    Mithuna: {
      rashi: 'Mithuna (Gemini)',
      rashiLord: 'Mercury (Budh)',
      element: 'Air',
      quality: 'Dual',
      symbol: '♊',
      description: 'Communicative and intellectual, love variety',
      characteristics: ['Adaptable', 'Communicative', 'Restless', 'Intelligent', 'Curious'],
      luckyGem: 'Emerald',
    },
    Karka: {
      rashi: 'Karka (Cancer)',
      rashiLord: 'Moon (Chandra)',
      element: 'Water',
      quality: 'Movable',
      symbol: '♋',
      description: 'Emotional and nurturing, highly intuitive',
      characteristics: ['Nurturing', 'Emotional', 'Protective', 'Intuitive', 'Moody'],
      luckyGem: 'Pearl',
    },
    Simha: {
      rashi: 'Simha (Leo)',
      rashiLord: 'Sun (Surya)',
      element: 'Fire',
      quality: 'Fixed',
      symbol: '♌',
      description: 'Confident and regal, natural performers',
      characteristics: ['Confident', 'Generous', 'Authoritative', 'Dramatic', 'Proud'],
      luckyGem: 'Ruby',
    },
    Kanya: {
      rashi: 'Kanya (Virgo)',
      rashiLord: 'Mercury (Budh)',
      element: 'Earth',
      quality: 'Dual',
      symbol: '♍',
      description: 'Analytical and service-oriented, perfectionists',
      characteristics: ['Analytical', 'Practical', 'Critical', 'Helpful', 'Detail-oriented'],
      luckyGem: 'Emerald',
    },
    Tula: {
      rashi: 'Tula (Libra)',
      rashiLord: 'Venus (Shukra)',
      element: 'Air',
      quality: 'Movable',
      symbol: '♎',
      description: 'Balanced and diplomatic, seek harmony',
      characteristics: ['Diplomatic', 'Fair', 'Indecisive', 'Social', 'Harmonious'],
      luckyGem: 'Diamond',
    },
    Vrishchika: {
      rashi: 'Vrishchika (Scorpio)',
      rashiLord: 'Mars (Mangal)',
      element: 'Water',
      quality: 'Fixed',
      symbol: '♏',
      description: 'Intense and transformative, deeply emotional',
      characteristics: ['Intense', 'Secretive', 'Passionate', 'Determined', 'Magnetic'],
      luckyGem: 'Red Coral',
    },
    Dhanu: {
      rashi: 'Dhanu (Sagittarius)',
      rashiLord: 'Jupiter (Guru)',
      element: 'Fire',
      quality: 'Dual',
      symbol: '♐',
      description: 'Philosophical and adventurous, truth-seekers',
      characteristics: ['Optimistic', 'Philosophical', 'Adventurous', 'Honest', 'Restless'],
      luckyGem: 'Yellow Sapphire',
    },
    Makara: {
      rashi: 'Makara (Capricorn)',
      rashiLord: 'Saturn (Shani)',
      element: 'Earth',
      quality: 'Movable',
      symbol: '♑',
      description: 'Disciplined and ambitious, career-focused',
      characteristics: ['Disciplined', 'Ambitious', 'Patient', 'Practical', 'Reserved'],
      luckyGem: 'Blue Sapphire',
    },
    Kumbha: {
      rashi: 'Kumbha (Aquarius)',
      rashiLord: 'Saturn (Shani)',
      element: 'Air',
      quality: 'Fixed',
      symbol: '♒',
      description: 'Innovative and humanitarian, independent thinkers',
      characteristics: ['Independent', 'Innovative', 'Humanitarian', 'Detached', 'Intellectual'],
      luckyGem: 'Blue Sapphire',
    },
    Meena: {
      rashi: 'Meena (Pisces)',
      rashiLord: 'Jupiter (Guru)',
      element: 'Water',
      quality: 'Dual',
      symbol: '♓',
      description: 'Compassionate and spiritual, highly intuitive',
      characteristics: ['Compassionate', 'Intuitive', 'Artistic', 'Dreamy', 'Spiritual'],
      luckyGem: 'Yellow Sapphire',
    },
  };

  return rashiData[rashi];
}

// Nakshatra Calculator
export interface NakshatraResult {
  nakshatra: string;
  lord: string;
  pada: number;
  symbol: string;
  deity: string;
  characteristics: string[];
  element: string;
  gana: string;
  luckyColor: string;
  description: string;
}

export function calculateNakshatra(birthDate: Date): NakshatraResult {
  // Simplified nakshatra calculation
  // For 100% accuracy, would need exact birth time and moon longitude calculation
  // This approximates based on day of year

  const dayOfYear = getDayOfYear(birthDate);
  const year = birthDate.getFullYear();
  const daysInYear = isLeapYear(year) ? 366 : 365;

  // Calculate approximate nakshatra (27 nakshatras in 360 degrees)
  // Each nakshatra covers 13.33 degrees, moon moves ~13 degrees per day
  const nakshatraIndex = Math.floor((dayOfYear / daysInYear) * 27) % 27;

  return getNakshatraDetails(nakshatraIndex);
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getNakshatraDetails(index: number): NakshatraResult {
  const nakshatras: NakshatraResult[] = [
    {
      nakshatra: 'Ashwini',
      lord: 'Ketu',
      pada: 1,
      symbol: 'Horse Head',
      deity: 'Ashwini Kumaras',
      characteristics: ['Quick', 'Healing', 'Pioneering', 'Enthusiastic', 'Independent'],
      element: 'Earth',
      gana: 'Deva (Divine)',
      luckyColor: 'Red',
      description: 'Swift and healing, natural healers and pioneers',
    },
    {
      nakshatra: 'Bharani',
      lord: 'Venus',
      pada: 1,
      symbol: 'Yoni (Womb)',
      deity: 'Yama',
      characteristics: ['Creative', 'Passionate', 'Responsible', 'Determined', 'Nurturing'],
      element: 'Earth',
      gana: 'Manushya (Human)',
      luckyColor: 'Red',
      description: 'Creative and nurturing, bear responsibilities well',
    },
    {
      nakshatra: 'Krittika',
      lord: 'Sun',
      pada: 1,
      symbol: 'Razor/Flame',
      deity: 'Agni',
      characteristics: ['Sharp', 'Determined', 'Ambitious', 'Purifying', 'Direct'],
      element: 'Earth',
      gana: 'Rakshasa (Demon)',
      luckyColor: 'White',
      description: 'Sharp and ambitious, cut through obstacles',
    },
    {
      nakshatra: 'Rohini',
      lord: 'Moon',
      pada: 1,
      symbol: 'Cart/Chariot',
      deity: 'Brahma',
      characteristics: ['Beautiful', 'Creative', 'Sensual', 'Materialistic', 'Growth'],
      element: 'Earth',
      gana: 'Manushya (Human)',
      luckyColor: 'White',
      description: 'Beautiful and creative, focused on growth and beauty',
    },
    {
      nakshatra: 'Mrigashira',
      lord: 'Mars',
      pada: 1,
      symbol: 'Deer Head',
      deity: 'Soma',
      characteristics: ['Curious', 'Searching', 'Gentle', 'Suspicious', 'Restless'],
      element: 'Earth',
      gana: 'Deva (Divine)',
      luckyColor: 'Silver',
      description: 'Curious and searching, constantly seeking knowledge',
    },
    {
      nakshatra: 'Ardra',
      lord: 'Rahu',
      pada: 1,
      symbol: 'Teardrop/Diamond',
      deity: 'Rudra',
      characteristics: ['Transformative', 'Intense', 'Emotional', 'Destructive', 'Renewal'],
      element: 'Air',
      gana: 'Manushya (Human)',
      luckyColor: 'Green',
      description: 'Intense and transformative, bring destruction for renewal',
    },
    {
      nakshatra: 'Punarvasu',
      lord: 'Jupiter',
      pada: 1,
      symbol: 'Bow and Quiver',
      deity: 'Aditi',
      characteristics: ['Optimistic', 'Repetitive', 'Philosophical', 'Protective', 'Generous'],
      element: 'Air',
      gana: 'Deva (Divine)',
      luckyColor: 'Yellow',
      description: 'Optimistic and philosophical, capable of renewal',
    },
    {
      nakshatra: 'Pushya',
      lord: 'Saturn',
      pada: 1,
      symbol: 'Cow Udder/Lotus',
      deity: 'Brihaspati',
      characteristics: ['Nurturing', 'Spiritual', 'Disciplined', 'Conservative', 'Devoted'],
      element: 'Water',
      gana: 'Deva (Divine)',
      luckyColor: 'Orange',
      description: 'Nurturing and spiritual, one of the most auspicious',
    },
    {
      nakshatra: 'Ashlesha',
      lord: 'Mercury',
      pada: 1,
      symbol: 'Coiled Serpent',
      deity: 'Nagas',
      characteristics: ['Mystical', 'Secretive', 'Intuitive', 'Cunning', 'Powerful'],
      element: 'Water',
      gana: 'Rakshasa (Demon)',
      luckyColor: 'Red',
      description: 'Mystical and secretive, possess hypnotic charm',
    },
    {
      nakshatra: 'Magha',
      lord: 'Ketu',
      pada: 1,
      symbol: 'Royal Throne',
      deity: 'Pitris (Ancestors)',
      characteristics: ['Royal', 'Authoritative', 'Proud', 'Traditional', 'Respectful'],
      element: 'Water',
      gana: 'Rakshasa (Demon)',
      luckyColor: 'Ivory',
      description: 'Royal and authoritative, connected to ancestors',
    },
    {
      nakshatra: 'Purva Phalguni',
      lord: 'Venus',
      pada: 1,
      symbol: 'Front Legs of Bed',
      deity: 'Bhaga',
      characteristics: ['Creative', 'Pleasure-loving', 'Artistic', 'Relaxing', 'Generous'],
      element: 'Water',
      gana: 'Manushya (Human)',
      luckyColor: 'Light Brown',
      description: 'Creative and pleasure-loving, enjoy life\'s comforts',
    },
    {
      nakshatra: 'Uttara Phalguni',
      lord: 'Sun',
      pada: 1,
      symbol: 'Back Legs of Bed',
      deity: 'Aryaman',
      characteristics: ['Generous', 'Friendly', 'Responsible', 'Leadership', 'Helpful'],
      element: 'Fire',
      gana: 'Manushya (Human)',
      luckyColor: 'Bright Blue',
      description: 'Generous and friendly, natural leaders and helpers',
    },
    {
      nakshatra: 'Hasta',
      lord: 'Moon',
      pada: 1,
      symbol: 'Hand/Fist',
      deity: 'Savitar',
      characteristics: ['Skillful', 'Hardworking', 'Clever', 'Humorous', 'Dexterous'],
      element: 'Fire',
      gana: 'Deva (Divine)',
      luckyColor: 'Light Green',
      description: 'Skillful and hardworking, gifted with manual dexterity',
    },
    {
      nakshatra: 'Chitra',
      lord: 'Mars',
      pada: 1,
      symbol: 'Bright Jewel/Pearl',
      deity: 'Tvashtar',
      characteristics: ['Creative', 'Charismatic', 'Artistic', 'Ambitious', 'Bright'],
      element: 'Fire',
      gana: 'Rakshasa (Demon)',
      luckyColor: 'Black',
      description: 'Creative and charismatic, natural artists and builders',
    },
    {
      nakshatra: 'Swati',
      lord: 'Rahu',
      pada: 1,
      symbol: 'Young Sprout/Coral',
      deity: 'Vayu',
      characteristics: ['Independent', 'Flexible', 'Business-minded', 'Diplomatic', 'Restless'],
      element: 'Fire',
      gana: 'Deva (Divine)',
      luckyColor: 'Black',
      description: 'Independent and flexible, like wind, adaptable',
    },
    {
      nakshatra: 'Vishakha',
      lord: 'Jupiter',
      pada: 1,
      symbol: 'Triumphal Archway',
      deity: 'Indra-Agni',
      characteristics: ['Determined', 'Goal-oriented', 'Ambitious', 'Powerful', 'Patient'],
      element: 'Fire',
      gana: 'Rakshasa (Demon)',
      luckyColor: 'Gold',
      description: 'Determined and goal-oriented, achieve success',
    },
    {
      nakshatra: 'Anuradha',
      lord: 'Saturn',
      pada: 1,
      symbol: 'Lotus/Triumphal Archway',
      deity: 'Mitra',
      characteristics: ['Devoted', 'Balanced', 'Friendly', 'Spiritual', 'Disciplined'],
      element: 'Fire',
      gana: 'Deva (Divine)',
      luckyColor: 'Reddish Brown',
      description: 'Devoted and balanced, excel in foreign lands',
    },
    {
      nakshatra: 'Jyeshtha',
      lord: 'Mercury',
      pada: 1,
      symbol: 'Circular Amulet/Earring',
      deity: 'Indra',
      characteristics: ['Authoritative', 'Protective', 'Responsible', 'Generous', 'Mature'],
      element: 'Air',
      gana: 'Rakshasa (Demon)',
      luckyColor: 'Cream',
      description: 'Authoritative and protective, natural leaders',
    },
    {
      nakshatra: 'Mula',
      lord: 'Ketu',
      pada: 1,
      symbol: 'Tied Roots/Elephant Goad',
      deity: 'Nirriti',
      characteristics: ['Investigative', 'Transformative', 'Philosophical', 'Destructive', 'Rooted'],
      element: 'Air',
      gana: 'Rakshasa (Demon)',
      luckyColor: 'Brown',
      description: 'Investigative and transformative, dig to roots of matters',
    },
    {
      nakshatra: 'Purva Ashadha',
      lord: 'Venus',
      pada: 1,
      symbol: 'Elephant Tusk/Fan',
      deity: 'Apas',
      characteristics: ['Invincible', 'Proud', 'Philosophical', 'Purifying', 'Ambitious'],
      element: 'Air',
      gana: 'Manushya (Human)',
      luckyColor: 'Black',
      description: 'Invincible and proud, cannot be defeated',
    },
    {
      nakshatra: 'Uttara Ashadha',
      lord: 'Sun',
      pada: 1,
      symbol: 'Elephant Tusk/Planks of Bed',
      deity: 'Vishvadevas',
      characteristics: ['Righteous', 'Leadership', 'Ambitious', 'Grateful', 'Principled'],
      element: 'Air',
      gana: 'Manushya (Human)',
      luckyColor: 'Copper',
      description: 'Righteous and principled, achieve lasting victories',
    },
    {
      nakshatra: 'Shravana',
      lord: 'Moon',
      pada: 1,
      symbol: 'Three Footprints/Ear',
      deity: 'Vishnu',
      characteristics: ['Listening', 'Learning', 'Communicative', 'Thoughtful', 'Organized'],
      element: 'Air',
      gana: 'Deva (Divine)',
      luckyColor: 'Light Blue',
      description: 'Great listeners and learners, connect people',
    },
    {
      nakshatra: 'Dhanishta',
      lord: 'Mars',
      pada: 1,
      symbol: 'Drum/Flute',
      deity: 'Eight Vasus',
      characteristics: ['Musical', 'Wealthy', 'Charitable', 'Bold', 'Adaptable'],
      element: 'Ether',
      gana: 'Rakshasa (Demon)',
      luckyColor: 'Silver Grey',
      description: 'Musical and wealthy, generous and charitable',
    },
    {
      nakshatra: 'Shatabhisha',
      lord: 'Rahu',
      pada: 1,
      symbol: 'Empty Circle/1000 Flowers',
      deity: 'Varuna',
      characteristics: ['Healing', 'Secretive', 'Scientific', 'Mystical', 'Independent'],
      element: 'Ether',
      gana: 'Rakshasa (Demon)',
      luckyColor: 'Blue Green',
      description: 'Healing and mystical, see beyond the veil',
    },
    {
      nakshatra: 'Purva Bhadrapada',
      lord: 'Jupiter',
      pada: 1,
      symbol: 'Front Legs of Funeral Cot/Two Faced Man',
      deity: 'Aja Ekapada',
      characteristics: ['Intense', 'Passionate', 'Transformative', 'Mystical', 'Dualistic'],
      element: 'Ether',
      gana: 'Manushya (Human)',
      luckyColor: 'Silver Grey',
      description: 'Intense and transformative, bridge material and spiritual',
    },
    {
      nakshatra: 'Uttara Bhadrapada',
      lord: 'Saturn',
      pada: 1,
      symbol: 'Back Legs of Funeral Cot/Twins',
      deity: 'Ahir Budhnya',
      characteristics: ['Wise', 'Spiritual', 'Patient', 'Calm', 'Mystical'],
      element: 'Ether',
      gana: 'Manushya (Human)',
      luckyColor: 'Purple',
      description: 'Wise and spiritual, bring rain of prosperity',
    },
    {
      nakshatra: 'Revati',
      lord: 'Mercury',
      pada: 1,
      symbol: 'Fish/Drum',
      deity: 'Pushan',
      characteristics: ['Nurturing', 'Protective', 'Compassionate', 'Wealthy', 'Journey'],
      element: 'Ether',
      gana: 'Deva (Divine)',
      luckyColor: 'Brown',
      description: 'Nurturing and compassionate, nourish and protect others',
    },
  ];

  return nakshatras[index];
}
