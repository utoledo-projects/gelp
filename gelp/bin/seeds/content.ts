import {games} from "./games";
import {ContentFeed} from "@/db";

for (const game of games) {
  try {
    await ContentFeed.create({
      title: game.title,
      summary: game.summary,
      feedImage: game.coverArt,
      game: game._id,
      type: 'release'
    });
  } catch {
    console.warn('[WARN] failed to create content feed entry.');
  }
}
