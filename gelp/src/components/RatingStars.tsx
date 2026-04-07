"use client";

import { useState } from "react";

type Props = {
  onChange?: (rating: number) => void;
};

export default function RatingStars({ onChange }: Props) {
  const [rating, setRating] = useState(0);

  const handleClick = (value: number) => {
    setRating(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div>
      {[...Array(10)].map((_, i) => {
        const starValue = i + 1;

        return (
          <span
            key={starValue}
            onClick={() => handleClick(starValue)}
            style={{
              cursor: "pointer",
              color: starValue <= rating ? "gold" : "gray",
              fontSize: "24px",
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}