import {Game} from "@/db";
import RatingStarsDisplay from "@/components/rating/RatingStarsDisplay";
import GenreTag from "@/components/GenreTag";

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
      <img className='rounded-2xl w-full flex-1' src={game.coverArt} alt={`${game.title} cover`}/>
      <div className='flex-1 flex flex-col gap-2'>
        <h1 className='text-3xl lg:text-4xl'>{game.title}</h1>
        <br/>
        <div><span className='font-bold'>Developer:</span> {game.developer}</div>
        <div><span className='font-bold'>Release Date:</span> {game.releaseDate.toISOString().substring(0, 10)}</div>
        <div><span className='font-bold'>Genres:</span></div>
        <div className='flex flex-wrap gap-2'>
          {game.genre.map((genre) => (
            <GenreTag genre={genre} key={genre}/>
          ))}
        </div>
      </div>
      <div className='flex-1 flex flex-col gap-16'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-3xl'>Library</h1>
          <p>This game is not in your library</p>
          <button className='bg-blue-600 rounded-lg py-1 px-2'>Add it now!</button>
        </div>
        <div>
          <h1 className='text-3xl'>Ratings</h1>
          <br/>
          {ratings.count === 0 && <div className='flex flex-col gap-4'>
            <p>No ratings yet.</p>
            <button className='bg-blue-600 rounded-lg py-1 px-2'>Be the first to rate this game!</button>
          </div>}
          {ratings.count > 0 && <p>
            <RatingStarsDisplay rating={ratings.ratings / ratings.count}/>
            <button className='bg-blue-600 rounded-lg py-1 px-2'>Rate this game</button>
          </p>}
        </div>
      </div>
    </div>
  </main>
}

export default Page;
