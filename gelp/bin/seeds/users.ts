import {HydratedDocument} from "mongoose";
import {IUser, User} from "@/db";
import {hash} from "argon2";

const SEED_USER_PASSWORD = 'P@55w0rd';

const findUserOrCreate = async (user: Partial<IUser>): Promise<HydratedDocument<IUser>> => {
  const existingUser = await User.findOne({username: user.username}).exec();

  if (existingUser !== null) {
    console.warn(`[WARN] user with username ${user.username} already exists, skipping creation.`);
    return existingUser;
  }

  return await User.create(user);
}

export const james = await findUserOrCreate({
  username: 'james',
  email: 'james@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD)
});

export const michael = await findUserOrCreate({
  username: 'michael',
  email: 'michael@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD),
});

export const john = await findUserOrCreate({
  username: 'john',
  email: 'john@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD),
});

export const robert = await findUserOrCreate({
  username: 'robert',
  email: 'robert@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD),
});

export const david = await findUserOrCreate({
  username: 'david',
  email: 'david@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD),
});

export const william = await findUserOrCreate({
  username: 'william',
  email: 'william@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD),
});

export const richard = await findUserOrCreate({
  username: 'richard',
  email: 'richard@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD),
});

export const joseph = await findUserOrCreate({
  username: 'joseph',
  email: 'joseph@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD),
});

export const thomas = await findUserOrCreate({
  username: 'thomas',
  email: 'thomas@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD),
});

export const christopher = await findUserOrCreate({
  username: 'christopher',
  email: 'christopher@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD),
});

export const mary = await findUserOrCreate({
  username: 'mary',
  email: 'mary@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD)
});

export const patricia = await findUserOrCreate({
  username: 'patricia',
  email: 'patricia@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD),
});

export const jennifer = await findUserOrCreate({
  username: 'jennifer',
  email: 'jennifer@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD),
});

export const linda = await findUserOrCreate({
  username: 'linda',
  email: 'linda@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD),
});

export const elizabeth = await findUserOrCreate({
  username: 'elizabeth',
  email: 'elizabeth@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD),
});

export const barbara = await findUserOrCreate({
  username: 'barbara',
  email: 'barbara@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD),
});

export const susan = await findUserOrCreate({
  username: 'susan',
  email: 'susan@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD),
});

export const jessica = await findUserOrCreate({
  username: 'jessica',
  email: 'jessica@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD),
});

export const karen = await findUserOrCreate({
  username: 'karen',
  email: 'karen@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD),
});

export const sarah = await findUserOrCreate({
  username: 'sarah',
  email: 'sarah@example.com',
  emailVerified: true,
  password: await hash(SEED_USER_PASSWORD),
});

export const users = [
  james,
  michael,
  john,
  robert,
  david,
  william,
  richard,
  joseph,
  thomas,
  christopher,
  mary,
  patricia,
  jennifer,
  linda,
  elizabeth,
  barbara,
  susan,
  jessica,
  karen,
  sarah
];
