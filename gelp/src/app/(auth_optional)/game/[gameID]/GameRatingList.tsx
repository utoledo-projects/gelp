"use client";
import {FC, useCallback, useMemo, useRef, useState} from "react";
import {IRating} from "@/db";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import RatingStarDisplay from "@/components/rating/RatingStarDisplay";
import useUser from "@/hooks/useUser";
import Link from "next/link";

type GameRatingListProps = {
  gameID: string;
  rating: IRating & { _id: string } | null;
}

const FETCH_LIMIT = 100;

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
type RatingWithUser = Overwrite<IRating & { _id: string }, {
  user: {
    _id: string;
    username: string;
    avatar?: string;
  };
}>

const GameRatingList: FC<GameRatingListProps> = ({gameID, rating}) => {
  const user = useUser();
  const [ratings, setRatings] = useState<RatingWithUser[] | null>(null);

  const skipRef = useRef(0);
  const moreRef = useRef(true);
  const loadingRef = useRef(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const updatedRatings = useMemo(() => {
    const updated = [...(ratings ?? [])];

    if (!user)
      return updated;
    if (!rating)
      return updated;

    const i = updated.findIndex((r) => r._id === rating._id);

    if (i === -1) {
      return [...updated, {
        ...rating,
        user: {
          _id: user._id,
          username: user.username,
          avatar: user.avatar
        }
      }];
    }

    updated[i] = {
      ...rating,
      user: updated[i].user
    }

    return updated;
  }, [ratings, rating, user]);

  const fetchRatings = useCallback(async () => {
    if (loadingRef.current || !moreRef.current)
      return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch(`/api/game/${gameID}/ratings?skip=${skipRef.current}&limit=${FETCH_LIMIT}`);
      if (!res.ok) throw new Error('Failed to fetch ratings.');

      const data = await res.json();

      if (data.ratings.length > 0) {
        setRatings((prev) => {
          const newRatings = data.ratings.filter((rating: RatingWithUser) => !(prev ?? []).some((existing) => existing._id === rating._id))
          return [...(prev ?? []), ...newRatings];
        })
      } else {
        setRatings((prev) => [...(prev ?? [])]);
      }

      if (data.ratings.length < FETCH_LIMIT)
        moreRef.current = false;
    } catch (err: any) {
      setError('message' in err ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [gameID]);

  useInfiniteScroll(
    wrapperRef,
    bottomRef,
    loadingRef,
    fetchRatings
  );

  if (loading)
    return <div className='max-w-7xl mx-auto p-2'>
      <h2 className='text-2xl'>All Ratings:</h2>
      <p>Loading...</p>
    </div>

  if (error)
    return <div className='max-w-7xl mx-auto p-2'>
      <h2 className='text-2xl'>All Ratings:</h2>
      <p className='text-red-500'>{error}</p>
    </div>

  if (ratings?.length === 0)
    return <div className='max-w-7xl mx-auto p-2'>
      <h2 className='text-2xl'>All Ratings:</h2>
      <p>No ratings yet.</p>
    </div>
  return <>
    <div className='max-w-7xl mx-auto p-2'>
      <h2 className='text-2xl'>All Ratings:</h2>
    </div>
    <div ref={wrapperRef} className='max-w-7xl mx-auto flex flex-wrap gap-4 p-2'>
      {updatedRatings.map((rating) => (
        <div key={rating._id} className='bg-zinc-900 p-3 rounded-xl flex flex-col gap-2 max-w-87.5'>
          <Link href={`/user/${rating.user._id}`} className='font-bold hover:underline'>{rating.user.username}</Link>
          <RatingStarDisplay sum={rating.score} count={1} singleRating/>
          {rating.review && <span>{rating.review}</span>}
        </div>
      ))}
      <div ref={bottomRef} className='min-w-1 min-h-1'/>
    </div>
  </>
}

export default GameRatingList;
