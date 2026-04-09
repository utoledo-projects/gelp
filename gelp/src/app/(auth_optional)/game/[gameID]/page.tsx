import {Game} from "@/db";
import CoverArt from "@/app/(auth_optional)/game/[gameID]/CoverArt";
import GameInfo from "@/app/(auth_optional)/game/[gameID]/GameInfo";
import GameRatings from "@/app/(auth_optional)/game/[gameID]/GameRatings";
import GameInLibraryInfo from "@/app/(auth_optional)/game/[gameID]/GameInLibraryInfo";

const getGame = async (gameID: string) => {
  try {
    return await Game.findById(gameID).exec();
  } catch (e) {
    console.error(e);
    return null;
  }
}

const getRatings = async (gameID: string) => {
  try {
    const count = await Rating.countDocuments({game: gameID});

    const ratings: number = await Rating.aggregate([
      {
        $group: {
          _id: null,
          totalSum: {$sum: '$score'}
        }
      }
    ]).exec().then((res) => {
      if (res.length === 0)
        return 0;
      return res[0].totalSum
    });

    return {
      ratings, count
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}

const Page = async ({params}: { params: Promise<{ gameID: string }> }) => {
  const {gameID} = await params;
  const game = await getGame(gameID);
  const ratings = await getRatings(gameID);

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
        <GameRatings ratings={ratings}/>
      </div>
    </div>
  </main>
}

export default Page;
