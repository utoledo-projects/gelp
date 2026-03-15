type FeedImageProps = {
  src: string
  alt: string
}

export default function FeedImage({ src, alt }: FeedImageProps) {
  return (
    <div className="relative w-[264px] h-[374px] overflow-hidden flex-shrink-0">
      <img
        src={src || "/placeholder-game.jpg"}
        alt={alt}
        className="h-full w-full object-cover object-top"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-transparent" />
    </div>
  )
}