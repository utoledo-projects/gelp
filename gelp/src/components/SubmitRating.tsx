"use client";

import { useState } from "react";
import RatingStars from "./RatingStars";

export default function SubmitRating() {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const submitRating = async () => {
    setLoading(true);

    await fetch("/api/ratings", {
      method: "POST",
      body: JSON.stringify({ rating }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setLoading(false);
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-semibold mb-4">Rate this Game</h2>

      <RatingStars onChange={setRating} />

      <p className="mt-2 text-gray-700">Your rating: {rating}</p>

      <button
        onClick={submitRating}
        disabled={rating === 0 || loading}
        className={`mt-4 px-5 py-2 rounded-md text-white transition
          ${rating === 0 || loading 
            ? "bg-gray-400 cursor-not-allowed opacity-80" 
            : "bg-blue-500 hover:bg-blue-700"}
        `}
      >
        {loading ? "Submitting..." : "Submit Rating"}
      </button>
    </div>
  );
}