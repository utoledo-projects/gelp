import {FC, useMemo} from "react";
import {Star} from "lucide-react";

type NewRatingsStarsDisplayProps = {
  sum: number;
  count: number;
  singleRating?: boolean;
}

const NewRatingsStarsDisplay: FC<NewRatingsStarsDisplayProps> = ({sum, count, singleRating}) => {
  const stars = useMemo(() => {
    const value = Number((sum / count).toFixed(1));
    const stars: number[] = [];

    for (let i = 0; i < Math.floor(value); i++) {
      stars.push(100);
    }

    if (Math.floor(value) < 10)
      stars.push((value % 1) * 100);

    for (let i = Math.floor(value) + 1; i < 10; i++) {
      stars.push(0);
    }

    return stars;
  }, [sum, count]);

  if (count === 0)
    return <div>
      <p>
        This game hasn't been rated yet.
      </p>
    </div>

  return <div className='flex flex-col gap-2'>
    <div className='flex gap-1 items-center justify-start'>
      {stars.map((fill, i) => (
        <div key={i} className='relative w-4 h-4'>
          <Star
            size={16}
            className='absolute inset-0 fill-current text-gray-500'
          />
          <Star
            size={16}
            className='absolute inset-0 fill-current text-yellow-500'
            style={{clipPath: `inset(0 ${100 - fill}% 0 0)`}}
          />
        </div>
      ))}
    </div>
    {!singleRating && <p>
      {(sum / count).toFixed(1)} based on {count} rating{count === 1 ? '' : 's'}
    </p>}
  </div>;
}

export default NewRatingsStarsDisplay;
