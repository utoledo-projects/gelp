"use client";

import {FC, useState} from "react";
import RatingStars from "../components/RatingStars";
import SubmitRating from "@/components/SubmitRating";

type RatingModalProps = {
  gameId: string;
  close: () => void;
};

export const RatingModal: FC<RatingModalProps> = ({gameId, close}) => {
  const [rating, setRating] = useState(0);

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-black/80">
      <div className='w-full h-full flex items-center justify-center'>
        <div className="bg-zinc-900 p-6 rounded-lg w-96 flex flex-col gap-2">

          <h2 className="text-lg font-bold">Rate this Game</h2>

          <RatingStars onChange={setRating}/>

          <p>Selected Rating: {rating}</p>

          <SubmitRating rating={rating} gameId={gameId}/>

          <button onClick={close} className="text-red-500">
            Close
          </button>

        </div>
      </div>
    </div>
  );
}

export default RatingModal;