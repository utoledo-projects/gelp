import {NextRequest, NextResponse} from "next/server";
import getUser from "@/actions/getUser";
import sharp from "sharp";

export const POST = async (req: NextRequest) => {
  // Begin Auth Check
  const access = req.cookies.get('G_ACCESS_TOKEN');
  const user = await getUser(access?.value);
  if (user === null)
    return new NextResponse(JSON.stringify({error: 'Unauthorized.'}), {status: 401});
  // End auth check

  const formData = await req.formData();
  const avatar = formData.get('avatar');

  if (!(avatar instanceof File))
    return new Response(JSON.stringify({error: 'Not a file.'}), {status: 400});

  const processed = await sharp(await avatar.bytes())
    .resize({
      width: 48,
      height: 48
    })
    .toFormat('png')
    .toBuffer();

  const imageBase64 = `data:image/png;base64,${processed.toString('base64')}`;

  await User.updateOne({_id: user._id}, {avatar: imageBase64});

  return new Response(JSON.stringify({
    message: 'success.',
    base64: imageBase64
  }), {status: 200});
}
