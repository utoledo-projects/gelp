import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { rating, gameID } = body;

  console.log("Rating:", rating);
  console.log("GameID:", gameID);

  // ✅ FIXED condition
  if (rating === undefined || !gameID) {
    return new Response("Missing data", { status: 400 });
  }

  return NextResponse.json({
    message: "Success",
    rating,
    gameID,
  });
}