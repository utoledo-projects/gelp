import {NextRequest, NextResponse} from "next/server";
import {Token} from "@/db/model/Token";

export const DELETE = async (req: NextRequest) => {
  const access = req.cookies.get('G_ACCESS_TOKEN');
  const refresh = req.cookies.get('G_REFRESH_TOKEN');

  const accessToken = access ? await Token.findOne({token: access.value, type: 'access'}).exec() : null;
  const refreshToken = refresh ? await Token.findOne({token: refresh.value, type: 'refresh'}).exec() : null;

  if (refreshToken === null)
    return new NextResponse(JSON.stringify({error: 'Unauthorized.'}), {status: 401});

  if (accessToken)
    await accessToken.deleteOne();
  await refreshToken.deleteOne();

  return new NextResponse(JSON.stringify({message: 'Logout Successful.'}), {
    status: 200,
    headers: {
      'Set-Cookie': [
        `G_ACCESS_TOKEN=; HttpOnly; Secure; Path=/; Max-Age=0`,
        `G_REFRESH_TOKEN=; HttpOnly; Secure; Path=/api/auth/refresh; Max-Age=0`,
        `G_REFRESH_TOKEN=; HttpOnly; Secure; Path=/api/auth/logout; Max-Age=0`,
      ].join(',')
    }
  });
}

