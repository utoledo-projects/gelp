"use client";

import {FC, FormEventHandler, useCallback, useRef, useState} from "react";
import {IGame, IRating} from "@/db";
import RatingStarInput from "@/components/rating/RatingStarInput";

type RatingModalProps = {
  game: IGame & { _id: string };
  close: () => void;
  edit: IRating | null;
  set: (rating: IRating) => void;
};

export const RatingModal: FC<RatingModalProps> = ({game, close, edit, set}) => {
  const [rating, setRating] = useState(edit?.score ?? 0);
  const [text, setText] = useState(edit?.review ?? '');
  const [error, setError] = useState<string | null>(null);

  const loadingRef = useRef(false);
  const [loading, setLoading] = useState(false);

  const submit: FormEventHandler = useCallback((e) => {
    e.preventDefault();

    if (loadingRef.current)
      return;

    loadingRef.current = true;
    setLoading(true);

    fetch(`/api/game/${game._id}/rating`, {
      method: edit ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        score: rating,
        text: text.length === 0 ? undefined : text
      })
    })
      .then(async (res) => {
        const json = await res.json();
        if (res.status === 200) {
          set(json.rating);
          close();
        } else {
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
  }, [rating, game, text, close, set]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/80">
      <div className='w-full h-full flex items-center justify-center'>
        <form className="bg-zinc-900 p-6 rounded-xl w-96 flex flex-col gap-4">

          <h2 className="text-lg font-bold">Rate {game.title}</h2>

          <div className='flex flex-col gap-2'>
            <span>Rating Score:</span>
            <RatingStarInput value={rating} setValue={setRating}/>
          </div>

          <div className='flex flex-col gap-2'>
            <span>Rating Body:</span>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className='bg-zinc-800 p-2 rounded-xl resize-none'
              placeholder='Write your review here...'
              maxLength={1000}
            />
            <span className='text-right text-zinc-500'>{text.length}/1000</span>
          </div>

          <div className='flex gap-2'>
            <button disabled={rating === 0 || loading || (edit !== null && edit.score === rating && (edit.review ?? '') === text)} onClick={submit}
                    className='flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 p-1 rounded-lg'>
              Submit
            </button>
            <button disabled={loading} onClick={close} className="flex-1 bg-zinc-600 hover:bg-zinc-700 disabled:bg-zinc-600/50 p-1 rounded-lg">
              Close
            </button>
          </div>

          {error && <span className='text-red-500'>{error}</span>}

        </form>
      </div>
    </div>
  );
}

export default RatingModal;