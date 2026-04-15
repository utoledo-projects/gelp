import { NextRequest, NextResponse } from "next/server";
import { User } from "@/db";
import getUser from "@/actions/getUser";

export async function POST(req: NextRequest) {
  try {
    const access = req.cookies.get('G_ACCESS_TOKEN');
    const user = await getUser(access?.value);
    if (user === null)
      return new NextResponse(JSON.stringify({error: 'Unauthorized.'}), {status: 401});

    const body = await req.json();
    const { gameID } = body;

    if (!gameID)
      return new NextResponse(JSON.stringify({error: 'Missing gameID'}), {status: 400});

    // Use $pull to remove game from library (atomic operation)
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $pull: { library: gameID } },
      { new: true }
    ).exec();

    if (!updatedUser)
      return new NextResponse(JSON.stringify({error: 'User not found'}), {status: 404});

    return NextResponse.json({
      message: "Game removed from library successfully"
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
