import mongoose from "mongoose";

export interface IGame {
    genre: string;
    title: string;
    developer: string;
    releaseDate: Date;
    dateAdded: Date;
    coverArt: string;
    icon: string;
}

const gameSchema = new mongoose.Schema<IGame>({
    title: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },

    genre:[{
        type: mongoose.Schema.Types.String,
        required: true,
    }],

    developer: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    releaseDate: {
        type: mongoose.Schema.Types.Date,
        required: true,
    },

    dateAdded: {
        type: mongoose.Schema.Types.Date,
        required: true,
    },
    coverArt: {
        type: mongoose.Schema.Types.String,
        unique: true,
    },
    icon: {
        type: mongoose.Schema.Types.String,
        unique: true,
    }
});

declare global {
  var Game: mongoose.Model<IGame>;
}

const Game = globalThis.Game ?? mongoose.model<IGame>('Game', gameSchema);
if (!globalThis.Game) globalThis.Game = Game;

export { Game };