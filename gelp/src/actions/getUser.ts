import {IUser} from "@/db";
import {Token} from "@/db/model/Token";
import mongoose from "mongoose";

const getUser = async (G_ACCESS_TOKEN?: string): Promise<null | IUser & {_id: mongoose.Types.ObjectId}> => {
  if (!G_ACCESS_TOKEN)
    return null;

  const token = await Token.findOne({token: G_ACCESS_TOKEN, type: 'access'}).exec();

  if (token === null || token.expiresAt < new Date())
    return null;

  const user = await User.findById(token.user).exec();

  if (user === null)
    return null;

  return user.toJSON();
}

export default getUser;
