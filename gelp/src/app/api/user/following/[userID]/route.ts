import {NextRequest, NextResponse} from "next/server";
import getUser from "@/actions/getUser";
import {isValidObjectId} from "mongoose";

export const GET = async (req: NextRequest, {params}: {params: Promise<{userID: string}>}) => {
  // Begin Auth Check
  const access = req.cookies.get('G_ACCESS_TOKEN');
  const user = await getUser(access?.value);
  if (user === null)
    return new NextResponse(JSON.stringify({error: 'Unauthorized.'}), {status: 401});
  // End auth check

  const {userID} = await params;

  if (!isValidObjectId(userID))
    return new Response(JSON.stringify({error: 'Invalid ID.'}), {status: 400});

  const following = await User.findById(userID).exec();

  if (following === null)
    return new Response(JSON.stringify({error: 'User not found.'}), {status: 404});

  return new Response(JSON.stringify({
    message: 'success.',
    user: following.toJSON(),
    following: user.following.some((f) => following._id.equals(f))
  }), {status: 200});
}

export const POST = async (req: NextRequest, {params}: {params: Promise<{userID: string}>}) => {
  // Begin Auth Check
  const access = req.cookies.get('G_ACCESS_TOKEN');
  const user = await getUser(access?.value);
  if (user === null)
    return new NextResponse(JSON.stringify({error: 'Unauthorized.'}), {status: 401});
  // End auth check

  const {userID} = await params;

  const targetUser = await User.findById(userID).exec();

  if (targetUser === null)
    return new Response(JSON.stringify({error: 'User not found.'}), {status: 404});

  if (user.following.some(f => targetUser._id.equals(f)))
    return new Response(JSON.stringify({error: 'Already following.'}), {status: 409});

  await User.updateOne({
    _id: user._id
  }, {
    $addToSet: {
      following: targetUser._id
    }
  });

  return new Response(JSON.stringify({
    message: 'success.'
  }), {status: 200});
}

export const DELETE = async (req: NextRequest, {params}: {params: Promise<{userID: string}>}) => {
  // Begin Auth Check
  const access = req.cookies.get('G_ACCESS_TOKEN');
  const user = await getUser(access?.value);
  if (user === null)
    return new NextResponse(JSON.stringify({error: 'Unauthorized.'}), {status: 401});
  // End auth check

  const {userID} = await params;

  const targetUser = await User.findById(userID).exec();

  console.log(user, userID, targetUser);

  if (targetUser === null)
    return new Response(JSON.stringify({error: 'User not found.'}), {status: 404});

  if (!user.following.some(f => targetUser._id.equals(f)))
    return new Response(JSON.stringify({error: 'Not following that user.'}), {status: 409});

  await User.updateOne({
    _id: user._id
  }, {
    $pull: {
      following: targetUser._id
    }
  });

  return new Response(JSON.stringify({
    message: 'success.'
  }), {status: 200});
}