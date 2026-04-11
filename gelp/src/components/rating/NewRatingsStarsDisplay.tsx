import {FC, useMemo} from "react";
import {Star} from "lucide-react";

type NewRatingsStarsDisplayProps = {
  sum: number;
  count: number;
}

const NewRatingsStarsDisplay: FC<NewRatingsStarsDisplayProps> = ({sum, count}) => {
  const stars = useMemo(() => {
    const value = Number((sum / count).toFixed(1));
    const stars: number[] = Array.from({length: 10});

    for (let i = 0; i < Math.floor(value); i++) {
      stars[i] = 100;
    }

    stars[Math.floor(value)] = Math.floor((value % 1) * 100);

    for (let i = Math.floor(value) + 1; i < 10; i++) {
      stars[i] = 0;
    }

    return stars;
  }, [sum, count]);

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
    <p>
      {(sum / count).toFixed(1)} based on {count} rating{count === 1 ? '' : 's'}
    </p>
  </div>;
}

export default NewRatingsStarsDisplay;
