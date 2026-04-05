import { POST } from "../route";
import { NextRequest } from "next/server";

jest.mock("@/actions/getUser");
jest.mock("@/db/model/ContentFeed");
jest.mock("@/db/model/Game");

import getUser from "@/actions/getUser";

describe("Content Feed API", () => {
  
  it("should return 400 if description is missing", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });

    const req = new NextRequest("http://localhost/api/contentfeed", {
      method: "POST",
      body: JSON.stringify({ gameId: "123" }), // Missing description
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Missing required fields: description or gameId");
  });

  it("should return 401 if user is not logged in", async () => {
    // Mock getUser to return null (no user found)
    (getUser as jest.Mock).mockResolvedValue(null);

    const req = new NextRequest("http://localhost/api/contentfeed", {
      method: "POST",
      body: JSON.stringify({ description: "Test", gameId: "123" }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized.");
  });

  it("should return 404 if the game does not exist", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });
    
    // Require the mocked Game model and force findById to return null
    const { Game } = require("@/db/model/Game");
    Game.findById.mockResolvedValue(null);

    const req = new NextRequest("http://localhost/api/contentfeed", {
      method: "POST",
      body: JSON.stringify({ description: "Test", gameId: "non-existent-id" }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Game not found with the provided ID");
  });
});