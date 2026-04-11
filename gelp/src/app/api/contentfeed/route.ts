import { NextRequest, NextResponse } from "next/server";
import { ContentFeed } from "@/db/model/ContentFeed";
import { Game } from "@/db/model/Game";
import { Rating } from "@/db/model/Rating";
import getUser from "@/actions/getUser";

export async function POST(req: NextRequest) {
  try {
    // Begin Auth Check
    const access = req.cookies.get('G_ACCESS_TOKEN');
    const user = await getUser(access?.value);
    if (user === null)
      return new NextResponse(JSON.stringify({ error: 'Unauthorized.' }), { status: 401 });
    if (!user.isAdministrator)
      return new NextResponse(JSON.stringify({ error: 'Forbidden.' }), { status: 403 });
    // End auth check
    const body = await req.json();
    const { title, summary, imageUrl, gameId, postType } = body;

    if (!gameId) {
      return NextResponse.json(
        { error: "Missing required field: gameId" },
        { status: 400 }
      );
    }

    const targetGame = await Game.findById(gameId);
    if (!targetGame) {
      return NextResponse.json({ error: "Game not found with the provided ID" }, { status: 404 });
    }

    const finalTitle = title?.trim() || targetGame.title;
    const finalImage = imageUrl?.trim() || targetGame.coverArt;
    const finalSummary = summary?.trim() || targetGame.summary;
    
    const newPost = await ContentFeed.create({
      title: finalTitle,
      summary: finalSummary,
      feedImage: finalImage,
      game: gameId,
      type: postType || undefined,
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const skip = Number(url.searchParams.get("skip")) || 0;
  const limit = Number(url.searchParams.get("limit")) || 100;

  try {
    const posts = await ContentFeed
      .find()
      .sort({ createdAt: 1, _id: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const postsWithStats = await Promise.all(
          posts.map(async (post) => {
            const stats = await Rating.aggregate([
              { $match: { game: post.game } }, 
              {
                $group: {
                  _id: null,
                  avgScore: { $avg: "$score" },
                  totalRatings: { $sum: 1 },
                },
              },
            ]);

            return {
              ...post,
              score: stats[0]?.avgScore || 0,
              reviewCount: stats[0]?.totalRatings || 0,
            };
          })
        );      

    return NextResponse.json(postsWithStats);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}