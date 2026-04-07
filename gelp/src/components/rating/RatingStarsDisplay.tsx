"use client";
import {FC} from "react";

type RatingStarsDisplayProps = {
  rating: number;
}

const RatingStarsDisplay: FC<RatingStarsDisplayProps> = ({rating}) => {
  return <div>
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
      <span
        key={star}
        style={{
          color: star <= rating ? 'gold' : 'gray'
        }}
      >
        *
      </span>
    ))}
  </div>
}

export default RatingStarsDisplay;
