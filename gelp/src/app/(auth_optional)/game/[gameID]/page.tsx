import {Game} from "@/db";
import CoverArt from "@/app/(auth_optional)/game/[gameID]/CoverArt";
import GameInfo from "@/app/(auth_optional)/game/[gameID]/GameInfo";
import GameRatings from "@/app/(auth_optional)/game/[gameID]/GameRatings";
import GameInLibraryInfo from "@/app/(auth_optional)/game/[gameID]/GameInLibraryInfo";
import mongoose from "mongoose";
import GameRatingList from "@/app/(auth_optional)/game/[gameID]/GameRatingList";

const getGame = async (gameID: string) => {
  try {
    return await Game.findById(gameID).exec();
  } catch (e) {
    console.error(e);
    return null;
  }
}

const getRating = async (gameID: string): Promise<{sum: number, count: number} | null> => {
  try {
    const aggregate = await Rating.aggregate([
      {
        $match: {
          game: new mongoose.Types.ObjectId(gameID)
        }
      },
      {
        $group: {
          _id: '$game',
          ratingSum: {$sum: '$score'},
          ratingCount: {$sum: 1}
        }
      }
    ]) as {ratingSum: number, ratingCount: number}[];

    if (!aggregate[0]) {
      return {
        sum:0,
        count: 0
      }
    }

    return {
      sum: aggregate[0].ratingSum,
      count: aggregate[0].ratingCount
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

const Page = async ({params}: { params: Promise<{ gameID: string }> }) => {
  const {gameID} = await params;
  const game = await getGame(gameID);
  const ratings = await getRating(gameID);

  if (game === null)
    return <main>
      <p>
        Game not Found.
      </p>
    </main>

  if (ratings === null)
    return <main>
      <p>
        Error loading ratings.
      </p>
    </main>

  return <main className='min-h-screen bg-black text-white selection:bg-indigo-500/30 p-10'>
    <div className='max-w-7xl bg-neutral-900 p-4 flex rounded-4xl mx-auto gap-8'>
      <CoverArt game={game}/>
      <GameInfo game={game}/>
      <div className='flex-1 flex flex-col gap-16'>
        <GameInLibraryInfo/>
        <GameRatings ratings={ratings} game={{
          ...game.toJSON(),
          _id: game._id.toString()
        }}/>
      </div>
    </div>
    <GameRatingList gameID={gameID}/>
  </main>
}

export default Page;
