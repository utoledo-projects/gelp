import mongoose from "mongoose";

export interface IGame {
    genre: string;
    title: string;
    developer: string;
    releaseDate: Date;
    dateAdded: Date;
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
    }
});

declare global {
  var Game: mongoose.Model<IGame>;
}

const Game = globalThis.Game ?? mongoose.model<IGame>('Game', gameSchema);
if (!globalThis.Game) globalThis.Game = Game;

export { Game };