import 'dotenv/config';
import {ensureMongoose} from "@/db";
import {hash} from "argon2";

await ensureMongoose();

const SEEDED_USER_PASSWORD = 'P@55w0rd';

const james = await User.create({
  username: 'james',
  email: 'james@example.com',
  password: await hash(SEEDED_USER_PASSWORD),
});

const michael = await User.create({
  username: 'michael',
  email: 'michael@example.com',
  emailVerified: true,
  password: await hash(SEEDED_USER_PASSWORD),
});

const john = await User.create({
  username: 'john',
  email: 'john@example.com',
  emailVerified: true,
  password: await hash(SEEDED_USER_PASSWORD),
});

const robert = await User.create({
  username: 'robert',
  email: 'robert@example.com',
  emailVerified: true,
  password: await hash(SEEDED_USER_PASSWORD),
});

const david = await User.create({
  username: 'david',
  email: 'david@example.com',
  emailVerified: true,
  password: await hash(SEEDED_USER_PASSWORD),
});

const william = await User.create({
  username: 'william',
  email: 'william@example.com',
  emailVerified: true,
  password: await hash(SEEDED_USER_PASSWORD),
});

const richard = await User.create({
  username: 'richard',
  email: 'richard@example.com',
  emailVerified: true,
  password: await hash(SEEDED_USER_PASSWORD),
});

const joseph = await User.create({
  username: 'joseph',
  email: 'joseph@example.com',
  emailVerified: true,
  password: await hash(SEEDED_USER_PASSWORD),
});

const thomas = await User.create({
  username: 'thomas',
  email: 'thomas@example.com',
  emailVerified: true,
  password: await hash(SEEDED_USER_PASSWORD),
});

const christopher = await User.create({
  username: 'christopher',
  email: 'christopher@example.com',
  emailVerified: true,
  password: await hash(SEEDED_USER_PASSWORD),
});

// In order to use a user, link it using the user's ._id value, for example
// const Token = await Token.create({user: james._id});

// Make sure this is the last line of the file
process.exit(0);
