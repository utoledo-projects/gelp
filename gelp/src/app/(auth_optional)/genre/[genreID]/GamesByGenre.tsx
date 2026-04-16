"use client";

import {FC, useCallback, useRef, useState} from "react";
import {IGame} from "@/db";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import GameDisplay from "@/components/GameDisplay";

type GamesByGenreProps = {
  genre: string;
}

const FETCH_LIMIT = 100;

type GameWithRatings = IGame & {_id: string, ratingSum: number, ratingCount: number};

const GamesByGenre: FC<GamesByGenreProps> = ({genre}) => {
  const [games, setGames] = useState<GameWithRatings[] | null>(null);

  const skipRef = useRef(0);
  const moreRef = useRef(true);
  const loadingRef = useRef(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const fetchGames = useCallback(async () => {
    if (loadingRef.current || !moreRef.current)
      return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch(`/api/games/genre/${encodeURIComponent(genre)}?skip=${skipRef.current}&limit=${FETCH_LIMIT}`)
      if (!res.ok) throw new Error('Failed to fetch games.');

      const data = await res.json();

      if (data.games.length > 0) {
        setGames((prev) => {
          const newGames = data.games.filter((post: GameWithRatings) => !(prev ?? []).some((existing) => existing._id === post._id));

          return [...(prev ?? []), ...newGames];
        });
        skipRef.current += data.games.length;
      } else {
        setGames((prev) => [...(prev ?? [])]);
      }

      if (data.games.length < FETCH_LIMIT)
        moreRef.current = false;
    } catch (err: any) {
      setError('message' in err ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [genre]);

  useInfiniteScroll(
    wrapperRef,
    bottomRef,
    loadingRef,
    fetchGames
  );

  return <div ref={wrapperRef} className='flex flex-wrap gap-4'>
    {games !== null && games.map((game) => (
      <GameDisplay
        key={game._id}
        game={game}
        ratings={{
          sum: game.ratingSum,
          count: game.ratingCount
        }}
        genre={genre}
      />
    ))}
    {games !== null && games.length === 0 && <p>No games found.</p>}
    {error !== null && <p className='text-red-500'>{error}</p>}
    <div ref={bottomRef} className='min-h-1'>{loading ? 'Loading...' : null}</div>
  </div>
}

export default GamesByGenre;
