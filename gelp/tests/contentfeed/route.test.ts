import { POST, GET } from "@/app/api/contentfeed/route";
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
      body: JSON.stringify({ gameId: "123" }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Missing required fields: description or gameId");
  });

  it("should return 401 if user is not logged in", async () => {
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

  it("should return 201 on successful creation", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });
    
    const { Game } = require("@/db/model/Game");
    const { ContentFeed } = require("@/db/model/ContentFeed");
    
    Game.findById.mockResolvedValue({ _id: "123" });
    ContentFeed.create.mockResolvedValue({ _id: "new-id", description: "Success" });

    const req = new NextRequest("http://localhost/api/contentfeed", {
      method: "POST",
      body: JSON.stringify({ description: "Success", gameId: "123" }),
    });

    const response = await POST(req);
    expect(response.status).toBe(201);
  });

  it("should return 500 if an internal server error occurs", async () => {
    (getUser as jest.Mock).mockRejectedValueOnce(new Error("Database Crash"));

    const req = new NextRequest("http://localhost/api/contentfeed", {
      method: "POST",
      body: JSON.stringify({ description: "Test", gameId: "123" }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Database Crash"); 
  });

  it("should return 403 if user is not an administrator", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: false });

    const req = new NextRequest("http://localhost/api/contentfeed", {
      method: "POST",
      body: JSON.stringify({ description: "Test", gameId: "123" }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Forbidden.");
  });  

  it("should use provided title and imageUrl instead of defaults", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });
    
    const { Game } = require("@/db/model/Game");
    const { ContentFeed } = require("@/db/model/ContentFeed");
    
    Game.findById.mockResolvedValue({ 
      _id: "123", 
      title: "Game Title", 
      coverArt: "game-image.jpg" 
    });

    ContentFeed.create.mockResolvedValue({ _id: "new-id" });

    const req = new NextRequest("http://localhost/api/contentfeed", {
      method: "POST",
      body: JSON.stringify({ 
        description: "Success", 
        gameId: "123",
        title: "Custom Title",
        imageUrl: "custom.jpg",
        postType: "Review"   
      }),
    });

    const response = await POST(req);
    
    expect(response.status).toBe(201);
    expect(ContentFeed.create).toHaveBeenCalledWith(expect.objectContaining({
      title: "Custom Title",
      feedImage: "custom.jpg",
      type: "Review"
    }));
  });  

  it("should successfully pass the cookie value to getUser", async () => {
    (getUser as jest.Mock).mockResolvedValue({ isAdministrator: true });
    const { Game } = require("@/db/model/Game");
    const { ContentFeed } = require("@/db/model/ContentFeed");
    Game.findById.mockResolvedValue({ _id: "123" });
    ContentFeed.create.mockResolvedValue({ _id: "new-id" });

    const req = new NextRequest("http://localhost/api/contentfeed", {
      method: "POST",
      body: JSON.stringify({ description: "Success", gameId: "123" }),
    });

    req.cookies.set('G_ACCESS_TOKEN', 'fake-token-123');

    await POST(req);
    
    expect(getUser).toHaveBeenCalledWith('fake-token-123');
  });  

  it("should return 'Unknown error' if a non-Error is thrown", async () => {
    (getUser as jest.Mock).mockImplementationOnce(() => {
      throw "Fatal String Crash"; 
    });

    const req = new NextRequest("http://localhost/api/contentfeed", {
      method: "POST",
      body: JSON.stringify({ description: "Test", gameId: "123" }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Unknown error");
  });  

  it("GET returns posts with default skip and limit", async () => {
    const { ContentFeed } = require("@/db/model/ContentFeed");
    ContentFeed.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([{ _id: "1" }, { _id: "2" }])
    });

    const req = new NextRequest("http://localhost/api/contentfeed?skip=0&limit=10");
    const res = await GET(req);
    const data = await res.json();

    expect(data).toHaveLength(2);
  });  

  it("GET returns 500 if ContentFeed.find fails", async () => {
    const { ContentFeed } = require("@/db/model/ContentFeed");
    ContentFeed.find.mockImplementation(() => { throw new Error("DB fail") });

    const req = new NextRequest("http://localhost/api/contentfeed");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("DB fail");
  });

  it("GET handles non-zero skip and limit correctly", async () => {
    const { ContentFeed } = require("@/db/model/ContentFeed");

    const mockLimit = jest.fn().mockResolvedValue([{ _id: "10" }, { _id: "11" }]);
    const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
    const mockSort = jest.fn().mockReturnValue({ skip: mockSkip });

    ContentFeed.find.mockReturnValue({ sort: mockSort });

    const req = new NextRequest("http://localhost/api/contentfeed?skip=5&limit=2");
    const res = await GET(req);
    const data = await res.json();

    expect(mockSort).toHaveBeenCalledWith({ createdAt: 1, _id: 1 });
    expect(mockSkip).toHaveBeenCalledWith(5);
    expect(mockLimit).toHaveBeenCalledWith(2);
    expect(data).toHaveLength(2);
  });

  it("GET returns 'Unknown error' if a non-Error is thrown", async () => {
    const { ContentFeed } = require("@/db/model/ContentFeed");
    
    ContentFeed.find.mockImplementation(() => { 
      throw "Non-Error Database Crash"; 
    });

    const req = new NextRequest("http://localhost/api/contentfeed");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Unknown error");
  });
});