import {hash} from "argon2";

export const POST = async (request: Request) => {
  let body: {username: string, email: string, password: string};

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({error: 'Invalid JSON'}), {status: 400});
  }

  if (!body.username || !body.email || !body.password)
    return new Response(JSON.stringify({error: 'Missing required fields'}), {status: 400});

  const restrictDomain = process.env.EMAIL_DOMAIN_RESTRICT_DOMAIN?.toLowerCase();
  const allowSubdomain = process.env.EMAIL_DOMAIN_RESTRICT_ALLOW_SUBDOMAIN?.toLowerCase() === 'true';

  if (restrictDomain) {
    const emailDomain = body.email.split('@')[1].toLowerCase();

    if (emailDomain !== restrictDomain && !(allowSubdomain && emailDomain.endsWith('.' + restrictDomain))) {
      return new Response(JSON.stringify({error: 'Registration is restricted.'}), {status: 403});
    }
  }

  const user = await User.findOne({$or: [{username: body.username}, {email: body.email}]}).exec();

  if (user !== null) {
    if (user.email.toLowerCase() === body.email.toLowerCase())
      return new Response(JSON.stringify({error: 'Email already in use'}), {status: 400});
    else
      return new Response(JSON.stringify({error: 'Username already in use'}), {status: 400});
  }

  await User.create({
    username: body.username,
    email: body.email,
    password: await hash(body.password)
  });

  return new Response(JSON.stringify({message: 'Account registered successfully.'}), {status: 201});
}
