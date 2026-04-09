"use client";
import {useEffect, useState} from "react";
import {IGame} from "@/db";

const useGame = (gameID: string) => {
  const [game, setGame] = useState<IGame | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (game !== null || loading)
      return;

    setLoading(true);

    fetch(`/api/game/${gameID}`)
      .then(async (res) => {
        const json = await res.json();

        if (res.status === 200) {
          setGame(json.game);
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
  }, [game, loading]);

  return {
    game, loading, error, errorMessage
  }
}

export default useGame;
