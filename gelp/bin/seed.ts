import 'dotenv/config';
import {ensureMongoose} from "@/db";

const main = async () => {
  await ensureMongoose();
  console.info('[INFO] Starting seed.');
  await import('./seeds/users');
  console.info('[INFO] User seeding complete.');
  await import('./seeds/games');
  console.info('[INFO] Game seeding complete.');
  await import('./seeds/ratings');
  console.info('[INFO] Rating seeding complete.');
  await import('./seeds/content');
  console.info('[INFO] Content feed seeding complete.');
  console.info('[INFO] Seeding complete.');
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
