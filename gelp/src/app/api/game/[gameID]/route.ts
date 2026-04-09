import {NextRequest} from "next/server";
import {isValidObjectId} from "mongoose";

export const GET = async (req: NextRequest, {params}: {params: Promise<{gameID: string}>}) => {
  const {gameID} = await params;

  if (!isValidObjectId(gameID))
    return new Response(JSON.stringify({error: 'Invalid game ID.'}), {status: 400});

  const game = await Game.findById(gameID).exec();

  if (game === null)
    return new Response(JSON.stringify({error: 'Game not found.'}), {status: 404});

  return new Response(JSON.stringify({game: game.toJSON()}), {status: 200});
}
