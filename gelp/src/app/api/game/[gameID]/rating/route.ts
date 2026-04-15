import {NextRequest, NextResponse} from "next/server";
import getUser from "@/actions/getUser";
import {IRating} from "@/db";
import {HydratedDocument} from "mongoose";

const VALID_RATINGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const GET = async (req: NextRequest, {params}: {params: Promise<{gameID: string}>}) => {
  // Begin Auth Check
  const access = req.cookies.get('G_ACCESS_TOKEN');
  const user = await getUser(access?.value);
  if (user === null)
    return new NextResponse(JSON.stringify({error: 'Unauthorized.'}), {status: 401});
  // End auth check

  const {gameID} = await params;
  if (await Game.findById(gameID).exec() === null)
    return new Response(JSON.stringify({error: 'Game not found.'}), {status: 404});


  const rating = await Rating.findOne({game: gameID, user: user._id}).exec();

  return new Response(JSON.stringify({
    message: 'success.',
    rating: rating?.toJSON()
  }), {status: 200});
}

export const POST = async (req: NextRequest, {params}: {params: Promise<{gameID: string}>}) => {
  // Begin Auth Check
  const access = req.cookies.get('G_ACCESS_TOKEN');
  const user = await getUser(access?.value);
  if (user === null)
    return new NextResponse(JSON.stringify({error: 'Unauthorized.'}), {status: 401});
  // End auth check

  // Get options
  const {gameID} = await params;
  const body = await req.json();
  const { score, text } = body;

  // Check if game exists and check for existing rating
  if (await Game.findById(gameID).exec() === null)
    return new Response(JSON.stringify({error: 'Game not found.'}), {status: 404});
  if (await Rating.findOne({game: gameID, user: user._id}).exec() !== null)
    return new Response(JSON.stringify({error: 'Game already rated.'}), {status: 409});

  if (!VALID_RATINGS.includes(score))
    return new Response(JSON.stringify({error: 'Bad rating.'}), {status: 400});
  if (typeof text === 'string' && (text.length === 0 || text.length > 1000))
    return new Response(JSON.stringify({error: 'Bad rating text.'}), {status: 400});

  let rating: HydratedDocument<IRating>;

  try {
    rating = await Rating.create({
      user: user._id,
      game: gameID,
      score,
      review: typeof text === 'string' ? text : undefined,
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({error: 'Failed to create rating.'}), {status: 500});
  }

  return new Response(JSON.stringify({
    message: 'success.',
    rating: rating.toJSON()
  }), {status: 200});
}

export const PUT = async (req: NextRequest, {params}: {params: Promise<{gameID: string}>}) => {
// Begin Auth Check
  const access = req.cookies.get('G_ACCESS_TOKEN');
  const user = await getUser(access?.value);
  if (user === null)
    return new NextResponse(JSON.stringify({error: 'Unauthorized.'}), {status: 401});
  // End auth check

  // Get options
  const {gameID} = await params;
  const body = await req.json();
  const { score, text } = body;

  // Check if game exists and check for existing rating
  if (await Game.findById(gameID).exec() === null)
    return new Response(JSON.stringify({error: 'Game not found.'}), {status: 404});

  const rating = await Rating.findOne({game: gameID, user: user._id}).exec();
  if (rating === null)
    return new Response(JSON.stringify({error: 'Rating not found.'}), {status: 404});

  if (!VALID_RATINGS.includes(score))
    return new Response(JSON.stringify({error: 'Bad rating.'}), {status: 400});
  if (typeof text === 'string' && (text.length === 0 || text.length > 1000))
    return new Response(JSON.stringify({error: 'Bad rating text.'}), {status: 400});

  rating.score = score;
  rating.review = text;
  await rating.save();

  return new Response(JSON.stringify({
    message: 'success.',
    rating: rating.toJSON()
  }), {status: 200});
}