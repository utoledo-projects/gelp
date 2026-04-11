import 'dotenv/config';
import { ensureMongoose, User, Game, Rating, ContentFeed, UserActivity } from "@/db";
import { hash } from "argon2";

console.log("SEED STARTED");

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
    summary: 'The Legend of Zelda: Breath of the Wild is the first 3D open-world game in the Zelda series. Link can travel anywhere and be equipped with weapons and armor found throughout the world to grant him various bonuses. Unlike many games in the series, Breath of the Wild does not impose a specific order in which quests or dungeons must be completed. While the game still has environmental obstacles such as weather effects, inhospitable lands, or powerful enemies, many of them can be overcome using the right method. A lot of critics ranked Breath of the Wild as one of the best video games of all time.'
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
    summary: 'A 2D metroidvania with an emphasis on close combat and exploration in which the player enters the once-prosperous now-bleak insect kingdom of Hallownest, travels through its various districts, meets friendly inhabitants, fights hostile ones and uncovers the kingdom’s history while improving their combat abilities and movement arsenal by fighting bosses and accessing out-of-the-way areas.'
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
    summary: 'Stardew Valley is an open-ended country-life RPG! You’ve inherited your grandfather’s old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life. Can you learn to live off the land and turn these overgrown fields into a thriving home? It won’t be easy. Ever since Joja Corporation came to town, the old ways of life have all but disappeared. The community center, once the town’s most vibrant hub of activity, now lies in shambles. But the valley seems full of opportunity. With a little dedication, you might just be the one to restore Stardew Valley to greatness!'
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

  const ratings = await Rating.create([
    { user: james._id, game: zelda._id, score: 9, review: "One of the my favorite games!" },
    { user: michael._id, game: zelda._id, score: 8, review: "Absolute cinema." },
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

  await ContentFeed.create([
    {
      title: `Exploring the Wilds of ${created[0].title}`,
      summary: created[0].summary,
      feedImage: created[0].coverArt,
      game: zelda._id,
      type: 'popular'
    },
    {
      title: `${created[1].title} Technical Patch Notes`,
      summary: created[1].summary,
      feedImage: created[1].coverArt,
      game: hollow._id,
      type: 'update'
    },
    {
      title: `${created[2].title} Anniversary Event`,
      summary: created[2].summary,
      feedImage: created[2].coverArt,
      game: stardew._id,
      type: 'release'
    }
  ]);

  await UserActivity.create([
    {
      username: james._id,
      game: zelda._id,
      type: 'REVIEW',
      rating: ratings[0]._id
    },
    {
      username: michael._id,
      game: zelda._id,
      type: 'REVIEW',
      rating: ratings[1]._id

    },
    {
      username: michael._id,
      game: hollow._id,
      type: 'ADD_TO_LIBRARY'
    }
  ]);  

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