"use client";

import {FC, useEffect, useRef, useState} from "react";
import useUser from "@/hooks/useUser";
import Link from "next/link";
import RatingStarDisplay from "@/components/rating/RatingStarDisplay";
import RatingModal from "@/components/rating/RatingModal";
import {IGame, IRating} from "@/db";

type GameRatingsProps = {
  ratings: {
    sum: number;
    count: number;
  },
  game: IGame & { _id: string };
  setRating?: (rating: IRating & {_id: string} | null) => void;
}

const GameRatings: FC<GameRatingsProps> = ({ratings, game, setRating}) => {
  const [showModal, setShowModal] = useState(false);
  const loadingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [existing, setExisting] = useState<IRating & {_id: string} | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (setRating)
      setRating(existing);
  }, [existing]);

  useEffect(() => {
    if (loadingRef.current)
      return;

    loadingRef.current = true;
    setLoading(true);

    fetch(`/api/game/${game._id}/rating`, {
      method: 'GET'
    })
      .then(async (res) => {
        const json = await res.json();
        if (res.status === 200) {
          setExisting(json.rating);
          setError(null);
        } else {
          setExisting(null);
          setError(json.error ?? 'An unknown error occurred.');
        }
      })
      .catch((e) => {
        console.error(e);
        setError('An unknown error occurred.');
      })
      .finally(() => {
        loadingRef.current = false;
        setLoading(false);
      });
  }, [game]);

  const user = useUser();

  return <div className='flex flex-col gap-4'>
    <h1 className='text-3xl'>Ratings</h1>
    {error && <span className='text-red-500'>{error}</span>}
    {ratings.count === 0 && <>
      <p>No ratings yet.</p>
      {user === null && <p><Link href='/auth/login'>Sign in</Link> to rate this game.</p>}
      {user !== null &&
        <button disabled={loading} className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 rounded-lg py-1 px-2' onClick={() => setShowModal(true)}>Be the
          first to rate this game!</button>}
    </>}
    {ratings.count > 0 && <>
      <RatingStarDisplay sum={ratings.sum} count={ratings.count}/>
      {user === null && <p><Link href='/auth/login'>Sign in</Link> to rate this game.</p>}
      {user !== null && !existing &&
        <button disabled={loading} className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 rounded-lg py-1 px-2' onClick={() => setShowModal(true)}>
          Rate this game
        </button>
      }
      {user !== null && existing && <>
        <button disabled={loading} className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 rounded-lg py-1 px-2' onClick={() => setShowModal(true)}>
          Edit your rating
        </button>
        <div className='flex flex-col gap-2'>
          <span className='text-xl'>Your Rating:</span>
          <div className='flex items-center'>
            <RatingStarDisplay sum={existing.score} count={1} singleRating/>
            <span className='text-zinc-500 ml-2'>({existing.score})</span>
          </div>
          {existing.review && <span>{existing.review}</span>}
          {!existing.review && <span className='text-zinc-500'>No review body.</span>}
        </div>
      </>}
    </>}
    {showModal && <RatingModal game={game} close={() => setShowModal(false)} edit={existing} set={(rating) => setExisting(rating)}/>}
  </div>;
}

export default GameRatings;
