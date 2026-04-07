import { GET as searchGET } from "@/app/api/igdb/search/route";
import { GET as topGET } from "@/app/api/igdb/top/route";
import { NextRequest } from "next/server";

jest.mock("@/actions/getUser");

import getUser from "@/actions/getUser";

// ── Helpers ────────────────────────────────────────────────────────────────

function makeRequest(url: string): NextRequest {
  const req = new NextRequest(url);
  req.cookies.set("G_ACCESS_TOKEN", "tok");
  return req;
}

/** Sequences global.fetch responses in order, repeating the last one. */
function mockFetch(...responses: Array<{ ok: boolean; json: unknown }>) {
  let i = 0;
  global.fetch = jest.fn().mockImplementation(() => {
    const r = responses[Math.min(i++, responses.length - 1)];
    return Promise.resolve({
      ok: r.ok,
      status: r.ok ? 200 : 500,
      json: () => Promise.resolve(r.json),
    });
  });
}

const TOKEN_OK   = { ok: true,  json: { access_token: "igdb-tok" } };
const TOKEN_FAIL = { ok: false, json: {} };
const GAMES_OK   = { ok: true,  json: [{ id: 1, name: "Zelda" }] };
const GAMES_FAIL = { ok: false, json: {} };

beforeEach(() => {
  jest.clearAllMocks();
  process.env.IGDB_CLIENT_ID     = "test-client-id";
  process.env.IGDB_CLIENT_SECRET = "test-client-secret";
});

afterEach(() => {
  delete process.env.IGDB_CLIENT_ID;
  delete process.env.IGDB_CLIENT_SECRET;
});

// ── GET /api/igdb/search ───────────────────────────────────────────────────

describe("GET /api/igdb/search", () => {

  it("should return 401 if user is not logged in", async () => {
    (getUser as jest.Mock).mockResolvedValue(null);

    const res = await searchGET(makeRequest("http://localhost/api/igdb/search?q=zelda"));
    expect(res.status).toBe(401);
  });

  it("should return 403 if user is not an administrator", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: false });

    const res = await searchGET(makeRequest("http://localhost/api/igdb/search?q=zelda"));
    expect(res.status).toBe(403);
  });

  it("should return 400 if the 'q' query param is missing", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });

    const res = await searchGET(makeRequest("http://localhost/api/igdb/search"));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/missing query parameter/i);
  });

  it("should return 500 if IGDB env vars are not set", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });
    delete process.env.IGDB_CLIENT_ID;
    delete process.env.IGDB_CLIENT_SECRET;

    const res = await searchGET(makeRequest("http://localhost/api/igdb/search?q=zelda"));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toMatch(/must be set/i);
  });

  it("should return 500 if the Twitch token request fails", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });
    mockFetch(TOKEN_FAIL);

    const res = await searchGET(makeRequest("http://localhost/api/igdb/search?q=zelda"));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toMatch(/failed to fetch igdb token/i);
  });

  it("should return 500 if the IGDB games endpoint returns an error", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });
    mockFetch(TOKEN_OK, GAMES_FAIL);

    const res = await searchGET(makeRequest("http://localhost/api/igdb/search?q=zelda"));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toMatch(/igdb api error/i);
  });

  it("should include the search query in the IGDB request body", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });
    mockFetch(TOKEN_OK, GAMES_OK);

    await searchGET(makeRequest("http://localhost/api/igdb/search?q=hollow+knight"));

    const igdbBody = (global.fetch as jest.Mock).mock.calls[1][1].body as string;
    expect(igdbBody).toContain('"hollow knight"');
  });

  it("should return 200 with the games list from IGDB on success", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });
    mockFetch(TOKEN_OK, GAMES_OK);

    const res = await searchGET(makeRequest("http://localhost/api/igdb/search?q=zelda"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual([{ id: 1, name: "Zelda" }]);
  });

  it("should successfully pass the cookie value to getUser", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });
    mockFetch(TOKEN_OK, GAMES_OK);

    const req = new NextRequest("http://localhost/api/igdb/search?q=zelda");
    req.cookies.set("G_ACCESS_TOKEN", "my-secret-token");
    await searchGET(req);

    expect(getUser).toHaveBeenCalledWith("my-secret-token");
  });
});

// ── GET /api/igdb/top ──────────────────────────────────────────────────────

describe("GET /api/igdb/top", () => {

  it("should return 401 if user is not logged in", async () => {
    (getUser as jest.Mock).mockResolvedValue(null);

    const res = await topGET(makeRequest("http://localhost/api/igdb/top"));
    expect(res.status).toBe(401);
  });

  it("should return 403 if user is not an administrator", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: false });

    const res = await topGET(makeRequest("http://localhost/api/igdb/top"));
    expect(res.status).toBe(403);
  });

  it("should return 500 if IGDB env vars are not set", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });
    delete process.env.IGDB_CLIENT_ID;
    delete process.env.IGDB_CLIENT_SECRET;

    const res = await topGET(makeRequest("http://localhost/api/igdb/top"));
    expect(res.status).toBe(500);
  });

  it("should return 500 if the Twitch token request fails", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });
    mockFetch(TOKEN_FAIL);

    const res = await topGET(makeRequest("http://localhost/api/igdb/top"));
    expect(res.status).toBe(500);
  });

  it("should use limit=10 in the IGDB request body by default", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });
    mockFetch(TOKEN_OK, GAMES_OK);

    await topGET(makeRequest("http://localhost/api/igdb/top"));

    const igdbBody = (global.fetch as jest.Mock).mock.calls[1][1].body as string;
    expect(igdbBody).toMatch(/limit 10/);
  });

  it("should use the provided limit query param in the IGDB request body", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });
    mockFetch(TOKEN_OK, GAMES_OK);

    await topGET(makeRequest("http://localhost/api/igdb/top?limit=25"));

    const igdbBody = (global.fetch as jest.Mock).mock.calls[1][1].body as string;
    expect(igdbBody).toMatch(/limit 25/);
  });

  it("should return 200 with the top games list on success", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });
    mockFetch(TOKEN_OK, { ok: true, json: [{ id: 10, name: "The Witcher 3" }] });

    const res = await topGET(makeRequest("http://localhost/api/igdb/top"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual([{ id: 10, name: "The Witcher 3" }]);
  });

  it("should return 500 if the IGDB games endpoint returns an error", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });
    mockFetch(TOKEN_OK, GAMES_FAIL);

    const res = await topGET(makeRequest("http://localhost/api/igdb/top"));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toMatch(/igdb api error/i);
  });

  it("should return 'Unknown error' for non-Error throws", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });
    global.fetch = jest.fn().mockRejectedValue("string crash");

    const res = await topGET(makeRequest("http://localhost/api/igdb/top"));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Unknown error");
  });
});
