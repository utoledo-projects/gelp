import { Star } from 'lucide-react';

type FeedBodyProps = {
  title: string
  description: string
  score: number
  reviewCount: number
  type?: "popular" | "release" | "update" | "recommendation"
}

export default function FeedBody({
  title,
  description,
  score,
  reviewCount,
  type
}: FeedBodyProps) {
  const displayRating = score / 2;

  const badgeColors: Record<string, string> = {
    popular: "bg-orange-600",
    release: "bg-blue-600",
    update: "bg-indigo-500",
    recommendation: "bg-green-600"
  }

  return (
    <div className="flex flex-col p-3 gap-2 relative">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold text-white line-clamp-1">{title}</h2>
        {type && (
          <span className={`rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${badgeColors[type] || "bg-zinc-700"}`}>
            {type}
          </span>
        )}
      </div>

      <p className="text-sm text-zinc-400 line-clamp-2 leading-snug min-h-10">
        {description}
      </p>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, i) => {
            const starNumber = i + 1;

            if (starNumber <= Math.floor(displayRating)) {
              return <Star key={i} size={16} className="fill-current text-yellow-500" />;
            }

            if (starNumber === Math.ceil(displayRating) && displayRating % 1 !== 0) {
              const fillPercentage = (displayRating % 1) * 100;
              return (
                <span key={i} className="relative inline-block">
                  <Star size={16} className="text-yellow-500 fill-transparent opacity-30" />
                  <span
                    className="absolute top-0 left-0 overflow-hidden"
                    style={{ width: `${fillPercentage}%` }}
                  >
                    <Star size={16} className="fill-current text-yellow-500" />
                  </span>
                </span>
              );
            }

            return <Star key={i} size={16} className="text-yellow-500 fill-transparent opacity-30" />;
          })}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-white">
            {score.toFixed(1)}
          </span>
          <span className="text-sm text-zinc-300/60">
            ({reviewCount.toLocaleString()} ratings)
          </span>
        </div>
      </div>
    </div>
  )
}
