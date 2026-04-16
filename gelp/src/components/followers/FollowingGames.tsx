"use client";

import {FC, useEffect, useMemo, useRef, useState} from "react";
import {IGame, IRating} from "@/db";
import UserLibraryGameDisplay from "@/components/library/UserLibraryGameDisplay";

type FollowingGamesProps = {
  user: {
    _id: string,
    username: string;
  }
}

type ClientGame = IGame & {_id: string};
type ClientRating = Omit<IRating, 'game'> & {_id: string, game: string};

const FollowingGames: FC<FollowingGamesProps> = ({user}) => {
  const [games, setGames] = useState<ClientGame[] | null>(null);
  const [rated, setRated] = useState<ClientRating[] | null>(null);
  const [inLibrary, setInLibrary] = useState<string[] | null>(null);

  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  const ratedSet = useMemo(() => {
    if (!rated)
      return {};

    const obj: Partial<Record<string, ClientRating>> = {};

    for (const r of rated) {
      obj[r.game] = r;
    }

    return obj;
  }, [rated]);

  const librarySet = useMemo(() => {
    if (!inLibrary)
      return {};

    const obj: Partial<Record<string, true>> = {};

    for (const l of inLibrary) {
      obj[l] = true;
    }

    return obj;
  }, [inLibrary]);

  useEffect(() => {
    if (loadingRef.current)
      return;

    loadingRef.current = true;
    setLoading(true);

    fetch(`/api/user/${user._id}/games`, {
      method: "GET",
    })
      .then(async (res) => {
        const json = await res.json();
        if (res.status === 200) {
          setGames(json.games);
          setInLibrary(json.inLibrary);
          setRated(json.rated);
        } else {
          setError(json.error ?? 'An error occurred.');
        }
      })
      .catch((e) => {
        console.error(e);
        setError('Failed to fetch games.');
      })
      .finally(() => {
        loadingRef.current = false;
        setLoading(false);
      })
  }, [user]);

  if (loading)
    return <div>
      Loading...
    </div>;

  if (games === null || error)
    return <div className='text-red-500'>
      {error ?? 'Failed to load.'}
    </div>

  return <div className='flex flex-wrap gap-4'>
    {games.map((game) => (
     <UserLibraryGameDisplay key={game._id} user={user} game={game} rating={ratedSet[game._id]} inLibrary={librarySet[game._id]}/>
    ))}
  </div>
}

export default FollowingGames;