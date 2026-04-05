import { NextRequest, NextResponse } from "next/server";
import { ContentFeed } from "@/db/model/ContentFeed";
import { Game } from "@/db/model/Game";
import getUser from "@/actions/getUser";

export async function POST(req: NextRequest) {
  // Begin Auth Check
  const access = req.cookies.get('G_ACCESS_TOKEN');
  const user = await getUser(access?.value);
  if (user === null)
    return new NextResponse(JSON.stringify({ error: 'Unauthorized.' }), { status: 401 });
  if (!user.isAdministrator)
    return new NextResponse(JSON.stringify({ error: 'Forbidden.' }), { status: 403 });
  // End auth check
  try {
    const body = await req.json();
    const { title, description, imageUrl, gameId, postType } = body;

    if (!description || !gameId) {
      return NextResponse.json(
        { error: "Missing required fields: description or gameId" },
        { status: 400 }
      );
    }

    const targetGame = await Game.findById(gameId);
    if (!targetGame) {
      return NextResponse.json({ error: "Game not found with the provided ID" }, { status: 404 });
    }

    const finalTitle = title?.trim() || targetGame.title;
    const finalImage = imageUrl?.trim() || targetGame.coverArt;
    
    const newPost = await ContentFeed.create({
      title: finalTitle,
      description,
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

    return NextResponse.json(posts);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}