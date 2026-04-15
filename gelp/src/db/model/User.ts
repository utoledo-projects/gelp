import mongoose from "mongoose";

export interface IUser {
  username: string;
  email: string;
  emailVerified: boolean;
  password: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isAdministrator: boolean;
  following: mongoose.Types.ObjectId[]
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  emailVerified: {
    type: mongoose.Schema.Types.Boolean,
    required: true,
    default: false,
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  avatar: {
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
  isAdministrator: {
    type: mongoose.Schema.Types.Boolean,
    required: true,
    default: false
  },
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    default: []
  }]
});

declare global {
  var User: mongoose.Model<IUser>;
}

const User = globalThis.User ?? mongoose.model<IUser>('User', userSchema);
if (!globalThis.User) globalThis.User = User;

export { User };
