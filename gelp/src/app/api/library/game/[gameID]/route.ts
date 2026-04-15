import { NextRequest, NextResponse } from "next/server";
import { User } from "@/db";
import getUser from "@/actions/getUser";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ gameID: string }> }
) {
  try {
    const access = req.cookies.get('G_ACCESS_TOKEN');
    const user = await getUser(access?.value);
    if (user === null)
      return new NextResponse(JSON.stringify({error: 'Unauthorized.'}), {status: 401});

    const { gameID } = await params;

    // Fetch user with populated library to ensure we have the correct data
    const userWithLibrary = await User.findById(user._id).select('library').exec();
    
    if (!userWithLibrary)
      return new NextResponse(JSON.stringify({error: 'User not found'}), {status: 404});

    // Check if gameID is in user's library
    const isInLibrary = userWithLibrary.library?.some((id: any) => 
      id.toString() === gameID
    ) || false;

    return NextResponse.json({
      isInLibrary
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
