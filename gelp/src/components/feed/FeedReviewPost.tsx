type FeedReviewPostProps = {
  user: string
  game: string
  review: string
  rating: number
  userImage: string
}

export default function FeedReviewPost({
  user,
  game,
  review,
  rating,
  userImage
}: FeedReviewPostProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800/50 shadow-2xl hover:-translate-y-1 transition-all">

      <img
        src={userImage}
        className="w-12 h-12 rounded-full object-cover border border-zinc-700"
      />

      <div className="flex flex-col">

        <p className="text-sm text-white">
          <span className="text-indigo-400 font-bold">{user}</span>
          <span className="text-zinc-500 mx-1">reviewed</span>
          <span className="text-emerald-400 font-bold">{game}</span>
        </p>

        <p className="text-sm text-zinc-300 mt-1">
          {review}
        </p>

        <div className="flex gap-0.5 text-yellow-500 mt-2">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className="text-[12px]">
              {i < rating ? "★" : "☆"}
            </span>
          ))}
        </div>

      </div>

    </div>
  )
}