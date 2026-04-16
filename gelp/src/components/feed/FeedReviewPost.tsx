import {IGame, IUser} from "@/db"
import Link from "next/link"
import UserIcon from "@/components/UserIcon";
import RatingStarDisplay from "@/components/rating/RatingStarDisplay";

type FeedReviewPostProps = {
  user: IUser & {_id: string};
  game: IGame & {_id: string};
  review: string
  score: number
}

export default function FeedReviewPost({
  user,
  game,
  review,
  score
}: FeedReviewPostProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800/50 shadow-2xl">
      <Link href={`/user/${user._id}`}><UserIcon user={user} size={48}/></Link>

      <div className="flex flex-col gap-2">

        <p className="text-sm text-white">
          <Link href={`/user/${user._id}`}><span className="text-indigo-400 font-bold hover:underline">{user.username}</span></Link>
          <span className="text-zinc-500 mx-1">reviewed</span>
          <Link href={`/game/${game._id}`}><span className="text-emerald-400 font-bold hover:underline">{game.title}</span></Link>
        </p>

        {review.length > 0 && <p>
          {review}
        </p>}

        <RatingStarDisplay sum={score} count={1} singleRating/>
      </div>
    </div>
  );
}
