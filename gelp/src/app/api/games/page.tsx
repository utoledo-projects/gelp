import SubmitRating from "@/components/SubmitRating";

export default function Page() {
  const game = { id: "123" }; // temporary game ID

  return (
    <div>
      <h1>Game Page</h1>

      <SubmitRating gameID={game.id} />
    </div>
  );
}