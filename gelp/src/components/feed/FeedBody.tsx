type FeedBodyProps = {
  title: string
  description: string
  concurrentPlayers: number
  price?: number
  type?: "sale" | "popular" | "release" | "update" | string
}

export default function FeedBody({
  title,
  description,
  concurrentPlayers,
  price,
  type
}: FeedBodyProps) {
  const badgeColors: Record<string, string> = {
    sale: "bg-red-600",
    popular: "bg-orange-600",
    release: "bg-blue-600",
    update: "bg-indigo-500",
  }

  return (
    <div className="flex flex-col p-3 gap-2 relative">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold text-white line-clamp-1">{title}</h2>

        {type && (
          <span
            className={`rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${
              badgeColors[type] || "bg-zinc-700"
            }`}
          >
            {type}
          </span>
        )}
      </div>

      <p className="text-sm text-zinc-400 line-clamp-2 leading-snug min-h-[2.5rem]">
        {description}
      </p>

      <div className="flex justify-between items-center text-sm mt-2">
        <span className="font-bold text-emerald-400">
          {price === 0 ? "FREE" : `$${price?.toFixed(2)}`}
        </span>

        {concurrentPlayers > 0 && (
          <span className="flex items-center gap-2 text-[12px] font-bold text-emerald-500 uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            {concurrentPlayers.toLocaleString()} Online
          </span>
        )}
      </div>
    </div>
  )
}