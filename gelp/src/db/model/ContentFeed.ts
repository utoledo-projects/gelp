import mongoose from "mongoose";

export interface IContentFeed {
    title: string;
    description: string;
    concurrentPlayers?: number;
    price: number;
    feedImage?: string;
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
    }
});

declare global {
    var ContentFeed: mongoose.Model<IContentFeed>;
}

const ContentFeed = globalThis.ContentFeed ?? mongoose.model<IContentFeed>('ContentFeed', contentFeedSchema);
if (!globalThis.ContentFeed) globalThis.ContentFeed = ContentFeed;

export { ContentFeed };