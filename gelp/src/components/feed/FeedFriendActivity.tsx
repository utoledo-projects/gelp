import { IUser } from "../../db/model/User"
import Link from "next/link"

type FeedFriendActivityProps = {
  user: IUser
  game: string
}

export default function FeedFriendActivity({
  user,
  game
}: FeedFriendActivityProps) {
  const avatarSrc = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=6366f1&color=fff`

  return (
    <Link href="/profile" className="block">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800/50 shadow-2xl hover:-translate-y-1 transition-all">

        <img
          src={avatarSrc}
          alt={user.username}
          className="w-12 h-12 rounded-full object-cover border border-zinc-700 bg-zinc-800"
        />

        <div className="flex flex-col justify-center min-h-[48px]">
          <p className="text-sm text-white leading-snug">
            <span className="text-indigo-400 font-bold">{user.username}</span>
            <span className="text-zinc-500 mx-1">added</span>
            <span className="text-emerald-400 font-bold">{game}</span>
            <span className="text-zinc-500 ml-1">to their library</span>
          </p>
        </div>

      </div>
    </Link>
  )
}