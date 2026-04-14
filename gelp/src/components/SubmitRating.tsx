"use client";

type Props = {
  rating: number;
  gameId: string;
};

export default function SubmitRating({ rating, gameId }: Props) {
  const handleSubmit = async () => {
    console.log("Sending:", rating, gameId);

    await fetch("/api/ratings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating,
        gameID: gameId,
      }),
    });

    alert("Rating submitted!");
  };

  return (
    <button
      onClick={handleSubmit}
      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
    >
      Submit Rating
    </button>
  );
}