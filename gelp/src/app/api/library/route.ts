import { NextRequest, NextResponse } from "next/server";
import { User } from "@/db";
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

    // Fetch user with populated library
    const userWithLibrary = await User.findById(user._id)
      .populate({
        path: 'library',
        options: {
          sort: { _id: -1 },
          skip: skip,
          limit: limit
        }
      })
      .exec();

    if (!userWithLibrary)
      return new NextResponse(JSON.stringify({error: 'User not found'}), {status: 404});

    const library = userWithLibrary.library || [];
    const total = library.length;

    return NextResponse.json({
      library,
      total
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
