import mongoose from "mongoose";

export interface IContentFeed {
    title: string;
    summary: string;
    feedImage?: string;
    game: mongoose.Types.ObjectId;
    type?: 'release' | 'update' | 'popular' | 'recommendation';
}

const contentFeedSchema = new mongoose.Schema<IContentFeed>({
    title: {
        type: mongoose.Schema.Types.String,
        required: false
    },
    summary: {
        type: mongoose.Schema.Types.String,
        required: false
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
        enum: ['release', 'update', 'popular', 'recommendation'],
        required: false
    }
});

declare global {
    var ContentFeed: mongoose.Model<IContentFeed>;
}

const ContentFeed = globalThis.ContentFeed ?? mongoose.model<IContentFeed>('ContentFeed', contentFeedSchema);
if (!globalThis.ContentFeed) globalThis.ContentFeed = ContentFeed;

export { ContentFeed };