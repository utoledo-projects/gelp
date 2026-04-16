import {IUser} from "@/db";
import {Token} from "@/db/model/Token";

const getUser = async (G_ACCESS_TOKEN?: string): Promise<null | Omit<IUser & {_id: string}, 'password' | 'createdAt' | 'updatedAt' | 'following' | 'library'> & {following: string[], library: string[]}> => {
  if (!G_ACCESS_TOKEN)
    return null;

  const token = await Token.findOne({token: G_ACCESS_TOKEN, type: 'access'}).exec();

  if (token === null || token.expiresAt < new Date())
    return null;

  const user = await User.findById(token.user).exec();

  if (user === null)
    return null;

  return {
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    emailVerified: user.emailVerified,
    avatar: user.avatar,
    following: user.following.map(f => f.toString()),
    library: user.library.map(l => l.toString()),
    isAdministrator: user.isAdministrator
  };
}

export default getUser;
