import {users} from "./users";
import {games} from './games';
import _ from 'lodash';
import {UserActivity} from "@/db";

const negativeReviewTexts = [
  "This game had potential, but it feels unfinished and buggy.",
  "The gameplay gets repetitive way too quickly.",
  "I ran into constant crashes and performance issues.",
  "The story is bland and didn’t keep me interested.",
  "Controls feel clunky and unresponsive at times.",
  "Definitely not worth the price in its current state.",
  "The AI is frustratingly bad and immersion-breaking.",
  "There’s just not enough content to justify playing long-term.",
  "Graphics are underwhelming compared to similar games.",
  "Multiplayer is laggy and poorly optimized.",
  "The grind is excessive and not rewarding.",
  "I expected more depth from the mechanics.",
  "Too many microtransactions for a full-priced game.",
  "The tutorial doesn’t explain things clearly at all.",
  "Feels like a copy of better games but worse.",
  "Updates have been slow and haven’t fixed major issues.",
  "Sound design is forgettable and repetitive.",
  "Matchmaking is unbalanced and frustrating.",
  "It gets boring after just a few hours.",
  "Overall, a disappointing experience."
];

const positiveReviewTexts = [
  "Really fun and engaging from start to finish.",
  "The gameplay is smooth and very satisfying.",
  "I love the attention to detail in the world.",
  "Great value for the price.",
  "The story kept me hooked the whole time.",
  "Controls feel intuitive and responsive.",
  "Plenty of content to keep you busy for hours.",
  "Graphics and visuals are stunning.",
  "The soundtrack fits perfectly with the gameplay.",
  "Multiplayer is well-designed and enjoyable.",
  "Progression feels rewarding and balanced.",
  "Developers clearly put a lot of care into this.",
  "Easy to pick up but has depth for experienced players.",
  "Regular updates keep things fresh.",
  "The mechanics are polished and well thought out.",
  "A great mix of challenge and fun.",
  "One of the best games I’ve played recently.",
  "The community is active and welcoming.",
  "Runs smoothly with very few bugs.",
  "Highly recommend giving it a try."
];

const selectNegativeReviewText = () => {
  const index = Math.floor(Math.random() * negativeReviewTexts.length);
  return negativeReviewTexts[index];
}

const selectPositiveReviewText = () => {
  const index = Math.floor(Math.random() * positiveReviewTexts.length);
  return positiveReviewTexts[index];
}

for (const user of users) {
  // Select 40-50 games
  const negative = Math.floor(Math.random() * 5) + 5; // 5-9 negative reviews
  const positive = Math.floor(Math.random() * 10) + 30; // 30-39 positive reviews
  const selected = _.sampleSize(games, positive + negative);

  for (let i = 0; i < negative; i++) {
    // Negative reviews
    try {
      const hasText = Math.floor(Math.random() * 100) < 20; // 20% chance to have text
      const text = hasText ? selectNegativeReviewText() : undefined;
      const rating = await Rating.create({
        user: user._id,
        game: selected[i]._id,
        score: Math.floor(Math.random() * 4) + 1, // between 1 and 5
        review: text
      });
      await User.updateOne({_id: user._id}, {$addToSet: {library: selected[i]._id}});
      const ratingTime = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // Random time within the last 7 days
      await UserActivity.create({
        type: 'ADD_TO_LIBRARY',
        user: user._id,
        game: selected[i]._id,
        timestamp: new Date(Date.now() - ratingTime - Math.floor(Math.random() * 3 + 1) * 24 * 60 * 60 * 1000), // 1 - 3 days before rating
      });
      await UserActivity.create({
        type: 'REVIEW',
        user: user._id,
        game: selected[i]._id,
        rating: rating._id,
        timestamp: new Date(Date.now() - ratingTime)
      });
    } catch (e) {
      console.error(e);
      console.warn('[WARN] Failed to create a rating.');
    }
  }

  for (let i = negative; i < negative + positive; i++) {
    // Positive reviews
    try {
      const hasText = Math.floor(Math.random() * 100) < 20;
      const text = hasText ? selectPositiveReviewText() : undefined;
      const rating = await Rating.create({
        user: user._id,
        game: selected[i]._id,
        score: Math.floor(Math.random() * 6) + 5, // between 5 and 10
        review: text
      });
      await User.updateOne({_id: user._id}, {$addToSet: {library: selected[i]._id}});
      const ratingTime = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // Random time within the last 7 days
      await UserActivity.create({
        type: 'REVIEW',
        user: user._id,
        game: selected[i]._id,
        rating: rating._id,
        timestamp: new Date(Date.now() - ratingTime)
      });
    } catch {
      console.warn('[WARN] Failed to create a rating.');
    }
  }
}
