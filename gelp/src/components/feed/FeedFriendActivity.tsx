import {IGame, IUser} from "@/db"
import Link from "next/link"
import UserIcon from "@/components/UserIcon";

type FeedFriendActivityProps = {
  user: IUser & {_id: string};
  game: IGame & {_id: string};
}

export default function FeedFriendActivity({
                                             user,
                                             game
                                           }: FeedFriendActivityProps) {
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800/50 shadow-2xl">
      <Link href={`/user/${user._id}`} className='cursor-pointer'><UserIcon user={user} size={48}/></Link>
      <div className="flex flex-col justify-center min-h-12">
        <p className="text-sm text-white leading-snug">
          <Link href={`/user/${user._id}`}><span className="text-indigo-400 font-bold hover:underline">{user.username}</span></Link>
          <span className="text-zinc-500 mx-1">added</span>
          <Link href={`/game/${game._id}`}><span className="text-emerald-400 font-bold hover:underline">{game.title}</span></Link>
          <span className="text-zinc-500 ml-1">to their library</span>
        </p>
      </div>
    </div>
  );
}