import mongoose from "mongoose";

export interface IUserActivity {
  username: mongoose.Types.ObjectId;
  game: mongoose.Types.ObjectId;
  type: 'ADD_TO_LIBRARY' | 'REVIEW';
  rating?: mongoose.Types.ObjectId;
}

const userActivitySchema = new mongoose.Schema<IUserActivity>({
  username: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },
  type: {
    type: String,
    enum: ['ADD_TO_LIBRARY', 'REVIEW'],
    required: true,
  },
  rating: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rating",
  }
});

declare global {
  var UserActivity: mongoose.Model<IUserActivity>;
}

const UserActivity =
  globalThis.UserActivity ?? mongoose.model<IUserActivity>("UserActivity", userActivitySchema);

if (!globalThis.UserActivity) globalThis.UserActivity = UserActivity;

export { UserActivity };