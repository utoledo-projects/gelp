import { useState } from "react";

type Props = {
  onChange?: (rating: number) => void;
};

export default function RatingStars({ onChange }: Props) {
  const [rating, setRating] = useState(0);

  const handleClick = (value: number) => {
    setRating(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div style={{ fontSize: "30px" }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          style={{
            cursor: "pointer",
            color: star <= rating ? "gold" : "gray",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}