import mongoose from "mongoose";

export interface IContentFeed {
    title: string;
    description: string;
    concurrentPlayers?: number;
    price: number;
    feedImage?: string;
    game: mongoose.Types.ObjectId;
    type?: 'release' | 'sale' | 'update' | 'popular';
}

const contentFeedSchema = new mongoose.Schema<IContentFeed>({
    title: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    description: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    concurrentPlayers: {
        type: mongoose.Schema.Types.Number,
    },
    price: {
        type: mongoose.Schema.Types.Number,
        default: 0
    },
    feedImage: {
        type: mongoose.Schema.Types.String,
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    type: {
        type: mongoose.Schema.Types.String,
        enum: ['release', 'sale', 'update', 'popular'],
        required: false
    }
});

declare global {
    var ContentFeed: mongoose.Model<IContentFeed>;
}

const ContentFeed = globalThis.ContentFeed ?? mongoose.model<IContentFeed>('ContentFeed', contentFeedSchema);
if (!globalThis.ContentFeed) globalThis.ContentFeed = ContentFeed;

export { ContentFeed };