"use client";

import {useEffect, useState} from "react";

interface IGameRating {
  ratings: number;
  count: number;
}

const useGameRatings = (gameID: string) => {
  const [gameRatings, setGameRatings] = useState<IGameRating | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (gameRatings !== null || loading)
      return;

    setLoading(true);

    fetch(`/api/game/${gameID}/ratings`)
      .then(async (res) => {
        const json = await res.json();

        if (res.status === 200) {
          setGameRatings({
            ratings: json.ratings,
            count: json.count
          });
        } else {
          setError(res.status);
          setErrorMessage(json.error ?? 'An unknown error occurred.');
        }
      })
      .catch((e) => {
        console.error(e);
        setError(-1);
        setErrorMessage('An unknown error occurred.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [gameRatings, loading]);

  return {
    gameRatings, loading, error, errorMessage
  }
}

export default useGameRatings;
