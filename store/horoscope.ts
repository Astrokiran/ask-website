import { create } from 'zustand'
import { Horoscope } from '@/types/horoscope'

interface HoroscopeState {
  horoscopes: Horoscope[]
  loading: boolean
  error: string | null
  fetchHoroscopes: () => Promise<void>
  getHoroscopeByZodiac: (zodiac: string) => Horoscope | undefined
}

export const useHoroscopeStore = create<HoroscopeState>((set, get) => ({
  horoscopes: [],
  loading: false,
  error: null,
  fetchHoroscopes: async () => {
    try {
      set({ loading: true, error: null })
      const response = await fetch(`/api/daily-horoscopes`)
      if (!response.ok) {
        throw new Error('Failed to fetch horoscopes')
      }
      const data = await response.json()
      set({ horoscopes: data.horoscopes, loading: false });
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
