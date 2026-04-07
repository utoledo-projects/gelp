/**
 * Real Mongoose schema validation using an in-memory MongoDB instance.
 *
 * Requires one extra dev dependency:
 *   npm install --save-dev mongodb-memory-server
 */

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Game } from "@/db/model/Game";
import { Rating } from "@/db/model/Rating";
import { ContentFeed } from "@/db/model/ContentFeed";

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await Promise.all([
    Game.deleteMany({}),
    Rating.deleteMany({}),
    ContentFeed.deleteMany({}),
  ]);
});

// ── Helpers ────────────────────────────────────────────────────────────────

function validGame(overrides = {}) {
  return {
    title: "Hollow Knight",
    genre: ["Metroidvania", "Platformer"],
    developer: "Team Cherry",
    releaseDate: new Date("2017-02-24"),
    dateAdded: new Date(),
    ...overrides,
  };
}

const userId = new mongoose.Types.ObjectId();

function validRating(gameId: mongoose.Types.ObjectId, overrides = {}) {
  return { user: userId, game: gameId, score: 8, ...overrides };
}

// ── Game model ─────────────────────────────────────────────────────────────

describe("Game model", () => {

  it("saves a valid game document", async () => {
    const doc = await Game.create(validGame({ igdbID: 1001 }));
    expect(doc._id).toBeDefined();
    expect(doc.title).toBe("Hollow Knight");
    expect(doc.genre).toEqual(["Metroidvania", "Platformer"]);
  });

  it("rejects a game with no title", async () => {
    const { title, ...body } = validGame() as any;
    await expect(Game.create(body)).rejects.toThrow(/title/i);
  });

  it("rejects a game with no developer", async () => {
    const { developer, ...body } = validGame() as any;
    await expect(Game.create(body)).rejects.toThrow(/developer/i);
  });

  it("rejects a game with no releaseDate", async () => {
    const { releaseDate, ...body } = validGame() as any;
    await expect(Game.create(body)).rejects.toThrow(/releaseDate/i);
  });

  it("rejects a game with no dateAdded", async () => {
    const { dateAdded, ...body } = validGame() as any;
    await expect(Game.create(body)).rejects.toThrow(/dateAdded/i);
  });

  it("enforces title uniqueness", async () => {
    await Game.create(validGame({ igdbID: 2001 }));
    await expect(Game.create(validGame({ igdbID: 2002 }))).rejects.toThrow(/duplicate key/i);
  });

  it("enforces igdbID uniqueness when set", async () => {
    await Game.create(validGame({ igdbID: 3001 }));
    await expect(
      Game.create(validGame({ title: "Different Title", igdbID: 3001 }))
    ).rejects.toThrow(/duplicate key/i);
  });

  it("allows multiple games with no igdbID (sparse index)", async () => {
    await Game.create(validGame({ title: "Game A" }));
    const doc = await Game.create(validGame({ title: "Game B" }));
    expect(doc._id).toBeDefined();
  });

  it("saves without optional coverArt and icon", async () => {
    const doc = await Game.create(validGame({ title: "Minimal", igdbID: 4001 }));
    expect(doc.coverArt).toBeUndefined();
    expect(doc.icon).toBeUndefined();
  });

  it("stores multiple genres", async () => {
    const doc = await Game.create(validGame({
      title: "Multi-Genre",
      igdbID: 5001,
      genre: ["RPG", "Action", "Adventure"],
    }));
    expect(doc.genre).toHaveLength(3);
    expect(doc.genre).toContain("RPG");
  });
});

// ── Rating model ───────────────────────────────────────────────────────────

describe("Rating model", () => {

  let gameId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    const game = await Game.create(validGame({ title: "Test Game", igdbID: 9999 }));
    gameId = game._id;
  });

  it("saves a valid rating", async () => {
    const doc = await Rating.create(validRating(gameId));
    expect(doc._id).toBeDefined();
    expect(doc.score).toBe(8);
  });

  it("rejects a rating with no score", async () => {
    await expect(Rating.create({ user: userId, game: gameId })).rejects.toThrow(/score/i);
  });

  it("rejects score below 0", async () => {
    await expect(Rating.create(validRating(gameId, { score: -1 }))).rejects.toThrow(/min/i);
  });

  it("rejects score above 10", async () => {
    await expect(Rating.create(validRating(gameId, { score: 11 }))).rejects.toThrow(/max/i);
  });

  it("accepts score = 0 (lower boundary)", async () => {
    const doc = await Rating.create(validRating(gameId, { score: 0 }));
    expect(doc.score).toBe(0);
  });

  it("accepts score = 10 (upper boundary)", async () => {
    const doc = await Rating.create(validRating(gameId, { score: 10 }));
    expect(doc.score).toBe(10);
  });

  it("rejects a rating with no user", async () => {
    await expect(Rating.create({ game: gameId, score: 7 })).rejects.toThrow(/user/i);
  });

  it("rejects a rating with no game reference", async () => {
    await expect(Rating.create({ user: userId, score: 7 })).rejects.toThrow(/game/i);
  });

  it("saves an optional review string", async () => {
    const doc = await Rating.create(validRating(gameId, { review: "Masterpiece." }));
    expect(doc.review).toBe("Masterpiece.");
  });

  it("saves without a review (field is optional)", async () => {
    const doc = await Rating.create(validRating(gameId));
    expect(doc.review).toBeUndefined();
  });

  it("sets createdAt automatically", async () => {
    const before = new Date();
    const doc = await Rating.create(validRating(gameId));
    const after = new Date();
    expect(doc.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(doc.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it("allows the same user to rate the same game more than once", async () => {
    await Rating.create(validRating(gameId, { score: 7 }));
    const second = await Rating.create(validRating(gameId, { score: 9 }));
    expect(second._id).toBeDefined();
  });
});

// ── ContentFeed model ──────────────────────────────────────────────────────

describe("ContentFeed model", () => {

  let gameId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    const game = await Game.create(validGame({ title: "Feed Game", igdbID: 7777 }));
    gameId = game._id;
  });

  it("saves a valid content feed post", async () => {
    const doc = await ContentFeed.create({ description: "A new update!", game: gameId });
    expect(doc._id).toBeDefined();
  });

  it("rejects a post with no description", async () => {
    await expect(ContentFeed.create({ game: gameId })).rejects.toThrow(/description/i);
  });

  it("rejects a post with no game reference", async () => {
    await expect(ContentFeed.create({ description: "orphan" })).rejects.toThrow(/game/i);
  });

  it("saves without an optional title", async () => {
    const doc = await ContentFeed.create({ description: "desc", game: gameId });
    expect(doc.title).toBeUndefined();
  });

  it("saves without an optional feedImage", async () => {
    const doc = await ContentFeed.create({ description: "desc", game: gameId });
    expect(doc.feedImage).toBeUndefined();
  });

  it.each(["release", "update", "popular", "recommendation"] as const)(
    'accepts valid type "%s"',
    async (type) => {
      const doc = await ContentFeed.create({ description: "desc", game: gameId, type });
      expect(doc.type).toBe(type);
    }
  );

  it("rejects an invalid type value", async () => {
    await expect(
      ContentFeed.create({ description: "desc", game: gameId, type: "invalid" })
    ).rejects.toThrow(/`invalid` is not a valid enum value/i);
  });
});
