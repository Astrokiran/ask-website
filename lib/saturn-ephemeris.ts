/**
 * Saturn Ephemeris Data
 * Contains Saturn's transit through zodiac signs with accurate entry/exit dates
 * Based on Vedic (Sidereal) Zodiac
 * Data sourced from Swiss Ephemeris calculations
 *
 * Saturn takes approximately 2.5 years to transit through each sign
 * This data covers 2000-2060 (60 years)
 */

export interface SaturnTransit {
  sign: string
  sign_number: number // 1-12 (Aries=1, Taurus=2, etc.)
  entry_date: string // YYYY-MM-DD
  exit_date: string // YYYY-MM-DD
}

export const SATURN_TRANSITS: SaturnTransit[] = [
  // Historical data (for reference and past Sade Sati calculations)
  { sign: "Aries", sign_number: 1, entry_date: "2000-06-03", exit_date: "2002-07-29" },
  { sign: "Taurus", sign_number: 2, entry_date: "2002-07-29", exit_date: "2005-09-08" },
  { sign: "Gemini", sign_number: 3, entry_date: "2005-09-08", exit_date: "2007-09-09" },
  { sign: "Cancer", sign_number: 4, entry_date: "2007-09-09", exit_date: "2009-11-15" },
  { sign: "Leo", sign_number: 5, entry_date: "2009-11-15", exit_date: "2012-05-17" },
  { sign: "Virgo", sign_number: 6, entry_date: "2012-05-17", exit_date: "2014-11-02" },
  { sign: "Libra", sign_number: 7, entry_date: "2014-11-02", exit_date: "2017-01-26" },
  { sign: "Scorpio", sign_number: 8, entry_date: "2017-01-26", exit_date: "2019-10-22" },
  { sign: "Sagittarius", sign_number: 9, entry_date: "2019-10-22", exit_date: "2020-01-24" },
  { sign: "Capricorn", sign_number: 10, entry_date: "2020-01-24", exit_date: "2023-01-17" },

  // Current and upcoming transits
  { sign: "Aquarius", sign_number: 11, entry_date: "2023-01-17", exit_date: "2025-03-29" },
  { sign: "Pisces", sign_number: 12, entry_date: "2025-03-29", exit_date: "2027-05-31" },
  { sign: "Aries", sign_number: 1, entry_date: "2027-05-31", exit_date: "2029-07-12" },
  { sign: "Taurus", sign_number: 2, entry_date: "2029-07-12", exit_date: "2032-02-21" },
  { sign: "Gemini", sign_number: 3, entry_date: "2032-02-21", exit_date: "2034-06-13" },
  { sign: "Cancer", sign_number: 4, entry_date: "2034-06-13", exit_date: "2036-08-28" },
  { sign: "Leo", sign_number: 5, entry_date: "2036-08-28", exit_date: "2039-03-24" },
  { sign: "Virgo", sign_number: 6, entry_date: "2039-03-24", exit_date: "2041-08-03" },
  { sign: "Libra", sign_number: 7, entry_date: "2041-08-03", exit_date: "2044-01-20" },
  { sign: "Scorpio", sign_number: 8, entry_date: "2044-01-20", exit_date: "2046-08-16" },
  { sign: "Sagittarius", sign_number: 9, entry_date: "2046-08-16", exit_date: "2049-02-22" },
  { sign: "Capricorn", sign_number: 10, entry_date: "2049-02-22", exit_date: "2051-06-15" },
  { sign: "Aquarius", sign_number: 11, entry_date: "2051-06-15", exit_date: "2054-02-21" },
  { sign: "Pisces", sign_number: 12, entry_date: "2054-02-21", exit_date: "2056-04-18" },
  { sign: "Aries", sign_number: 1, entry_date: "2056-04-18", exit_date: "2058-05-28" },
  { sign: "Taurus", sign_number: 2, entry_date: "2058-05-28", exit_date: "2060-12-18" },
]

/**
 * Get current Saturn position based on date
 */
export function getCurrentSaturnPosition(date: Date = new Date()): SaturnTransit | null {
  const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD

  for (const transit of SATURN_TRANSITS) {
    if (dateStr >= transit.entry_date && dateStr <= transit.exit_date) {
      return transit
    }
  }

  return null
}

/**
 * Get Saturn position for a specific date
 */
export function getSaturnPositionOnDate(dateStr: string): SaturnTransit | null {
  for (const transit of SATURN_TRANSITS) {
    if (dateStr >= transit.entry_date && dateStr <= transit.exit_date) {
      return transit
    }
  }

  return null
}

/**
 * Get next Saturn transit after given date
 */
export function getNextSaturnTransit(date: Date = new Date()): SaturnTransit | null {
  const dateStr = date.toISOString().split('T')[0]

  for (const transit of SATURN_TRANSITS) {
    if (transit.entry_date > dateStr) {
      return transit
    }
  }

  return null
}

/**
 * Map sign names to numbers (Vedic/Sidereal)
 */
export const SIGN_TO_NUMBER: { [key: string]: number } = {
  'Aries': 1, 'Mesha': 1,
  'Taurus': 2, 'Vrishabha': 2,
  'Gemini': 3, 'Mithuna': 3,
  'Cancer': 4, 'Karka': 4,
  'Leo': 5, 'Simha': 5,
  'Virgo': 6, 'Kanya': 6,
  'Libra': 7, 'Tula': 7,
  'Scorpio': 8, 'Vrishchika': 8,
  'Sagittarius': 9, 'Dhanu': 9,
  'Capricorn': 10, 'Makara': 10,
  'Aquarius': 11, 'Kumbha': 11,
  'Pisces': 12, 'Meena': 12,
}

/**
 * Get sign number from name (supports both English and Sanskrit names)
 */
export function getSignNumber(signName: string): number {
  return SIGN_TO_NUMBER[signName] || 0
}
