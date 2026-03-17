import getUser from "@/actions/getUser";
import { NextRequest, NextResponse } from "next/server";

async function getIGDBToken(): Promise<string> {
  const clientId = process.env.IGDB_CLIENT_ID;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("IGDB_CLIENT_ID and IGDB_CLIENT_SECRET must be set in .env.local");
  }

  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: "POST" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch IGDB token");
  }

  const data = await res.json();
  return data.access_token;
}

export async function GET(req: NextRequest) {

  // Begin Auth Check
  const access = req.cookies.get('G_ACCESS_TOKEN');
  const user = await getUser(access?.value);
  if (user === null)
    return new NextResponse(JSON.stringify({ error: 'Unauthorized.' }), { status: 401 });
  if (!user.isAdministrator)
    return new NextResponse(JSON.stringify({ error: 'Forbidden.' }), { status: 403 });
  // End auth check
  const limit = req.nextUrl.searchParams.get("limit") ?? "10";

  try {
    const token = await getIGDBToken();
    const clientId = process.env.IGDB_CLIENT_ID!;

    const body = `
      fields id, name, genres.name, involved_companies.company.name, involved_companies.developer,
             first_release_date, cover.url, summary, rating, total_rating;
      where rating != null & rating_count > 100 & version_parent = null;
      sort total_rating desc;
      limit ${parseInt(limit, 10)};
    `;

    const res = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body,
    });

    if (!res.ok) {
      throw new Error(`IGDB API error: ${res.status}`);
    }

    const games = await res.json();
    return NextResponse.json(games);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
