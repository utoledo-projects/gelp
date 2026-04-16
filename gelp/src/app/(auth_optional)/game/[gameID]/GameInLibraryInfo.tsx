"use client";

import {FC, useEffect, useState} from "react";
import useUser from "@/hooks/useUser";
import Link from "next/link";

interface GameInLibraryInfoProps {
  gameID: string;
}

const GameInLibraryInfo: FC<GameInLibraryInfoProps> = ({gameID}) => {
  const user = useUser();
  const [isInLibrary, setIsInLibrary] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsInLibrary(null);
      return;
    }

    const checkLibraryStatus = async () => {
      try {
        const res = await fetch(`/api/library/game/${gameID}`);
        if (!res.ok) throw new Error("Failed to fetch library status");
        const data = await res.json();

        setIsInLibrary(data.isInLibrary);
      } catch (err) {
        console.error("Error checking library status:", err);
        setIsInLibrary(false);
      }
    };

    checkLibraryStatus();
  }, [user, gameID]);

  const addToLibrary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameID })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add to library');
      }

      setIsInLibrary(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to library');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromLibrary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/library', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameID })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to remove from library');
      }

      setIsInLibrary(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from library');
    } finally {
      setIsLoading(false);
    }
  };

  return <div className='flex flex-col gap-4'>
    <h1 className='text-3xl'>Library</h1>
    {user === null && <>
      <p><Link href='/auth/login' className='underline'>Sign in</Link> to add this game to your library.</p>
    </>}
    {user !== null && <>
      {isInLibrary === null && <p>Loading library status...</p>}
      {isInLibrary === false && <p>This game is not in your library</p>}
      {isInLibrary === true && <p>This game is in your library</p>}
      {error && <p className='text-red-500'>{error}</p>}
      {isInLibrary === false && (
        <button
          className='bg-blue-600 rounded-lg py-1 px-2 disabled:opacity-50 cursor-pointer disabled:cursor-default'
          onClick={addToLibrary}
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add it now!'}
        </button>
      )}
      {isInLibrary === true && (
        <button
          className='bg-red-600 rounded-lg py-1 px-2 disabled:opacity-50 cursor-pointer disabled:cursor-default'
          onClick={removeFromLibrary}
          disabled={isLoading}
        >
          {isLoading ? 'Removing...' : 'Remove from library'}
        </button>
      )}
    </>}
  </div>;
}

export default GameInLibraryInfo;
