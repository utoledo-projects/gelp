import {NextRequest} from "next/server";

jest.mock("argon2", () => ({
  verify: jest.fn()
}));

import {POST} from "@/app/api/auth/login/route";
import {verify} from "argon2";
import {IUser, User} from "@/db/model/User";
import {Token} from "@/db/model/Token";
import {HydratedDocument} from "mongoose";

const mockUser = {
  _id: "69d46562ffaa751e73f7f093",
  username: "james",
  email: "james@example.com",
  emailVerified: false,
  password: "$argon2id$v=19$m=65536,t=3,p=4$TazYPLixMRdMgVBA+GT7uQ$sYn+XZjTMI0E3Rzv18/pvAHwyc1WVXBwO5jRlQS/NP8",
  isAdministrator: false,
  createdAt: new Date("2026-04-07T02:01:06.123Z"),
  updatedAt: new Date("2026-04-07T02:01:06.123Z"),
  __v: 0
} as unknown as HydratedDocument<IUser>;

const findOneSpy = jest.spyOn(User, "findOne");
const tokenCreateSpy = jest.spyOn(Token, "create");
const verifyMock = verify as jest.MockedFunction<typeof verify>;

const mockUserLookup = (user: HydratedDocument<IUser> | null) => {
  findOneSpy.mockReturnValue({
    exec: jest.fn().mockResolvedValue(user)
  } as never);
};

describe("Login API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should return 400 if the username or password is missing", async () => {
    const req = new NextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({})
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Missing required fields");
    expect(findOneSpy).not.toHaveBeenCalled();
  });

  it("Should return 400 if the request body is not valid JSON", async () => {
    const req = new NextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: "not a valid json value"
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid JSON");
    expect(findOneSpy).not.toHaveBeenCalled();
  });

  it("Should return 401 if the username is invalid", async () => {
    mockUserLookup(null);

    const req = new NextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: "nonexistentuser",
        password: "somepassword"
      })
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Invalid username or password");
    expect(verifyMock).not.toHaveBeenCalled();
    expect(tokenCreateSpy).not.toHaveBeenCalled();
  });

  it("Should return 401 if the password is invalid", async () => {
    mockUserLookup(mockUser);
    verifyMock.mockResolvedValue(false as never);

    const req = new NextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: "james",
        password: "invalidpassword"
      })
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Invalid username or password");
    expect(tokenCreateSpy).not.toHaveBeenCalled();
  });

  it("Should return 200 if the username and password are valid", async () => {
    mockUserLookup(mockUser);
    verifyMock.mockResolvedValue(true as never);
    tokenCreateSpy
      .mockResolvedValueOnce({token: "access-token"} as never)
      .mockResolvedValueOnce({token: "refresh-token"} as never);

    const req = new NextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: "james",
        password: "P@55w0rd"
      })
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Login successful.");
    const setCookieHeader = response.headers.get("Set-Cookie") ?? "";
    expect(setCookieHeader).toContain("G_ACCESS_TOKEN=access-token");
    expect(setCookieHeader).toContain("G_REFRESH_TOKEN=refresh-token");
    expect(tokenCreateSpy).toHaveBeenCalledTimes(2);
  });
});