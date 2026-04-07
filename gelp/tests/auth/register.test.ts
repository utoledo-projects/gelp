import {NextRequest} from "next/server";

jest.mock("argon2", () => ({
  hash: jest.fn()
}));

import {POST} from "@/app/api/auth/register/route";
import {hash} from "argon2";
import {IUser, User} from "@/db/model/User";
import {HydratedDocument} from "mongoose";

const findOneSpy = jest.spyOn(User, "findOne");
const userCreateSpy = jest.spyOn(User, "create");
const hashMock = hash as jest.MockedFunction<typeof hash>;

const originalRestrictDomain = process.env.EMAIL_DOMAIN_RESTRICT_DOMAIN;
const originalAllowSubdomain = process.env.EMAIL_DOMAIN_RESTRICT_ALLOW_SUBDOMAIN;

const mockUserLookup = (user: HydratedDocument<IUser> | null) => {
  findOneSpy.mockReturnValue({
    exec: jest.fn().mockResolvedValue(user)
  } as never);
};

describe("Register API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.EMAIL_DOMAIN_RESTRICT_DOMAIN;
    delete process.env.EMAIL_DOMAIN_RESTRICT_ALLOW_SUBDOMAIN;
  });

  afterAll(() => {
    if (originalRestrictDomain === undefined)
      delete process.env.EMAIL_DOMAIN_RESTRICT_DOMAIN;
    else
      process.env.EMAIL_DOMAIN_RESTRICT_DOMAIN = originalRestrictDomain;

    if (originalAllowSubdomain === undefined)
      delete process.env.EMAIL_DOMAIN_RESTRICT_ALLOW_SUBDOMAIN;
    else
      process.env.EMAIL_DOMAIN_RESTRICT_ALLOW_SUBDOMAIN = originalAllowSubdomain;
  });

  it("Should return 400 if required fields are missing", async () => {
    const req = new NextRequest("http://localhost/api/auth/register", {
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
    const req = new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: "not a valid json value"
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid JSON");
    expect(findOneSpy).not.toHaveBeenCalled();
  });

  it("Should return 403 when registration domain is restricted", async () => {
    process.env.EMAIL_DOMAIN_RESTRICT_DOMAIN = "utoledo.edu";
    process.env.EMAIL_DOMAIN_RESTRICT_ALLOW_SUBDOMAIN = "false";

    const req = new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: "james",
        email: "james@example.com",
        password: "P@55w0rd"
      })
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Registration is restricted.");
    expect(findOneSpy).not.toHaveBeenCalled();
    expect(hashMock).not.toHaveBeenCalled();
    expect(userCreateSpy).not.toHaveBeenCalled();
  });

  it("Should return 400 if the email is already in use", async () => {
    mockUserLookup({
      email: "james@example.com",
      username: "differentuser"
    } as never);

    const req = new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: "james",
        email: "james@example.com",
        password: "P@55w0rd"
      })
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Email already in use");
    expect(hashMock).not.toHaveBeenCalled();
    expect(userCreateSpy).not.toHaveBeenCalled();
  });

  it("Should return 400 if the username is already in use", async () => {
    mockUserLookup({
      email: "other@example.com",
      username: "james"
    } as never);

    const req = new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: "james",
        email: "james@example.com",
        password: "P@55w0rd"
      })
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Username already in use");
    expect(hashMock).not.toHaveBeenCalled();
    expect(userCreateSpy).not.toHaveBeenCalled();
  });

  it("Should return 201 when registration succeeds", async () => {
    mockUserLookup(null);
    hashMock.mockResolvedValue("hashed-password");
    userCreateSpy.mockResolvedValue({} as never);

    const req = new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: "james",
        email: "james@example.com",
        password: "P@55w0rd"
      })
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe("Account registered successfully.");
    expect(hashMock).toHaveBeenCalledWith("P@55w0rd");
    expect(userCreateSpy).toHaveBeenCalledWith({
      username: "james",
      email: "james@example.com",
      password: "hashed-password"
    });
  });
});



