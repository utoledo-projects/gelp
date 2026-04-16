import {NextRequest} from "next/server";
import mongoose from "mongoose";
import {IGame, IRating} from "@/db";

export const GET = async (req: NextRequest, {params}: {params: Promise<{userID: string}>}) => {
  const {userID} = await params;

  const u = await User.findById(userID).exec();

  if (u === null)
    return new Response(JSON.stringify({error: 'User not found.'}), {status: 404});

  const aggregate = await User.aggregate([
    {
      $match: {
        _id: u._id
      }
    },
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "user",
        as: "ratings"
      }
    },
    {
      $addFields:
      /**
       * newField: The new field name.
       * expression: The new field expression.
       */
        {
          rated_games: {
            $map: {
              input: "$ratings",
              as: "rate",
              in: "$$rate.game"
            }
          }
        }
    },
    {
      $project: {
        games: {
          $setUnion: ["$rated_games", "$library"]
        },
        inLibrary: "$library",
        rated: "$ratings"
      }
    },
    {
      $lookup:
      /**
       * from: The target collection.
       * localField: The local join field.
       * foreignField: The target join field.
       * as: The name for the results.
       * pipeline: Optional pipeline to run on the foreign collection.
       * let: Optional variables to use in the pipeline field stages.
       */
        {
          from: "games",
          localField: "games",
          foreignField: "_id",
          as: "games"
        }
    }
  ]).exec() as {
    _id: mongoose.Types.ObjectId;
    games: (IGame & {_id: mongoose.Types.ObjectId})[];
    inLibrary: mongoose.Types.ObjectId[];
    rated: (IRating & {_id: mongoose.Types.ObjectId})[];
  }[];

  return new Response(JSON.stringify({
    message: 'success.',
    games: aggregate[0].games,
    inLibrary: aggregate[0].inLibrary,
    rated: aggregate[0].rated
  }), {status: 200});
}