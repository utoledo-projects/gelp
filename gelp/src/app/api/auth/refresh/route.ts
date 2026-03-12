import {NextRequest} from "next/server";
import {Token} from "@/db/model/Token";

export const POST = async (request: NextRequest) => {
  const refresh = request.cookies.get('G_REFRESH_TOKEN');

  if (refresh === undefined)
    return new Response(JSON.stringify({error: 'Invalid refresh token.'}), {status: 401});

  const refreshToken = await Token.findOne({token: refresh.value, type: 'refresh'}).exec();

  if (refreshToken === null || refreshToken.expiresAt < new Date())
    return new Response(JSON.stringify({error: 'Invalid refresh token.'}), {status: 401});

  // Generate new refresh tokens
  const newAccessToken = await Token.create({
    user: refreshToken.user,
    type: 'access',
    expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour
  });
  const newRefreshToken = await Token.create({
    user: refreshToken.user,
    type: 'refresh',
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return new Response(JSON.stringify({
    message: 'Tokens refreshed.'
  }), {
    status: 200,
    headers: {
      'Set-Cookie': [
        `G_ACCESS_TOKEN=${newAccessToken.token}; HttpOnly; Path=/; Max-Age=${60 * 60}`,
        `G_REFRESH_TOKEN=${newRefreshToken.token}; HttpOnly; Path=/api/auth/refresh; Max-Age=${7 * 24 * 60 * 60}`
      ].join(',')
    }
  });
}
