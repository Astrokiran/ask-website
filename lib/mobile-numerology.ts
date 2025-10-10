/**
 * Mobile Number Numerology Calculator
 * Analyzes the energetic influence of mobile numbers on life
 */

// Reduce number to single digit (keeping master numbers 11, 22, 33)
function reduceToSingleDigit(num: number, keepMasterNumbers = true): number {
  if (keepMasterNumbers && (num === 11 || num === 22 || num === 33)) {
    return num
  }

  while (num > 9) {
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0)
    if (keepMasterNumbers && (num === 11 || num === 22 || num === 33)) {
      return num
    }
  }
  return num
}

/**
 * Calculate Driver Number (Birth Number) from birth date
 */
export function calculateDriverNumber(birthDate: Date): number {
  const day = birthDate.getDate()
  return reduceToSingleDigit(day, true)
}

/**
 * Extract and calculate mobile number
 */
export function calculateMobileNumber(mobileNumber: string): {
  original: string
  digits: string
  sum: number
  coreNumber: number
  last4Digits: string
  last4Sum: number
  last4CoreNumber: number
  repeatingPatterns: string[]
} {
  // Extract only digits from mobile number
  const digits = mobileNumber.replace(/[^0-9]/g, '')

  if (digits.length === 0) {
    throw new Error('No digits found in mobile number')
  }

  // Calculate core number (sum of all digits)
  const sum = digits.split('').reduce((total, digit) => total + parseInt(digit), 0)
  const coreNumber = reduceToSingleDigit(sum, false)

  // Calculate last 4 digits (most active energy)
  const last4Digits = digits.slice(-4)
  const last4Sum = last4Digits.split('').reduce((total, digit) => total + parseInt(digit), 0)
  const last4CoreNumber = reduceToSingleDigit(last4Sum, false)

  // Identify repeating patterns
  const repeatingPatterns: string[] = []

  // Check for triple digits
  for (let i = 0; i <= 9; i++) {
    const pattern = i.toString().repeat(3)
    if (digits.includes(pattern)) {
      repeatingPatterns.push(pattern)
    }
  }

  // Check for double digits
  for (let i = 0; i <= 9; i++) {
    const pattern = i.toString().repeat(2)
    const count = (digits.match(new RegExp(pattern, 'g')) || []).length
    if (count >= 2 && !repeatingPatterns.some(p => p.includes(pattern))) {
      repeatingPatterns.push(`${pattern} (${count} times)`)
    }
  }

  return {
    original: mobileNumber,
    digits,
    sum,
    coreNumber,
    last4Digits,
    last4Sum,
    last4CoreNumber,
    repeatingPatterns
  }
}

/**
 * Mobile Number Traits and Meanings
 */
interface NumberTraits {
  planet: string
  energy: string
  traits: string[]
  bestFor: string[]
  impact: {
    career: string
    love: string
    health: string
  }
  compatible: number[]
  incompatible: number[]
  color: string
  day: string
}

const NUMBER_TRAITS: { [key: number]: NumberTraits } = {
  1: {
    planet: 'Sun',
    energy: 'Leadership, Independence, Innovation',
    traits: ['Confident', 'Ambitious', 'Pioneering', 'Individualistic'],
    bestFor: ['Business owners', 'Leaders', 'Entrepreneurs', 'Politicians'],
    impact: {
      career: 'Excellent for leadership roles and starting new ventures. Attracts opportunities for advancement and recognition.',
      love: 'You project confidence and attract partners who admire your strength. May need to balance independence with partnership.',
      health: 'Generally good vitality, but watch for stress-related issues from overwork. Heart and circulation need attention.'
    },
    compatible: [1, 3, 5, 9],
    incompatible: [2, 4, 6, 8],
    color: 'Golden, Orange, Yellow',
    day: 'Sunday'
  },
  2: {
    planet: 'Moon',
    energy: 'Harmony, Partnership, Diplomacy',
    traits: ['Sensitive', 'Cooperative', 'Intuitive', 'Peaceful'],
    bestFor: ['Counselors', 'Mediators', 'Artists', 'Diplomats'],
    impact: {
      career: 'Success through partnerships and teamwork. Good for collaborative work and people-oriented professions.',
      love: 'Attracts nurturing relationships and deep emotional connections. You need emotional security and stability.',
      health: 'Sensitive to stress and emotional disturbances. Digestive system and mental health need care.'
    },
    compatible: [2, 4, 6, 7],
    incompatible: [1, 5, 9],
    color: 'White, Cream, Light Green',
    day: 'Monday'
  },
  3: {
    planet: 'Jupiter',
    energy: 'Communication, Creativity, Expression',
    traits: ['Expressive', 'Optimistic', 'Creative', 'Social'],
    bestFor: ['Writers', 'Speakers', 'Teachers', 'Performers'],
    impact: {
      career: 'Excellent for creative and communication fields. Brings luck and expansion in professional life.',
      love: 'Attracts fun, social relationships with lots of communication. You need a partner who appreciates your expressiveness.',
      health: 'Generally good health with natural optimism. Watch for liver and weight-related issues from excess.'
    },
    compatible: [1, 3, 5, 6, 9],
    incompatible: [4, 8],
    color: 'Yellow, Purple, Violet',
    day: 'Thursday'
  },
  4: {
    planet: 'Rahu',
    energy: 'Stability, Hard Work, Discipline',
    traits: ['Practical', 'Organized', 'Reliable', 'Patient'],
    bestFor: ['Builders', 'Managers', 'Engineers', 'Accountants'],
    impact: {
      career: 'Success through steady effort and practical approach. Good for structured work and building long-term assets.',
      love: 'Attracts stable, committed relationships. You need security and loyalty from partners.',
      health: 'May face delays or chronic issues. Bone health, knees, and nervous system need attention.'
    },
    compatible: [2, 4, 6, 7, 8],
    incompatible: [1, 3, 5, 9],
    color: 'Blue, Grey, Black',
    day: 'Saturday'
  },
  5: {
    planet: 'Mercury',
    energy: 'Change, Freedom, Adventure',
    traits: ['Versatile', 'Curious', 'Quick', 'Adaptable'],
    bestFor: ['Travelers', 'Sales', 'Media', 'Technology'],
    impact: {
      career: 'Brings variety and opportunities for travel. Success in fast-paced, changing environments and communication fields.',
      love: 'Attracts exciting, dynamic relationships. You need freedom and variety to stay interested.',
      health: 'Nervous system sensitivity. Need to balance restless energy. Skin and respiratory health important.'
    },
    compatible: [1, 3, 5, 6, 9],
    incompatible: [2, 4],
    color: 'Green, Light Brown',
    day: 'Wednesday'
  },
  6: {
    planet: 'Venus',
    energy: 'Love, Luxury, Harmony',
    traits: ['Loving', 'Artistic', 'Balanced', 'Responsible'],
    bestFor: ['Artists', 'Designers', 'Hospitality', 'Healers'],
    impact: {
      career: 'Success in beauty, luxury, and service industries. Attracts comfortable work environments and harmonious colleagues.',
      love: 'Excellent for romantic relationships and family life. Attracts love and creates harmonious partnerships.',
      health: 'Generally good health with focus on beauty and wellness. Throat, kidneys, and reproductive health need care.'
    },
    compatible: [2, 3, 4, 5, 6, 8, 9],
    incompatible: [1],
    color: 'Pink, Blue, White',
    day: 'Friday'
  },
  7: {
    planet: 'Ketu',
    energy: 'Spirituality, Wisdom, Analysis',
    traits: ['Analytical', 'Spiritual', 'Intuitive', 'Independent'],
    bestFor: ['Researchers', 'Spiritual teachers', 'Scientists', 'Analysts'],
    impact: {
      career: 'Success in research, spirituality, and analytical work. May face unexpected changes but leads to deeper wisdom.',
      love: 'Attracts deep, spiritual connections. You need intellectual and spiritual compatibility.',
      health: 'May face mysterious ailments. Mental health and detoxification important. Need for solitude and meditation.'
    },
    compatible: [2, 4, 7],
    incompatible: [1, 5, 9],
    color: 'Purple, Violet, White',
    day: 'Tuesday'
  },
  8: {
    planet: 'Saturn',
    energy: 'Success, Power, Material Wealth',
    traits: ['Ambitious', 'Disciplined', 'Powerful', 'Karmic'],
    bestFor: ['Business tycoons', 'Politicians', 'Real estate', 'Mining'],
    impact: {
      career: 'Brings material success and authority, but through hard work. Success may come late but lasts long.',
      love: 'May face delays or karmic patterns in relationships. Need for mature, responsible partners.',
      health: 'May face chronic issues or delays in recovery. Bone health, joints, and teeth need attention.'
    },
    compatible: [4, 6, 8],
    incompatible: [1, 2, 3, 5, 9],
    color: 'Dark Blue, Black, Purple',
    day: 'Saturday'
  },
  9: {
    planet: 'Mars',
    energy: 'Completion, Wisdom, Humanitarian',
    traits: ['Courageous', 'Compassionate', 'Universal', 'Transformative'],
    bestFor: ['Warriors', 'Surgeons', 'Social workers', 'Leaders'],
    impact: {
      career: 'Success through courage and helping others. Good for leadership, military, and humanitarian work.',
      love: 'Attracts passionate relationships. You need a partner who shares your ideals and can handle your intensity.',
      health: 'High energy but prone to accidents and inflammation. Blood pressure and accidents need caution.'
    },
    compatible: [1, 3, 5, 6, 9],
    incompatible: [2, 4, 7, 8],
    color: 'Red, Crimson, Pink',
    day: 'Tuesday'
  }
}

/**
 * Calculate compatibility between mobile number and driver number
 */
function calculateCompatibility(mobileNumber: number, driverNumber: number): number {
  const traits = NUMBER_TRAITS[driverNumber]

  if (!traits) return 50 // Default if driver number not found

  // Check if highly compatible
  if (traits.compatible.includes(mobileNumber)) {
    return driverNumber === mobileNumber ? 95 : 85 // Same number = highest compatibility
  }

  // Check if incompatible
  if (traits.incompatible.includes(mobileNumber)) {
    return 35
  }

  // Neutral
  return 60
}

/**
 * Get compatibility level
 */
function getCompatibilityLevel(score: number): {
  level: string
  color: string
  icon: string
} {
  if (score >= 85) {
    return { level: 'Excellent Match', color: 'green', icon: '🌟' }
  } else if (score >= 70) {
    return { level: 'Good Match', color: 'blue', icon: '✅' }
  } else if (score >= 55) {
    return { level: 'Fair Match', color: 'yellow', icon: '⚖️' }
  } else if (score >= 40) {
    return { level: 'Below Average', color: 'orange', icon: '⚠️' }
  } else {
    return { level: 'Not Recommended', color: 'red', icon: '❌' }
  }
}

/**
 * Generate detailed analysis
 */
function generateAnalysis(
  mobileNumber: number,
  driverNumber: number,
  last4Number: number,
  score: number
): string {
  const mobileTraits = NUMBER_TRAITS[mobileNumber]
  const driverTraits = NUMBER_TRAITS[driverNumber]

  if (!mobileTraits || !driverTraits) {
    return 'Unable to generate detailed analysis.'
  }

  if (score >= 85) {
    return `Excellent compatibility! Your mobile number ${mobileNumber} (${mobileTraits.planet}) resonates perfectly with your driver number ${driverNumber} (${driverTraits.planet}). This combination creates a powerful synergy that supports your natural tendencies and life path. The ${mobileTraits.energy.toLowerCase()} energy of your mobile number amplifies your core strengths. Your last 4 digits (${last4Number}) further enhance this positive flow, bringing ${NUMBER_TRAITS[last4Number]?.energy.toLowerCase() || 'balanced energy'} into your daily communications.`
  } else if (score >= 70) {
    return `Good compatibility! Your mobile number ${mobileNumber} works well with your driver number ${driverNumber}. While not a perfect match, this combination brings ${mobileTraits.traits[0].toLowerCase()} and ${mobileTraits.traits[1].toLowerCase()} energies that complement your personality. Your last 4 digits (${last4Number}) add an extra layer of ${NUMBER_TRAITS[last4Number]?.traits[0].toLowerCase() || 'positive'} energy to your daily interactions.`
  } else if (score >= 55) {
    return `Fair compatibility. Your mobile number ${mobileNumber} has a neutral relationship with your driver number ${driverNumber}. This combination won't cause major issues but may not provide the enhanced positive energy that a more compatible number would offer. The last 4 digits (${last4Number}) carry ${NUMBER_TRAITS[last4Number]?.energy.toLowerCase() || 'mixed energy'} which slightly influences your daily life.`
  } else if (score >= 40) {
    return `Below average compatibility. The energies of your driver number ${driverNumber} (${driverTraits.planet}) and mobile number ${mobileNumber} (${mobileTraits.planet}) don't align naturally. You might experience some friction in areas of life where this number is frequently used. Your last 4 digits (${last4Number}) need special attention as they carry the most active energy. Consider remedies or alternative numbers.`
  } else {
    return `Not recommended. There's a significant energy clash between your driver number ${driverNumber} and mobile number ${mobileNumber}. The ${mobileTraits.energy.toLowerCase()} of your mobile conflicts with your ${driverTraits.energy.toLowerCase()} nature. This mismatch could lead to communication issues, missed opportunities, or general obstacles in areas this number influences. Your last 4 digits (${last4Number}) may be particularly problematic. Strongly consider changing this number.`
  }
}

/**
 * Suggest lucky numbers
 */
function suggestLuckyNumbers(driverNumber: number): number[] {
  const traits = NUMBER_TRAITS[driverNumber]
  if (!traits) return [1, 3, 5, 6, 9] // Default lucky numbers

  return traits.compatible
}

/**
 * Get remedies for mobile numbers
 */
function getRemedies(mobileNumber: number, score: number): string[] {
  const commonRemedies = [
    'Save important contacts under auspicious names',
    'Make your first call of the day to someone positive',
    'Avoid using phone during inauspicious hours (Rahu Kaal)',
    'Keep your phone clean and in good condition',
    'Use a phone case in your lucky color',
    'Place a small Ganesha sticker on your phone'
  ]

  // Number-specific remedies
  const specificRemedies: { [key: number]: string[] } = {
    1: ['Set golden or orange wallpaper', 'Make important calls on Sundays', 'Keep phone in the east direction'],
    2: ['Set white or cream wallpaper', 'Make important calls on Mondays', 'Keep phone clean and pure'],
    3: ['Set yellow or purple wallpaper', 'Make important calls on Thursdays', 'Use phone for learning and teaching'],
    4: ['Chant mantras before important calls', 'Avoid making major decisions via phone', 'Use phone for practical purposes only'],
    5: ['Set green wallpaper', 'Make important calls on Wednesdays', 'Use phone for networking'],
    6: ['Set pink or blue wallpaper', 'Make important calls on Fridays', 'Use phone to spread love and positivity'],
    7: ['Set purple wallpaper', 'Meditate before important calls', 'Limit phone usage for spiritual balance'],
    8: ['Worship Lord Shani on Saturdays', 'Be disciplined with phone usage', 'Use dark blue phone case'],
    9: ['Set red wallpaper', 'Make important calls on Tuesdays', 'Use phone for helping others']
  }

  if (score < 70) {
    return [...commonRemedies, ...(specificRemedies[mobileNumber] || [])]
  }

  return specificRemedies[mobileNumber] || commonRemedies.slice(0, 3)
}

/**
 * Main function to analyze mobile number
 */
export interface MobileNumerologyResult {
  driverNumber: number
  driverTraits: NumberTraits
  mobileNumberDetails: {
    original: string
    digits: string
    sum: number
    coreNumber: number
    last4Digits: string
    last4Sum: number
    last4CoreNumber: number
    repeatingPatterns: string[]
  }
  mobileNumberTraits: NumberTraits
  last4Traits: NumberTraits
  compatibilityScore: number
  compatibilityLevel: {
    level: string
    color: string
    icon: string
  }
  analysis: string
  luckyNumbers: number[]
  remedies: string[]
  recommendations: string[]
  repeatingPatternsAnalysis: string[]
}

export function analyzeMobileNumber(
  birthDate: Date,
  mobileNumber: string
): MobileNumerologyResult {
  // Calculate driver number (birth date)
  const driverNumber = calculateDriverNumber(birthDate)
  const driverTraits = NUMBER_TRAITS[driverNumber]

  // Calculate mobile number
  const mobileNumberDetails = calculateMobileNumber(mobileNumber)
  const coreNumber = mobileNumberDetails.coreNumber
  const last4CoreNumber = mobileNumberDetails.last4CoreNumber
  const mobileNumberTraits = NUMBER_TRAITS[coreNumber]
  const last4Traits = NUMBER_TRAITS[last4CoreNumber]

  // Calculate compatibility
  const compatibilityScore = calculateCompatibility(coreNumber, driverNumber)
  const compatibilityLevel = getCompatibilityLevel(compatibilityScore)

  // Generate analysis
  const analysis = generateAnalysis(coreNumber, driverNumber, last4CoreNumber, compatibilityScore)

  // Get lucky numbers
  const luckyNumbers = suggestLuckyNumbers(driverNumber)

  // Get remedies
  const remedies = getRemedies(coreNumber, compatibilityScore)

  // Analyze repeating patterns
  const repeatingPatternsAnalysis: string[] = []
  if (mobileNumberDetails.repeatingPatterns.length > 0) {
    mobileNumberDetails.repeatingPatterns.forEach(pattern => {
      const digit = parseInt(pattern.charAt(0))
      const traits = NUMBER_TRAITS[digit]
      if (traits) {
        repeatingPatternsAnalysis.push(
          `Repeating ${pattern}: Amplifies ${traits.energy.toLowerCase()} - both positive and challenging aspects intensify.`
        )
      }
    })
  } else {
    repeatingPatternsAnalysis.push('No significant repeating patterns detected - this brings balanced energy.')
  }

  // Generate recommendations
  const recommendations: string[] = []

  if (compatibilityScore >= 85) {
    recommendations.push('This number is highly favorable for you. Keep using it with confidence!')
    recommendations.push(`Make important calls during ${driverTraits.day}s for extra luck`)
    recommendations.push(`Use ${driverTraits.color.toLowerCase()} phone accessories to enhance positive energy`)
  } else if (compatibilityScore >= 70) {
    recommendations.push('This is a good number for you. It will serve you well overall.')
    recommendations.push('Consider using remedies to further enhance the positive energy')
    recommendations.push(`Your last 4 digits (${last4CoreNumber}) are particularly important - they carry ${last4Traits.energy.toLowerCase()}`)
  } else if (compatibilityScore >= 55) {
    recommendations.push('This number is workable but not ideal. Regular remedies will help.')
    recommendations.push('Consider choosing a new number when possible')
    recommendations.push(`Look for numbers ending in: ${luckyNumbers.join(', ')} for better alignment`)
  } else {
    recommendations.push('Strongly recommend changing this number for better life outcomes')
    recommendations.push(`Your ideal numbers would end in: ${luckyNumbers.join(', ')}`)
    recommendations.push('If you must keep this number, follow the remedies religiously')
    recommendations.push('Avoid making major life decisions through calls on this number')
  }

  return {
    driverNumber,
    driverTraits,
    mobileNumberDetails,
    mobileNumberTraits,
    last4Traits,
    compatibilityScore,
    compatibilityLevel,
    analysis,
    luckyNumbers,
    remedies,
    recommendations,
    repeatingPatternsAnalysis
  }
}
