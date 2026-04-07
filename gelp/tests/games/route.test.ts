import { POST } from "@/app/api/games/add/route";
import { NextRequest } from "next/server";

jest.mock("@/db/mongoose", () => ({ ensureMongoose: jest.fn() }));
jest.mock("@/actions/getUser");
jest.mock("@/db/model/Game");

import getUser from "@/actions/getUser";

const VALID_BODY = {
  igdbID: 12345,
  title: "Hollow Knight",
  genre: ["Metroidvania", "Platformer"],
  developer: "Team Cherry",
  releaseDate: "2017-02-24",
  coverArt: "/covers/hk.jpg",
  icon: "/icons/hk.png",
};

function makeRequest(body: object): NextRequest {
  const req = new NextRequest("http://localhost/api/games/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  req.cookies.set("G_ACCESS_TOKEN", "tok");
  return req;
}

beforeEach(() => jest.clearAllMocks());

describe("POST /api/games/add", () => {

  it("should return 401 if user is not logged in", async () => {
    (getUser as jest.Mock).mockResolvedValue(null);

    const res = await POST(makeRequest(VALID_BODY));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Unauthorized.");
  });

  it("should return 403 if user is not an administrator", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: false });

    const res = await POST(makeRequest(VALID_BODY));
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.error).toBe("Forbidden.");
  });

  it("should return 400 if igdbID is missing", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });

    const { igdbID, ...body } = VALID_BODY;
    const res = await POST(makeRequest(body));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/missing required fields/i);
  });

  it("should return 400 if title is missing", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });

    const { title, ...body } = VALID_BODY;
    const res = await POST(makeRequest(body));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/missing required fields/i);
  });

  it("should return 409 if a game with the same igdbID already exists", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });

    const { Game } = require("@/db/model/Game");
    Game.findOne.mockResolvedValue({ igdbID: 12345, title: "Hollow Knight" });

    const res = await POST(makeRequest(VALID_BODY));
    const data = await res.json();

    expect(res.status).toBe(409);
    expect(data.error).toBe("Game already exists");
  });

  it("should return 201 and the created game on success", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });

    const { Game } = require("@/db/model/Game");
    const created = { ...VALID_BODY, _id: "game-abc", dateAdded: new Date() };
    Game.findOne.mockResolvedValue(null);
    Game.create.mockResolvedValue(created);

    const res = await POST(makeRequest(VALID_BODY));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.title).toBe("Hollow Knight");
    expect(data.igdbID).toBe(12345);
  });

  it("should call Game.create with a dateAdded and parsed releaseDate", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });

    const { Game } = require("@/db/model/Game");
    Game.findOne.mockResolvedValue(null);
    Game.create.mockResolvedValue({ ...VALID_BODY, _id: "game-abc" });

    await POST(makeRequest(VALID_BODY));

    expect(Game.create).toHaveBeenCalledWith(
      expect.objectContaining({
        igdbID: 12345,
        title: "Hollow Knight",
        developer: "Team Cherry",
        releaseDate: expect.any(Date),
        dateAdded: expect.any(Date),
      })
    );
  });

  it("should successfully pass the cookie value to getUser", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });

    const { Game } = require("@/db/model/Game");
    Game.findOne.mockResolvedValue(null);
    Game.create.mockResolvedValue({ ...VALID_BODY, _id: "game-abc" });

    const req = makeRequest(VALID_BODY);
    req.cookies.set("G_ACCESS_TOKEN", "my-secret-token");
    await POST(req);

    expect(getUser).toHaveBeenCalledWith("my-secret-token");
  });

  it("should return 500 with the error message if Game.create throws", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });

    const { Game } = require("@/db/model/Game");
    Game.findOne.mockResolvedValue(null);
    Game.create.mockRejectedValue(new Error("DB connection lost"));

    const res = await POST(makeRequest(VALID_BODY));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("DB connection lost");
  });

  it("should return 500 with 'Unknown error' for non-Error throws", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });

    const { Game } = require("@/db/model/Game");
    Game.findOne.mockResolvedValue(null);
    Game.create.mockRejectedValue("string crash");

    const res = await POST(makeRequest(VALID_BODY));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Unknown error");
  });
});
