"use client";

import { useState } from "react";
import RatingStars from "./RatingStars";

export default function SubmitRating() {
  const [rating, setRating] = useState(0);

  return (
    <div>
      <RatingStars onChange={setRating} />

      <button disabled={rating === 0}>
        Submit Rating
      </button>
    </div>
  );
}