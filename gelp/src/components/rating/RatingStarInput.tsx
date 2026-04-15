import {Dispatch, FC, SetStateAction} from "react";
import {Star} from "lucide-react";

type NewRatingStarPickerProps = {
  value: number;
  setValue: Dispatch<SetStateAction<number>>
}

const RatingStarInput: FC<NewRatingStarPickerProps> = ({value, setValue}) => {
  const setter = (rating: number) => {
    return () => {
      setValue(rating);
    }
  }

  return <div className='flex gap-1 items-center justify-start'>
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
      <div key={star}>
        <Star
          size={16}
          className={star <= value ? 'text-yellow-500 fill-current cursor-pointer' : 'text-gray-500 fill-current cursor-pointer'}
          onClick={setter(star)}
        />
      </div>
    ))}
    <span className='ml-2 text-zinc-500'>({value})</span>
  </div>
}

export default RatingStarInput;
