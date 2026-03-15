import * as mongoose from "mongoose";

if (!process.env.MONGO_URI) {
  throw new Error("env:MONGO_URI is not set.");
}

const connection = mongoose.connect(process.env.MONGO_URI);

export const ensureMongoose = () => {
  return connection;
};