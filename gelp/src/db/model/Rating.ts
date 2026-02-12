import mongoose from "mongoose";

export interface IRating {
  user: mongoose.Types.ObjectId;
  game: mongoose.Types.ObjectId;
  score: number; // 0–10
  review?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new mongoose.Schema<IRating>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true, // intentionally no ref
  },
  score: {
    type: mongoose.Schema.Types.Number,
    required: true,
    min: 0,
    max: 10,
  },
  review: {
    type: mongoose.Schema.Types.String,
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    required: true,
    default: () => new Date(),
  },
  updatedAt: {
    type: mongoose.Schema.Types.Date,
    default: () => new Date(),
  },
});

declare global {
  var Rating: mongoose.Model<IRating>;
}

const Rating =
  globalThis.Rating ?? mongoose.model<IRating>("Rating", ratingSchema);

if (!globalThis.Rating) globalThis.Rating = Rating;

export { Rating };
