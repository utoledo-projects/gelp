import Link from "next/link"
import FeedImage from "./FeedImage"
import FeedBody from "./FeedBody"

type FeedPostProps = {
  id: string
  title: string
  summary: string
  feedImage: string
  score: number
  reviewCount: number  
  type?: "popular" | "release" | "update" | "recommendation"
}

export default function FeedPost({
  id,
  title,
  summary,
  feedImage,
  score,
  reviewCount,
  type
}: FeedPostProps) {
  return (
    <Link href={`/game/${id}`} className="block">
      <div className="group relative overflow-hidden rounded-xl bg-zinc-900 shadow-2xl transition-all hover:-translate-y-1 border border-zinc-800/50 flex flex-col w-[264px]">

        <FeedImage src={feedImage} alt={title} />

        <FeedBody
          title={title}
          summary={summary}
          score={score}
          reviewCount={reviewCount}
          type={type}
        />

      </div>
    </Link>
  )
}