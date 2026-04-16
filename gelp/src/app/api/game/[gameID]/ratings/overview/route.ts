import {NextRequest} from "next/server";
import {isValidObjectId} from "mongoose";

export const GET = async (req: NextRequest, {params}: {params: Promise<{gameID: string}>}) => {
  const {gameID} = await params;

  if (!isValidObjectId(gameID))
    return new Response(JSON.stringify({error: 'Invalid game ID.'}), {status: 400});

  const game = await Game.findById(gameID).exec();
  if (game === null)
    return new Response(JSON.stringify({error: 'Game not found.'}), {status: 404});

  const count = await Rating.countDocuments({game: game._id});

  const sum: number = await Rating.aggregate([
    {
      $group: {
        _id: null,
        totalSum: {$sum: '$score'}
      }
    }
  ]).then((res) => {
    if (res.length === 0)
      return 0;
    return res[0].totalSum
  });

  return new Response(JSON.stringify({
    message: 'Ratings pulled.',
    sum,
    count,
  }));
}
