"use client";

import { useState } from "react";
import RatingStarsInput from "./RatingStarsInput";

export default function SubmitRating() {
  const [rating, setRating] = useState(0);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Rate this Game</h2>

      <RatingStarsInput onChange={setRating} />

      <button disabled={rating === 0}>
        Submit Rating
      </button>
    </div>
  );
}
