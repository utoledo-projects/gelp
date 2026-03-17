import {NextRequest, NextResponse} from "next/server";
import getUser from "@/actions/getUser";

export const GET = async (request: NextRequest) => {
  // Begin Auth Check
  const access = request.cookies.get('G_ACCESS_TOKEN');
  const user = await getUser(access?.value);
  if (user === null)
    return new NextResponse(JSON.stringify({error: 'Unauthorized.'}), {status: 401});
  // End auth check

  return new NextResponse(JSON.stringify({
    _id: user._id,
    username: user.username,
    email: user.email
  }));
}
