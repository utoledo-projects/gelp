import { IUser } from "../../db/model/User"
import Link from "next/link"
import { Star } from 'lucide-react';

type FeedReviewPostProps = {
  user: IUser
  game: string
  review: string
  score: number
}

export default function FeedReviewPost({
  user,
  game,
  review,
  score
}: FeedReviewPostProps) {
  const avatarSrc = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=6366f1&color=fff`
  
  const displayRating = score / 2;

  return (
    <Link href="/game-details" className="block">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800/50 shadow-2xl hover:-translate-y-1 transition-all">

        <img
          src={avatarSrc}
          alt={user.username}
          className="w-12 h-12 rounded-full object-cover border border-zinc-700 bg-zinc-800"
        />

        <div className="flex flex-col">

          <p className="text-sm text-white">
            <span className="text-indigo-400 font-bold">{user.username}</span>
            <span className="text-zinc-500 mx-1">reviewed</span>
            <span className="text-emerald-400 font-bold">{game}</span>
          </p>

          <p className="text-sm text-zinc-300 mt-1">
            {review}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => {
                const starNumber = i + 1;
                
                if (starNumber <= Math.floor(displayRating)) {
                  return <Star key={i} size={14} className="fill-current text-yellow-500" />;
                }
                
                if (starNumber === Math.ceil(displayRating) && displayRating % 1 !== 0) {
                  const fillPercentage = (displayRating % 1) * 100;
                  return (
                    <span key={i} className="relative inline-block">
                      <Star size={14} className="text-yellow-500 fill-transparent opacity-30" />
                      <span 
                        className="absolute top-0 left-0 overflow-hidden" 
                        style={{ width: `${fillPercentage}%` }}
                      >
                        <Star size={14} className="fill-current text-yellow-500" />
                      </span>
                    </span>
                  );
                }

                return <Star key={i} size={14} className="text-yellow-500 fill-transparent opacity-30" />;
              })}
            </div>
          </div>

        </div>

      </div>
    </Link>
  )
}