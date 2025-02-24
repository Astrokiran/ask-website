import React from 'react';
import { StarIcon } from "lucide-react";

type StarRatingProps = {
    rating: number; // 0 - 100
  };
  
  export function StarRating({ rating }: StarRatingProps) {
    // Round rating to a value between 0 and 5
    const filledStars = Math.round(rating / 20); // 100 => 5 stars, 0 => 0 stars
  
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            stroke='none'
            strokeWidth={0}
            // If the index is less than the filledStars, color it orange; otherwise light gray
            fill={i < filledStars ? '#FFA500' : '#E5E7EB'}
            width={24}
            height={24}
            // Optionally, you can style via Tailwind or inline styles
            // className="w-6 h-6"
          />
        ))}
      </div>
    );
  }