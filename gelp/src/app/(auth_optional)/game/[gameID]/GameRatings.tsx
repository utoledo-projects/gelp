"use client";

import {FC} from "react";
import RatingStarsDisplay from "@/components/rating/RatingStarsDisplay";
import useUser from "@/hooks/useUser";
import Link from "next/link";

type GameRatingsProps = {
  ratings: {
    ratings: number;
    count: number;
  }
}

const GameRatings: FC<GameRatingsProps> = ({ratings}) => {
  const user = useUser();

  return <div>
    <h1 className='text-3xl'>Ratings</h1>
    <br/>
    {ratings.count === 0 && <div className='flex flex-col gap-4'>
      <p>No ratings yet.</p>
      {user === null && <p><Link href='/auth/login'>Sign in</Link> to rate this game.</p>}
      {user !== null && <button className='bg-blue-600 rounded-lg py-1 px-2'>Be the first to rate this game!</button>}
    </div>}
    {ratings.count > 0 && <p>
      <RatingStarsDisplay rating={ratings.ratings / ratings.count}/>
      {user === null && <p><Link href='/auth/login'>Sign in</Link> to rate this game.</p>}
      {user !== null && <button className='bg-blue-600 rounded-lg py-1 px-2'>Rate this game</button>}
    </p>}
  </div>;
}

export default GameRatings;
