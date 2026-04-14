"use client";

import {FC} from "react";
import useUser from "@/hooks/useUser";
import Link from "next/link";
import NewRatingsStarsDisplay from "@/components/rating/NewRatingsStarsDisplay";

type GameRatingsProps = {
  ratings: {
    sum: number;
    count: number;
  }
}

const GameRatings: FC<GameRatingsProps> = ({ratings}) => {
  const user = useUser();

  return <div className='flex flex-col gap-2'>
    <h1 className='text-3xl'>Ratings</h1>
    {ratings.count === 0 && <div className='flex flex-col gap-4'>
      <p>No ratings yet.</p>
      {user === null && <p><Link href='/auth/login'>Sign in</Link> to rate this game.</p>}
      {user !== null && <button className='bg-blue-600 rounded-lg py-1 px-2'>Be the first to rate this game!</button>}
    </div>}
    {ratings.count > 0 && <div>
      <NewRatingsStarsDisplay sum={ratings.sum} count={ratings.count}/>
    </div>}
    {user === null && <p><Link href='/auth/login'>Sign in</Link> to rate this game.</p>}
    {user !== null && <button className='bg-blue-600 rounded-lg py-1 px-2'>Rate this game</button>}
  </div>;
}

export default GameRatings;
