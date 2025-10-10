/**
 * Vehicle Number Numerology Calculator
 * Analyzes compatibility between vehicle numbers and personal numerology
 */

// Reduce number to single digit (keeping master numbers)
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
 * Calculate Life Path Number from birth date
 */
export function calculateLifePathNumber(birthDate: Date): number {
  const day = birthDate.getDate()
  const month = birthDate.getMonth() + 1
  const year = birthDate.getFullYear()

  // Add all digits
  const total = day + month + year
  return reduceToSingleDigit(total, true)
}

/**
 * Extract and calculate vehicle number
 * Supports formats like: 1234, MH-12-AB-1234, KA01AB1234, etc.
 */
export function calculateVehicleNumber(vehicleNumber: string): {
  original: string
  digits: string
  sum: number
  reducedNumber: number
} {
  // Extract only digits from vehicle number
  const digits = vehicleNumber.replace(/[^0-9]/g, '')

  if (digits.length === 0) {
    throw new Error('No digits found in vehicle number')
  }

  // Sum all digits
  const sum = digits.split('').reduce((total, digit) => total + parseInt(digit), 0)

  // Reduce to single digit
  const reducedNumber = reduceToSingleDigit(sum, false)

  return {
    original: vehicleNumber,
    digits,
    sum,
    reducedNumber
  }
}

/**
 * Vehicle Number Compatibility Data
 */
interface NumberTraits {
  planet: string
  energy: string
  traits: string[]
  bestFor: string[]
  compatible: number[]
  incompatible: number[]
}

const NUMBER_TRAITS: { [key: number]: NumberTraits } = {
  1: {
    planet: 'Sun',
    energy: 'Leadership, Independence, Ambition',
    traits: ['Strong', 'Dynamic', 'Pioneering', 'Confident'],
    bestFor: ['Business vehicles', 'Luxury cars', 'Bold personalities'],
    compatible: [1, 3, 5, 9],
    incompatible: [2, 4, 6, 8]
  },
  2: {
    planet: 'Moon',
    energy: 'Harmony, Balance, Partnership',
    traits: ['Peaceful', 'Diplomatic', 'Cooperative', 'Gentle'],
    bestFor: ['Family vehicles', 'Shared cars', 'Calm journeys'],
    compatible: [2, 4, 6, 7],
    incompatible: [1, 5, 9]
  },
  3: {
    planet: 'Jupiter',
    energy: 'Growth, Expansion, Optimism',
    traits: ['Lucky', 'Creative', 'Social', 'Positive'],
    bestFor: ['Travel vehicles', 'Social use', 'Long journeys'],
    compatible: [1, 3, 5, 6, 9],
    incompatible: [4, 8]
  },
  4: {
    planet: 'Rahu',
    energy: 'Stability, Hard Work, Structure',
    traits: ['Practical', 'Reliable', 'Disciplined', 'Grounded'],
    bestFor: ['Commercial vehicles', 'Daily commute', 'Work vehicles'],
    compatible: [2, 4, 6, 7, 8],
    incompatible: [1, 3, 5, 9]
  },
  5: {
    planet: 'Mercury',
    energy: 'Communication, Change, Freedom',
    traits: ['Versatile', 'Dynamic', 'Adventurous', 'Quick'],
    bestFor: ['Sports cars', 'Frequent travelers', 'Young drivers'],
    compatible: [1, 3, 5, 6, 9],
    incompatible: [2, 4]
  },
  6: {
    planet: 'Venus',
    energy: 'Luxury, Comfort, Beauty',
    traits: ['Harmonious', 'Balanced', 'Comfortable', 'Aesthetic'],
    bestFor: ['Luxury vehicles', 'Family cars', 'Comfortable rides'],
    compatible: [2, 3, 4, 5, 6, 8, 9],
    incompatible: [1]
  },
  7: {
    planet: 'Ketu',
    energy: 'Spirituality, Introspection, Mystery',
    traits: ['Reflective', 'Intuitive', 'Mystical', 'Analytical'],
    bestFor: ['Personal vehicles', 'Meditation journeys', 'Solitary drives'],
    compatible: [2, 4, 7],
    incompatible: [1, 5, 9]
  },
  8: {
    planet: 'Saturn',
    energy: 'Discipline, Karma, Responsibility',
    traits: ['Powerful', 'Authoritative', 'Karmic', 'Material'],
    bestFor: ['Business vehicles', 'Heavy vehicles', 'Authority figures'],
    compatible: [4, 6, 8],
    incompatible: [1, 2, 3, 5, 9]
  },
  9: {
    planet: 'Mars',
    energy: 'Passion, Energy, Courage',
    traits: ['Energetic', 'Bold', 'Courageous', 'Protective'],
    bestFor: ['Sports vehicles', 'Active lifestyles', 'Protection'],
    compatible: [1, 3, 5, 6, 9],
    incompatible: [2, 4, 7, 8]
  }
}

/**
 * Calculate compatibility percentage
 */
function calculateCompatibilityScore(lifePathNumber: number, vehicleNumber: number): number {
  const traits = NUMBER_TRAITS[lifePathNumber]

  if (!traits) return 50 // Default if life path number not found

  // Check if highly compatible
  if (traits.compatible.includes(vehicleNumber)) {
    return lifePathNumber === vehicleNumber ? 95 : 85 // Same number = highest compatibility
  }

  // Check if incompatible
  if (traits.incompatible.includes(vehicleNumber)) {
    return 35
  }

  // Neutral
  return 60
}

/**
 * Get compatibility level text
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
  lifePathNumber: number,
  vehicleNumber: number,
  score: number
): string {
  const lpTraits = NUMBER_TRAITS[lifePathNumber]
  const vnTraits = NUMBER_TRAITS[vehicleNumber]

  if (!lpTraits || !vnTraits) {
    return 'Unable to generate detailed analysis.'
  }

  if (score >= 85) {
    return `Excellent compatibility! Your life path number ${lifePathNumber} (${lpTraits.planet}) and vehicle number ${vehicleNumber} (${vnTraits.planet}) create a harmonious energy flow. This combination supports your natural tendencies and brings positive vibrations to your journeys. The ${vnTraits.energy.toLowerCase()} energy of number ${vehicleNumber} aligns perfectly with your ${lpTraits.energy.toLowerCase()} nature.`
  } else if (score >= 70) {
    return `Good compatibility! The vehicle number ${vehicleNumber} resonates well with your life path number ${lifePathNumber}. While not a perfect match, this combination brings ${vnTraits.traits[0].toLowerCase()} and ${vnTraits.traits[1].toLowerCase()} energies that complement your personality. You should experience smooth travels and positive outcomes.`
  } else if (score >= 55) {
    return `Fair compatibility. The vehicle number ${vehicleNumber} has a neutral relationship with your life path number ${lifePathNumber}. This combination won't cause major issues but may not provide the enhanced positive energy that a more compatible number would offer. Consider it workable but not optimal.`
  } else if (score >= 40) {
    return `Below average compatibility. The energies of your life path number ${lifePathNumber} (${lpTraits.planet}) and vehicle number ${vehicleNumber} (${vnTraits.planet}) don't align naturally. While not severely problematic, you might experience occasional friction, delays, or feel less connected to your vehicle. Consider remedies or alternative numbers.`
  } else {
    return `Not recommended. There's a significant energy clash between your life path number ${lifePathNumber} and vehicle number ${vehicleNumber}. The ${vnTraits.energy.toLowerCase()} of number ${vehicleNumber} conflicts with your ${lpTraits.energy.toLowerCase()} nature. This mismatch could lead to increased maintenance issues, travel disruptions, or general discomfort. Strongly consider choosing a different number.`
  }
}

/**
 * Suggest alternative lucky numbers
 */
function suggestLuckyNumbers(lifePathNumber: number): number[] {
  const traits = NUMBER_TRAITS[lifePathNumber]
  if (!traits) return [1, 3, 5, 6, 9] // Default lucky numbers

  return traits.compatible
}

/**
 * Get remedies for incompatible numbers
 */
function getRemedies(vehicleNumber: number): string[] {
  const vnTraits = NUMBER_TRAITS[vehicleNumber]

  const commonRemedies = [
    'Place a small Ganesha idol or sticker in your vehicle',
    'Hang a protective evil eye charm or Nazar Battu',
    'Keep the vehicle clean and well-maintained',
    'Perform a small puja before the first drive',
    'Donate to charity on the day of vehicle registration',
    'Chant "Om Gan Ganapataye Namah" before starting journeys'
  ]

  // Add number-specific remedies
  const specificRemedies: { [key: number]: string[] } = {
    1: ['Place a Sun yantra in the vehicle', 'Use golden or red color accessories'],
    2: ['Keep a small moonstone or pearl', 'Use white or cream colored seat covers'],
    3: ['Place a Jupiter yantra', 'Use yellow colored items'],
    4: ['Worship Lord Ganesha regularly', 'Avoid dark colors inside vehicle'],
    5: ['Keep a green aventurine crystal', 'Use green or multi-colored accessories'],
    6: ['Place fresh flowers regularly', 'Use fragrant air fresheners'],
    7: ['Keep a rudraksha in the vehicle', 'Practice mindful driving'],
    8: ['Worship Lord Shani on Saturdays', 'Use blue or black accessories minimally'],
    9: ['Keep a red cloth or red Hanuman image', 'Use red colored items sparingly']
  }

  return [...commonRemedies, ...(specificRemedies[vehicleNumber] || [])]
}

/**
 * Main function to analyze vehicle number compatibility
 */
export interface VehicleNumerologyResult {
  lifePathNumber: number
  lifePathTraits: NumberTraits
  vehicleNumberDetails: {
    original: string
    digits: string
    sum: number
    reducedNumber: number
  }
  vehicleNumberTraits: NumberTraits
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
}

export function analyzeVehicleNumber(
  birthDate: Date,
  vehicleNumber: string
): VehicleNumerologyResult {
  // Calculate life path number
  const lifePathNumber = calculateLifePathNumber(birthDate)
  const lifePathTraits = NUMBER_TRAITS[lifePathNumber]

  // Calculate vehicle number
  const vehicleNumberDetails = calculateVehicleNumber(vehicleNumber)
  const reducedVehicleNumber = vehicleNumberDetails.reducedNumber
  const vehicleNumberTraits = NUMBER_TRAITS[reducedVehicleNumber]

  // Calculate compatibility
  const compatibilityScore = calculateCompatibilityScore(lifePathNumber, reducedVehicleNumber)
  const compatibilityLevel = getCompatibilityLevel(compatibilityScore)

  // Generate analysis
  const analysis = generateAnalysis(lifePathNumber, reducedVehicleNumber, compatibilityScore)

  // Get lucky numbers
  const luckyNumbers = suggestLuckyNumbers(lifePathNumber)

  // Get remedies
  const remedies = getRemedies(reducedVehicleNumber)

  // Generate recommendations
  const recommendations: string[] = []

  if (compatibilityScore >= 85) {
    recommendations.push('This number is highly favorable for you. Go ahead with confidence!')
    recommendations.push('Register your vehicle on a day that matches your life path number for extra luck')
  } else if (compatibilityScore >= 70) {
    recommendations.push('This is a good number for you. It will serve you well.')
    recommendations.push('Consider adding lucky charms to enhance the positive energy')
  } else if (compatibilityScore >= 55) {
    recommendations.push('This number is workable but not ideal. Consider remedies to improve energy.')
    recommendations.push('You may want to explore other number options if possible')
  } else {
    recommendations.push('Strongly consider choosing a different vehicle number for better compatibility')
    recommendations.push(`Look for numbers ending in: ${luckyNumbers.join(', ')}`)
    recommendations.push('If you must keep this number, follow the remedies regularly')
  }

  return {
    lifePathNumber,
    lifePathTraits,
    vehicleNumberDetails,
    vehicleNumberTraits,
    compatibilityScore,
    compatibilityLevel,
    analysis,
    luckyNumbers,
    remedies,
    recommendations
  }
}
