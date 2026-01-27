import assert from "node:assert";
import * as mongoose from "mongoose";

assert(process.env.MONGO_URI, 'env:MONGO_URI is not set.');

const connection = mongoose.connect(process.env.MONGO_URI);

export const ensureMongoose = () => {
  return connection;
}
