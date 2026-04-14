import {IGame} from "@/db";
import {FC} from "react";
import Link from "next/link";
import mongoose from "mongoose";
import GenreTag from "@/components/GenreTag";
import NewRatingsStarsDisplay from "@/components/rating/NewRatingsStarsDisplay";

type GameDisplayProps = {
  game: IGame & {_id: string | mongoose.Types.ObjectId};
  ratings: {
    sum: number;
    count: number;
  };
  genre?: string;
}

const GameDisplay: FC<GameDisplayProps> = ({game, genre, ratings}) => {
  return <Link href={`/game/${game._id}`} className='block'>
    <div className='group relative overflow-hidden rounded-xl bg-zinc-900 shadow-2xl transition-all hover:-translate-y-1 border border-zinc-800/50 flex flex-col w-66'>
      {/* Image */}
      <div className='relative w-66 h-93.5 overflow-hidden shrink-0'>
        <img
          src={game.coverArt}
          alt={`${game.title} cover art`}
          className='h-full w-full object-cover object-top'
        />
        <div className='absolute inset-0 bg-linear-to-t from-zinc-900/50 to-transparent'/>
      </div>
      {/* Info */}
      <div className='flex flex-col p-3 gap-2 relative'>
        <div className='flex justify-between items-center gap-2'>
          <h2 className='text-lg font-bold text-white line-clamp-1'>{game.title}</h2>
          {genre !==undefined && <GenreTag genre={genre} link={false}/>}
        </div>

        <p className="text-sm text-zinc-400 line-clamp-2 leading-snug">
          {game.summary}
        </p>
        <NewRatingsStarsDisplay sum={ratings.sum} count={ratings.count}/>
      </div>
    </div>
  </Link>
}

export default GameDisplay;
