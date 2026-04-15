import getUser from "@/actions/getUser";
import {NextRequest, NextResponse} from "next/server";

export const GET = async (req: NextRequest) => {
  // Begin Auth Check
  const access = req.cookies.get('G_ACCESS_TOKEN');
  const user = await getUser(access?.value);
  if (user === null)
    return new NextResponse(JSON.stringify({error: 'Unauthorized.'}), {status: 401});
  // End auth check

  const userWithFollowing = await User
    .findById(user._id)
    .populate('following', '_id username avatar')
    .exec();

  if (userWithFollowing === null)
    throw new Error('User not found.');

  return new Response(JSON.stringify({
    message: 'success.',
    following: userWithFollowing.following
  }), {status: 200});
}
