import {NextRequest} from "next/server";

export const GET = async (req: NextRequest, {params}: { params: Promise<{ gameID: string }> }) => {
  const {gameID} = await params;

  const url = new URL(req.url);
  const skip: number = Number(url.searchParams.get('skip') ?? 0);
  const limit: number = Number(url.searchParams.get('limit') ?? 100);

  if (isNaN(skip) || isNaN(limit) || skip < 0 || limit <= 0)
    return new Response(JSON.stringify({error: 'Invalid skip or limit parameter.'}), {status: 400});

  const ratings = await Rating
    .find({
      game: gameID
    })
    .skip(skip)
    .limit(limit)
    .populate('user', '_id username avatar')
    .exec();

  return new Response(JSON.stringify({
    message: 'success.',
    ratings
  }), {status: 200});
}

