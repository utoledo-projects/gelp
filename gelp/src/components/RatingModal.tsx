"use client";

import { useState } from "react";
import RatingStars from "../components/RatingStars";
import SubmitRating from "@/components/SubmitRating";

type Props = {
  gameId: string;
  onClose: () => void;
};

export default function RatingModal({ gameId, onClose }: Props) {
  const [rating, setRating] = useState(0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">

        <h2 className="text-lg font-bold mb-4">Rate this Game</h2>

        <RatingStars onChange={setRating} />

        <p className="mt-2">Selected Rating: {rating}</p>

        <SubmitRating rating={rating} gameId={gameId} />

        <button onClick={onClose} className="mt-4 text-red-500">
          Close
        </button>

      </div>
    </div>
  );
}