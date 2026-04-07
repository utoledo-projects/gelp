import { NextRequest, NextResponse } from "next/server";
import { UserActivity, ensureMongoose } from "@/db";

export async function GET(req: NextRequest) {
  try {
    await ensureMongoose();

    const url = new URL(req.url);
    const skip = Number(url.searchParams.get("skip")) || 0;
    const limit = Number(url.searchParams.get("limit")) || 20;

    const activities = await UserActivity.find()
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .populate("username") 
      .populate("game");

    return NextResponse.json(activities);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}