import { POST } from "@/app/api/ratings/route";

describe("Ratings API", () => {
  it("returns response when called", async () => {
    const req = {
      json: async () => ({
        score: 8,
        userId: "123",
        gameId: "456",
      }),
    } as any;

    const res = await POST(req);

    expect(res).toBeDefined();
  });
});