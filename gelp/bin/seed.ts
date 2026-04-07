import 'dotenv/config';
import {ensureMongoose, User, Game, Rating } from "@/db";
import {hash} from "argon2";

await ensureMongoose();

const SEEDED_USER_PASSWORD = 'P@55w0rd';

// =========================
// USERS
// =========================

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

// =========================
// GAMES
// =========================

const NOW = new Date();

const games = [
  {
    title: 'The Legend of Zelda: Breath of the Wild',
    genre: ['Action', 'Adventure'],
    developer: 'Nintendo EPD',
    releaseDate: new Date('2017-03-03'),
    dateAdded: NOW,
    coverArt: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3p2d.jpg',
    icon: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3p2d.jpg',
    igdbID: 7346,
  },
  {
    title: 'Hollow Knight',
    genre: ['Metroidvania', 'Platformer'],
    developer: 'Team Cherry',
    releaseDate: new Date('2017-02-24'),
    dateAdded: NOW,
    coverArt: 'https://images.igdb.com/igdb/image/upload/t_cover_big/cobfzp.jpg',
    icon: 'https://images.igdb.com/igdb/image/upload/t_cover_big/cobfzp.jpg',
    igdbID: 14593,
  },
  {
    title: 'Stardew Valley',
    genre: ['Simulation', 'RPG'],
    developer: 'ConcernedApe',
    releaseDate: new Date('2016-02-26'),
    dateAdded: NOW,
    coverArt: 'https://images.igdb.com/igdb/image/upload/t_cover_big/coa93h.jpg',
    icon: 'https://images.igdb.com/igdb/image/upload/t_cover_big/coa93h.jpg',
    igdbID: 17000,
  },
];


try {
  await Game.create(games);

  const created = await Game.find({
    title: { $in: games.map(g => g.title) },
  });

  console.log(
    'Seeded games:',
    created.map(g => ({ title: g.title, id: g._id }))
  );

  // =========================
  // RATINGS
  // =========================

  const [zelda, hollow, stardew] = created;

await Rating.create([
  { user: james._id, game: zelda._id, score: 9 },
  { user: michael._id, game: zelda._id, score: 8 },
  { user: john._id, game: zelda._id, score: 10 },
  { user: robert._id, game: zelda._id, score: 7 },
  { user: david._id, game: zelda._id, score: 9 },

  { user: william._id, game: hollow._id, score: 8 },
  { user: richard._id, game: hollow._id, score: 9 },
  { user: joseph._id, game: hollow._id, score: 7 },
  { user: thomas._id, game: hollow._id, score: 10 },
  { user: christopher._id, game: hollow._id, score: 8 },

  { user: james._id, game: stardew._id, score: 10 },
  { user: michael._id, game: stardew._id, score: 9 },
  { user: john._id, game: stardew._id, score: 8 },
  { user: robert._id, game: stardew._id, score: 7 },
  { user: david._id, game: stardew._id, score: 9 },
]);

console.log("Seeded ratings successfully");

} catch (err: any) {
  if (err && err.code === 11000) {
    console.warn('Some data already exists.');
  } else {
    console.error('Error seeding:', err);
    process.exit(1);
  }
}

console.log("SEED FINISHED");

// MUST BE LAST
process.exit(0);