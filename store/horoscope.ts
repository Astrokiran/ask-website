import { create } from 'zustand'
import { Horoscope } from '@/types/horoscope'

interface HoroscopeState {
  horoscopes: Horoscope[]
  loading: boolean
  error: string | null
  lastFetchDate: string | null
  fetchHoroscopes: () => Promise<void>
  getHoroscopeByZodiac: (zodiac: string) => Horoscope | undefined
}

interface SubCategoryPrediction {
  score: string,
  split_response: string
}
interface RawHoroscope {
  zodiac: string
  prediction: string
  date: string
  timestamp: string
  physique: SubCategoryPrediction,
  status: SubCategoryPrediction,
  finances: SubCategoryPrediction,
  relationship: SubCategoryPrediction,
  career: SubCategoryPrediction,
  travel: SubCategoryPrediction,
  family: SubCategoryPrediction,
  friends: SubCategoryPrediction,
  health: SubCategoryPrediction,
  total_score: SubCategoryPrediction
}
const subCategories = [
  'physique',
  'status',
  'finances',
  'relationship',
  'career',
  'travel',
  'family',
  'friends',
  'health',
  'total_score'
]

export const useHoroscopeStore = create<HoroscopeState>((set, get) => ({
  horoscopes: [],
  loading: false,
  error: null,
  lastFetchDate: null,
  fetchHoroscopes: async () => {
    try {
      const { lastFetchDate } = get();
      const today = new Date().toISOString().split('T')[0];
      
      // If we already have horoscopes for today, don't fetch again
      if (lastFetchDate === today && get().horoscopes.length > 0) {
        return;
      }

      set({ loading: true, error: null })
      const response = await fetch(`/api/daily-horoscopes`)
      if (!response.ok) {
        throw new Error('Failed to fetch horoscopes')
      }
      const data = await response.json()

      const horoscopes:Horoscope[] = []
      for (const rawHoroscope of data.horoscopes) {
        const horoscope:Horoscope = {
          zodiac: rawHoroscope.zodiac,
          prediction: rawHoroscope.prediction,
          date: rawHoroscope.date,
          timestamp: rawHoroscope.timestamp,
          luckyNumber: rawHoroscope.lucky_number,
          luckyColor: rawHoroscope.lucky_color,
          subCategories: []
        }
        for (const subCategory of subCategories) {
          const subCategoryPrediction = {
            name: subCategory,
            prediction: rawHoroscope[subCategory].split_response,
            score: rawHoroscope[subCategory].score
          }
          horoscope.subCategories.push(subCategoryPrediction)
        }
        horoscopes.push(horoscope)
      }

      set({ 
        horoscopes: horoscopes, 
        loading: false,
        lastFetchDate: today 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        loading: false 
      })
    }
  },
  getHoroscopeByZodiac: (zodiac: string) => {
    const { horoscopes } = get()
    return horoscopes.find(h => h.zodiac.toLowerCase() === zodiac.toLowerCase())
  }
}))
