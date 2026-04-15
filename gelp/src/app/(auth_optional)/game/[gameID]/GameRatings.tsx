"use client";

import {FC, useState} from "react";
import useUser from "@/hooks/useUser";
import Link from "next/link";
import NewRatingsStarsDisplay from "@/components/rating/NewRatingsStarsDisplay";
import RatingModal from "@/components/RatingModal";

type GameRatingsProps = {
  ratings: {
    sum: number;
    count: number;
  },
  gameID: string
}

const GameRatings: FC<GameRatingsProps> = ({ratings, gameID}) => {
  const [showModal, setShowModal] = useState(false);

  const user = useUser();

  return <div className='flex flex-col gap-2'>
    <h1 className='text-3xl'>Ratings</h1>
    {ratings.count === 0 && <div className='flex flex-col gap-4'>
      <p>No ratings yet.</p>
      {user === null && <p><Link href='/auth/login'>Sign in</Link> to rate this game.</p>}
      {user !== null && <button className='bg-blue-600 hover:bg-blue-700 rounded-lg py-1 px-2' onClick={() => setShowModal(true)}>Be the first to rate this game!</button>}
    </div>}
    {ratings.count > 0 && <div>
      <NewRatingsStarsDisplay sum={ratings.sum} count={ratings.count}/>
      {user === null && <p><Link href='/auth/login'>Sign in</Link> to rate this game.</p>}
      {user !== null && <button className='bg-blue-600 hover:bg-blue-700 rounded-lg py-1 px-2' onClick={() => setShowModal(true)}>Rate this game</button>}
    </div>}
    {showModal && <RatingModal gameId={gameID} close={() => setShowModal(false)}/>}
  </div>;
}

export default GameRatings;
