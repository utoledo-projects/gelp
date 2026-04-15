import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { rating, gameID } = body;

  console.log("Rating:", rating);
  console.log("GameID:", gameID);

  if (rating === undefined || gameID === undefined) {
    return new Response("Missing data", { status: 400 });
  }

  return NextResponse.json({
    message: "Success",
    rating,
    gameID,
  });
}