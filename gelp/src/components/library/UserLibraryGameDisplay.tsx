import {IGame, IRating} from "@/db";
import {FC} from "react";
import Link from "next/link";
import RatingStarDisplay from "@/components/rating/RatingStarDisplay";

type ClientRating = Omit<IRating, 'game'> & { _id: string, game: string };

type UserLibraryGameDisplayProps = {
  user: {
    username: string
  }
  game: IGame & { _id: string };
  rating?: ClientRating;
  inLibrary: true | undefined;
}

const UserLibraryGameDisplay: FC<UserLibraryGameDisplayProps> = ({user, game, rating, inLibrary}) => {
  return <Link href={`/game/${game._id}`} className='block'>
    <div className='group relative overflow-hidden rounded-xl bg-zinc-900 shadow-2xl transition-all hover:-translate-y-1 border border-zinc-800/50 flex flex-col w-66 h-full'>
      <div className='relative 2-66 h-93.5 overflow-hidden shrink-0'>
        <img
          src={game.coverArt}
          alt={`${game.title} cover art`}
          className='w-full h-full object-cover object-top'
        />
        <div className='absolute inset-0 bg-linear-to-t from-zinc-900/50 to-transparent'/>
      </div>

      <div className='flex flex-col p-3 gap-2 relative'>
        <div className='flex justify-between items-center gap-2'>
          <h2 className='text-lg font-bold text-white line-clamp-1'>{game.title}</h2>
          <span>{inLibrary ? 'In Library' : 'Not in Library'}</span>
        </div>
        {rating && <div className='flex flex-col gap-2'>
          <span>{user.username}'s Rating</span>
          <RatingStarDisplay sum={rating.score} count={1} singleRating/>
          {rating.review && <span>{rating.review}</span>}
        </div>}
        {!rating && <div>
          <span className='text-zinc-400'>This user has not rated this game.</span>
        </div>}
      </div>
    </div>
  </Link>
}

export default UserLibraryGameDisplay;