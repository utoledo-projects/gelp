import {NextRequest} from "next/server";

import {POST} from "@/app/api/auth/refresh/route";
import {Token} from "@/db/model/Token";

const findOneSpy = jest.spyOn(Token, "findOne");
const tokenCreateSpy = jest.spyOn(Token, "create");

const mockRefreshLookup = (refreshToken: {expiresAt: Date; user: string} | null) => {
  findOneSpy.mockReturnValue({
    exec: jest.fn().mockResolvedValue(refreshToken)
  } as never);
};

describe("Refresh API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should return 401 if the refresh token cookie is missing", async () => {
    const req = new NextRequest("http://localhost/api/auth/refresh", {
      method: "POST"
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Invalid refresh token.");
    expect(findOneSpy).not.toHaveBeenCalled();
    expect(tokenCreateSpy).not.toHaveBeenCalled();
  });

  it("Should return 401 if the refresh token does not exist", async () => {
    mockRefreshLookup(null);

    const req = new NextRequest("http://localhost/api/auth/refresh", {
      method: "POST"
    });
    req.cookies.set("G_REFRESH_TOKEN", "nonexistent-token");

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Invalid refresh token.");
    expect(findOneSpy).toHaveBeenCalledWith({token: "nonexistent-token", type: "refresh"});
    expect(tokenCreateSpy).not.toHaveBeenCalled();
  });

  it("Should return 401 if the refresh token is expired", async () => {
    mockRefreshLookup({
      user: "69d46562ffaa751e73f7f093",
      expiresAt: new Date(Date.now() - 60_000)
    });

    const req = new NextRequest("http://localhost/api/auth/refresh", {
      method: "POST"
    });
    req.cookies.set("G_REFRESH_TOKEN", "expired-token");

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Invalid refresh token.");
    expect(tokenCreateSpy).not.toHaveBeenCalled();
  });

  it("Should return 200 and set new access and refresh cookies for a valid token", async () => {
    mockRefreshLookup({
      user: "69d46562ffaa751e73f7f093",
      expiresAt: new Date(Date.now() + 60_000)
    });
    tokenCreateSpy
      .mockResolvedValueOnce({token: "new-access-token"} as never)
      .mockResolvedValueOnce({token: "new-refresh-token"} as never);

    const req = new NextRequest("http://localhost/api/auth/refresh", {
      method: "POST"
    });
    req.cookies.set("G_REFRESH_TOKEN", "valid-refresh-token");

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Tokens refreshed.");

    const setCookieHeader = response.headers.get("Set-Cookie") ?? "";
    expect(setCookieHeader).toContain("G_ACCESS_TOKEN=new-access-token");
    expect(setCookieHeader).toContain("G_REFRESH_TOKEN=new-refresh-token");
    expect(tokenCreateSpy).toHaveBeenCalledTimes(2);
  });
});

