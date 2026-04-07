import {NextRequest} from "next/server";

jest.mock("@/actions/getUser");

import getUser from "@/actions/getUser";
import {GET} from "@/app/api/auth/me/route";

const getUserMock = getUser as jest.MockedFunction<typeof getUser>;

describe("Auth Me API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should return 401 if the access token is missing", async () => {
    getUserMock.mockResolvedValue(null);

    const req = new NextRequest("http://localhost/api/auth/me", {
      method: "GET"
    });

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized.");
    expect(getUserMock).toHaveBeenCalledWith(undefined);
  });

  it("Should return 401 if the access token is invalid", async () => {
    getUserMock.mockResolvedValue(null);

    const req = new NextRequest("http://localhost/api/auth/me", {
      method: "GET"
    });
    req.cookies.set("G_ACCESS_TOKEN", "invalid-token");

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized.");
    expect(getUserMock).toHaveBeenCalledWith("invalid-token");
  });

  it("Should return 200 and user details if the token is valid", async () => {
    getUserMock.mockResolvedValue({
      _id: "69d46562ffaa751e73f7f093",
      username: "james",
      email: "james@example.com",
      password: "hashed-secret"
    } as never);

    const req = new NextRequest("http://localhost/api/auth/me", {
      method: "GET"
    });
    req.cookies.set("G_ACCESS_TOKEN", "valid-token");

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      _id: "69d46562ffaa751e73f7f093",
      username: "james",
      email: "james@example.com"
    });
    expect(data).not.toHaveProperty("password");
    expect(getUserMock).toHaveBeenCalledWith("valid-token");
  });
});

