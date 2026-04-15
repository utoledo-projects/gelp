import { NextRequest, NextResponse } from 'next/server';
import { Game } from '@/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const games = await Game.find({
      title: { $regex: query, $options: 'i' }
    })
    .limit(10)
    .select('_id title coverArt')
    .lean();

    const result = games.map((game: any) => ({
      id: game._id.toString(),
      title: game.title,
      coverArt: game.coverArt,
    }));
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}