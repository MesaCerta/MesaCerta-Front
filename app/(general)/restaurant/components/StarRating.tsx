import React from 'react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, size = 16 }) => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          size={size}
          color={index < Math.floor(rating) ? "#f8b400" : "#ddd"}
        />
      ))}
    </>
  );
};