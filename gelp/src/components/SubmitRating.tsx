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
    <div style={{ padding: "40px" }}>
      <h2>Rate this Game</h2>

      <RatingStars onChange={setRating} />

      <p>Your rating: {rating}</p>

      <button
        onClick={submitRating}
        disabled={rating === 0 || loading}
        style={{
          backgroundColor: rating === 0 ? "#ccc" : "#0070f3",
          color: "white",
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          cursor: rating === 0 ? "not-allowed" : "pointer",
          opacity: loading ? 0.8 : 1,
        }}
      >
        {loading ? "Submitting..." : "Submit Rating"}
      </button>
    </div>
  );
}