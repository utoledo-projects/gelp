import {ensureMongoose} from "@/db";

export async function register() {
  await ensureMongoose();
}
