/**
 * Shani Sade Sati Calculator
 *
 * Sade Sati is a 7.5-year period when Saturn transits through:
 * 1. 12th house from natal Moon (2.5 years) - Rising Phase
 * 2. Moon sign itself (2.5 years) - Peak Phase
 * 3. 2nd house from natal Moon (2.5 years) - Setting Phase
 */

import {
  getCurrentSaturnPosition,
  getSaturnPositionOnDate,
  getSignNumber,
  SATURN_TRANSITS,
  type SaturnTransit
} from './saturn-ephemeris'

export type SadeSatiPhase = 'rising' | 'peak' | 'setting' | 'not_active'

export interface SadeSatiResult {
  isActive: boolean
  phase: SadeSatiPhase | null
  phaseLabel: string
  currentSaturnSign: string
  currentSaturnSignNumber: number
  natalMoonSign: string
  natalMoonSignNumber: number
  housePosition: number // Which house Saturn is from Moon (1-12)

  // If active
  currentPhaseStart?: string
  currentPhaseEnd?: string
  sadeSatiStart?: string
  sadeSatiEnd?: string

  // If not active
  nextSadeSatiStart?: string
  nextSadeSatiEnd?: string
  yearsUntilStart?: number

  // Detailed information
  phaseDescription: string
  impactLevel: 'Low' | 'Moderate' | 'High'
  lifeAreas: string[]
  remedies: string[]
}

/**
 * Calculate house position of Saturn from natal Moon
 * @param moonSignNumber - Natal Moon sign number (1-12)
 * @param saturnSignNumber - Current Saturn sign number (1-12)
 * @returns House position (1-12)
 */
function calculateHousePosition(moonSignNumber: number, saturnSignNumber: number): number {
  let house = saturnSignNumber - moonSignNumber + 1
  if (house <= 0) house += 12
  return house
}

/**
 * Determine Sade Sati phase based on house position
 */
function getSadeSatiPhase(housePosition: number): { phase: SadeSatiPhase; label: string } {
  if (housePosition === 12) {
    return { phase: 'rising', label: 'Rising Phase (Ascending)' }
  } else if (housePosition === 1) {
    return { phase: 'peak', label: 'Peak Phase (Janma Shani)' }
  } else if (housePosition === 2) {
    return { phase: 'setting', label: 'Setting Phase (Descending)' }
  }
  return { phase: 'not_active', label: 'Not in Sade Sati' }
}

/**
 * Get phase-specific information
 */
function getPhaseInfo(phase: SadeSatiPhase): {
  description: string
  impactLevel: 'Low' | 'Moderate' | 'High'
  lifeAreas: string[]
} {
  switch (phase) {
    case 'rising':
      return {
        description: 'The Rising Phase (12th house from Moon) marks the beginning of Sade Sati. This period brings increased expenses, foreign travels, and spiritual inclinations. You may experience some losses or separations, but these prepare you for growth.',
        impactLevel: 'Moderate',
        lifeAreas: ['Expenses', 'Foreign Connections', 'Losses', 'Spiritual Growth', 'Isolation', 'Hidden Enemies']
      }
    case 'peak':
      return {
        description: 'The Peak Phase (Saturn over natal Moon) is the most intense period of Sade Sati. This brings major life transformations, responsibilities, and tests. Health, relationships, and career may face challenges, but this period builds resilience and wisdom.',
        impactLevel: 'High',
        lifeAreas: ['Health', 'Mental Peace', 'Relationships', 'Career Changes', 'Major Responsibilities', 'Life Direction']
      }
    case 'setting':
      return {
        description: 'The Setting Phase (2nd house from Moon) focuses on family, wealth, and speech. Financial pressures may continue, and family relationships require attention. As this phase ends, you emerge stronger and more mature.',
        impactLevel: 'Moderate',
        lifeAreas: ['Finances', 'Family Relations', 'Speech & Communication', 'Wealth Management', 'Food & Health']
      }
    default:
      return {
        description: 'You are currently not experiencing Sade Sati. This is a period of relative stability and growth.',
        impactLevel: 'Low',
        lifeAreas: []
      }
  }
}

/**
 * Get remedies for Sade Sati
 */
function getSadeSatiRemedies(): string[] {
  return [
    'Worship Lord Hanuman and recite Hanuman Chalisa daily',
    'Offer oil to Shani Dev on Saturdays',
    'Donate to the needy, especially on Saturdays',
    'Wear blue sapphire (Neelam) only after proper consultation',
    'Feed crows and dogs regularly',
    'Practice patience and avoid hasty decisions',
    'Maintain discipline and hard work',
    'Recite Shani mantras: "Om Sham Shanaishcharaya Namah"',
    'Light a mustard oil lamp under a Peepal tree on Saturdays',
    'Avoid alcohol and non-vegetarian food on Saturdays'
  ]
}

/**
 * Find when Sade Sati starts for a given Moon sign
 */
function findSadeSatiPeriod(moonSignNumber: number, referenceDate: Date = new Date()): {
  start: string | null
  end: string | null
  risingStart: string | null
  peakStart: string | null
  settingStart: string | null
  settingEnd: string | null
} {
  // Calculate the three signs involved in Sade Sati
  const sign12th = moonSignNumber === 1 ? 12 : moonSignNumber - 1  // 12th from Moon
  const sign1st = moonSignNumber  // Moon sign itself
  const sign2nd = moonSignNumber === 12 ? 1 : moonSignNumber + 1  // 2nd from Moon

  let risingStart: string | null = null
  let peakStart: string | null = null
  let settingStart: string | null = null
  let settingEnd: string | null = null

  const refDateStr = referenceDate.toISOString().split('T')[0]

  // Find the relevant transits
  for (let i = 0; i < SATURN_TRANSITS.length - 2; i++) {
    const transit = SATURN_TRANSITS[i]

    // Check if this is the 12th house transit (start of Sade Sati)
    if (transit.sign_number === sign12th && transit.entry_date >= refDateStr) {
      risingStart = transit.entry_date

      // Find peak phase (Moon sign)
      const peakTransit = SATURN_TRANSITS.find(t =>
        t.sign_number === sign1st && t.entry_date > transit.entry_date
      )
      if (peakTransit) {
        peakStart = peakTransit.entry_date

        // Find setting phase (2nd house)
        const settingTransit = SATURN_TRANSITS.find(t =>
          t.sign_number === sign2nd && t.entry_date > peakTransit.entry_date
        )
        if (settingTransit) {
          settingStart = settingTransit.entry_date
          settingEnd = settingTransit.exit_date

          return {
            start: risingStart,
            end: settingEnd,
            risingStart,
            peakStart,
            settingStart,
            settingEnd
          }
        }
      }
    }
  }

  return {
    start: null,
    end: null,
    risingStart: null,
    peakStart: null,
    settingStart: null,
    settingEnd: null
  }
}

/**
 * Calculate years between two dates
 */
function yearsBetween(date1Str: string, date2Str: string): number {
  const date1 = new Date(date1Str)
  const date2 = new Date(date2Str)
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25)
  return Math.round(diffYears * 10) / 10
}

/**
 * Main function to calculate Sade Sati status
 */
export function calculateSadeSati(
  natalMoonSign: string,
  checkDate: Date = new Date()
): SadeSatiResult {
  // Get current Saturn position
  const currentSaturn = getCurrentSaturnPosition(checkDate)

  if (!currentSaturn) {
    throw new Error('Unable to determine current Saturn position')
  }

  // Get sign numbers
  const moonSignNumber = getSignNumber(natalMoonSign)
  const saturnSignNumber = currentSaturn.sign_number

  if (!moonSignNumber) {
    throw new Error(`Invalid moon sign: ${natalMoonSign}`)
  }

  // Calculate house position
  const housePosition = calculateHousePosition(moonSignNumber, saturnSignNumber)

  // Determine phase
  const { phase, label } = getSadeSatiPhase(housePosition)
  const phaseInfo = getPhaseInfo(phase)
  const isActive = phase !== 'not_active'

  // Base result
  const result: SadeSatiResult = {
    isActive,
    phase: isActive ? phase : null,
    phaseLabel: label,
    currentSaturnSign: currentSaturn.sign,
    currentSaturnSignNumber: saturnSignNumber,
    natalMoonSign,
    natalMoonSignNumber: moonSignNumber,
    housePosition,
    phaseDescription: phaseInfo.description,
    impactLevel: phaseInfo.impactLevel,
    lifeAreas: phaseInfo.lifeAreas,
    remedies: getSadeSatiRemedies()
  }

  if (isActive) {
    // Find full Sade Sati period
    const sadeSatiPeriod = findSadeSatiPeriod(moonSignNumber, new Date('2000-01-01'))

    // Current phase dates
    result.currentPhaseStart = currentSaturn.entry_date
    result.currentPhaseEnd = currentSaturn.exit_date

    // Find Sade Sati start and end
    if (phase === 'rising') {
      result.sadeSatiStart = currentSaturn.entry_date
      result.sadeSatiEnd = sadeSatiPeriod.settingEnd || currentSaturn.exit_date
    } else if (phase === 'peak') {
      result.sadeSatiStart = sadeSatiPeriod.risingStart || currentSaturn.entry_date
      result.sadeSatiEnd = sadeSatiPeriod.settingEnd || currentSaturn.exit_date
    } else if (phase === 'setting') {
      result.sadeSatiStart = sadeSatiPeriod.risingStart || currentSaturn.entry_date
      result.sadeSatiEnd = currentSaturn.exit_date
    }
  } else {
    // Find next Sade Sati
    const nextSadeSati = findSadeSatiPeriod(moonSignNumber, checkDate)

    if (nextSadeSati.start && nextSadeSati.end) {
      result.nextSadeSatiStart = nextSadeSati.start
      result.nextSadeSatiEnd = nextSadeSati.end

      const today = checkDate.toISOString().split('T')[0]
      result.yearsUntilStart = yearsBetween(today, nextSadeSati.start)
    }
  }

  return result
}

/**
 * Get Sade Sati history and future predictions
 */
export function getSadeSatiTimeline(natalMoonSign: string): {
  past: { start: string; end: string }[]
  current: SadeSatiResult
  future: { start: string; end: string }[]
} {
  const moonSignNumber = getSignNumber(natalMoonSign)
  const current = calculateSadeSati(natalMoonSign)

  const past: { start: string; end: string }[] = []
  const future: { start: string; end: string }[] = []

  const today = new Date().toISOString().split('T')[0]

  // Find all Sade Sati periods for this Moon sign
  for (let i = 0; i < SATURN_TRANSITS.length - 2; i++) {
    const sign12th = moonSignNumber === 1 ? 12 : moonSignNumber - 1
    const sign2nd = moonSignNumber === 12 ? 1 : moonSignNumber + 1

    if (SATURN_TRANSITS[i].sign_number === sign12th) {
      const settingTransit = SATURN_TRANSITS.find((t, idx) =>
        idx > i + 1 && t.sign_number === sign2nd
      )

      if (settingTransit) {
        const period = {
          start: SATURN_TRANSITS[i].entry_date,
          end: settingTransit.exit_date
        }

        if (period.end < today) {
          past.push(period)
        } else if (period.start > today) {
          future.push(period)
        }
      }
    }
  }

  return { past, current, future }
}
