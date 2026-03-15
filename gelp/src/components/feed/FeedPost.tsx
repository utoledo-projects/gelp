import FeedImage from "./FeedImage"
import FeedBody from "./FeedBody"

type FeedPostProps = {
  title: string
  description: string
  feedImage: string
  price: number
  concurrentPlayers: number
  type?: "sale" | "popular" | "release" | "update" | string
}

export default function FeedPost({
  title,
  description,
  feedImage,
  price,
  concurrentPlayers,
  type
}: FeedPostProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-zinc-900 shadow-2xl transition-all hover:-translate-y-1 border border-zinc-800/50 flex flex-col w-[264px]">

      <FeedImage src={feedImage} alt={title} />

      <FeedBody
        title={title}
        description={description}
        concurrentPlayers={concurrentPlayers}
        price={price}
        type={type}
      />

    </div>
  )
}