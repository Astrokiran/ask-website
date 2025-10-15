// file: types/guide.ts

export interface Guide {
  id: number;
  full_name: string;
  profile_picture_url: string;
  online: boolean;
  is_busy: boolean;
  skills: string[];
  languages: string[];
  years_of_experience: number;
  price_per_minute: string; // The API returns this as a string
  guide_stats: {
    rating: number;
    total_number_of_reviews: number;
  };
}