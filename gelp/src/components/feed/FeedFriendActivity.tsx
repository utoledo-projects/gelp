type FeedFriendActivityProps = {
  user: string
  action: string
  game: string
  userImage: string
  time?: string
}

export default function FeedFriendActivity({
  user,
  action,
  game,
  userImage,
  time
}: FeedFriendActivityProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800/50 shadow-2xl hover:-translate-y-1 transition-all">

      <img
        src={userImage}
        className="w-12 h-12 rounded-full object-cover border border-zinc-700"
      />

      <div className="flex flex-col">
        <p className="text-sm text-white">
          <span className="text-indigo-400 font-bold">{user}</span>
          <span className="text-zinc-500 mx-1">{action}</span>
          <span className="text-emerald-400 font-bold">{game}</span>
        </p>

        {time && (
          <span className="text-xs text-zinc-500 mt-1">
            {time}
          </span>
        )}
      </div>

    </div>
  )
}