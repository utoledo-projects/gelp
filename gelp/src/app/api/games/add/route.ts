import { NextRequest, NextResponse } from "next/server";
import {ensureMongoose} from "@/db/mongoose";
import { Game } from "@/db/model/Game"; // adjust to your actual model path

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { igdbID, title, genre, developer, releaseDate, coverArt, icon } = body;

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
    });

    return NextResponse.json(game, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}