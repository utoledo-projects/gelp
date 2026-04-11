import {NextRequest} from "next/server";
import {IGame} from "@/db";

export const GET = async (req: NextRequest, {params}: {params: Promise<{developer: string}>}) => {
  let {developer} = await params;
  developer = decodeURIComponent(developer);

  const url = new URL(req.url);
  const skip: number = Number(url.searchParams.get('skip') ?? 0);
  const limit: number = Number(url.searchParams.get('limit') ?? 100);

  if (isNaN(skip) || isNaN(limit) || skip < 0 || limit <= 0)
    return new Response(JSON.stringify({error: 'Invalid skip or limit parameter.'}), {status: 400});

  const aggregated = await Game.aggregate([
    {
      $match: {
        developer: developer
      },
    },
    {
      $lookup: {
        from: 'ratings',
        localField: '_id',
        foreignField: 'game',
        as: 'ratings'
      }
    },
    {
      $addFields: {
        ratingSum: {$sum: '$ratings.score'},
        ratingCount: {$size: '$ratings'}
      }
    }
  ])
    .skip(skip)
    .limit(limit)
    .exec() as (IGame & { _id: string, ratingSum: number, ratingCount: number })[];

  return new Response(JSON.stringify({
    games: aggregated
  }), {status: 200});
}
