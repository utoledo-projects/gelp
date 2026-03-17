import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { rating } = body;

  console.log("Rating received:", rating);

  return NextResponse.json({
    message: "Rating received",
    rating,
  });
}