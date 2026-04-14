"use client";

type Props = {
  onChange: (rating: number) => void;
};

export default function RatingStars({ onChange }: Props) {
  return (
    <div className="flex gap-2">
      {[1,2,3,4,5,6,7,8,9,10].map((num) => (
        <button
          key={num}
          onClick={() => onChange(num)}
          className="text-yellow-500"
        >
          ⭐
        </button>
      ))}
    </div>
  );
}