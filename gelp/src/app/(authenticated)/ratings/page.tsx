"use client";

import { useState } from "react";
import RatingStars from "@/components/RatingStars";

export default function RatingsPage() {
  const [rating, setRating] = useState(0);

  const submitRating = async () => {
    const res = await fetch("/api/ratings", {
      method: "POST",
      body: JSON.stringify({ rating }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Rate this Game</h1>

      <RatingStars onChange={setRating} />

      <p>Your rating: {rating}</p>

      <button onClick={submitRating}>Submit Rating</button>
    </div>
  );
}