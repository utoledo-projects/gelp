import mongoose from "mongoose";
import {randomBytes} from "node:crypto";

export interface IToken {
  user: mongoose.Types.ObjectId;
  type: 'access' | 'refresh';
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

const tokenSchema = new mongoose.Schema<IToken>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: mongoose.Schema.Types.String,
    enum: ['access', 'refresh'],
    required: true
  },
  token: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
    validate: /[a-f0-9]{64}/,
    default: () => randomBytes(32).toString('hex')
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    required: true,
    default: () => new Date()
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date,
    required: true
  }
});

declare global {
  var Token: mongoose.Model<IToken>;
}

const Token = globalThis.Token ?? mongoose.model<IToken>('Token', tokenSchema);

if (!globalThis.Token) globalThis.Token = Token;

export { Token };
