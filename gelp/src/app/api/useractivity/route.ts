import { NextRequest, NextResponse } from "next/server";
import { UserActivity } from "@/db";
import getUser from "@/actions/getUser";

export async function GET(req: NextRequest) {
  try {
    const access = req.cookies.get('G_ACCESS_TOKEN');
    const user = await getUser(access?.value);
    if (user === null)
      return new NextResponse(JSON.stringify({error: 'Unauthorized.'}), {status: 401});

    const url = new URL(req.url);
    const skip = Number(url.searchParams.get("skip")) || 0;
    const limit = Number(url.searchParams.get("limit")) || 20;

    const activities = await UserActivity.find()
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .populate("username")
      .populate("game")
      .populate("rating");

    return NextResponse.json({
      activities
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
