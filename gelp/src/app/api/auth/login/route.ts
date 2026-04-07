import {verify} from "argon2";
import {Token} from "@/db/model/Token";

export const POST = async (req: Request) => {
  let body: {username: string, password: string};

  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({error: 'Invalid JSON'}), {status: 400});
  }

  if (!body.username || !body.password)
    return new Response(JSON.stringify({error: 'Missing required fields'}), {status: 400});

  const user = await User.findOne({ username: body.username }).exec();

  if (!user || !(await verify(user.password, body.password)))
    return new Response(JSON.stringify({error: 'Invalid username or password'}), {status: 401});

  const accessToken = await Token.create({
    user: user._id,
    type: 'access',
    expiresAt: Date.now() + 60 * 60 * 1000 // one hour
  });

  const refreshToken = await Token.create({
    user: user._id,
    type: 'refresh',
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // one week
  });

  return new Response(JSON.stringify({
    message: "Login successful."
  }), {
    headers: {
      'Set-Cookie': [
        `G_ACCESS_TOKEN=${accessToken.token}; HttpOnly; Secure; Path=/; Max-Age=${60 * 60}`,
        `G_REFRESH_TOKEN=${refreshToken.token}; HttpOnly; Secure; Path=/api/auth/refresh; Max-Age=${7 * 24 * 60 * 60}`,
        `G_REFRESH_TOKEN=${refreshToken.token}; HttpOnly; Secure; Path=/api/auth/logout; Max-Age=${7 * 24 * 60 * 60}`
      ].join(',')
    }
  });
}
