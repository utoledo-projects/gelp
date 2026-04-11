import { NextRequest, NextResponse } from "next/server";
import { ensureMongoose } from "@/db/mongoose";
import { Game } from "@/db/model/Game"; // adjust to your actual model path
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
    const { igdbID, title, genre, developer, releaseDate, coverArt, icon, summary } = body;

    if (!igdbID || !title) {
      return NextResponse.json({ error: "Missing required fields: igdbId, name" }, { status: 400 });
    }

    await ensureMongoose();

    const existing = await Game.findOne({ igdbID });
    if (existing) {
      return NextResponse.json({ error: "Game already exists" }, { status: 409 });
    }

    const game = await Game.create({
      igdbID,
      title,
      genre,
      developer,
      releaseDate: new Date(releaseDate),
      dateAdded: new Date(),
      coverArt,
      icon,
      summary: summary || "",
    });

    return NextResponse.json(game, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}