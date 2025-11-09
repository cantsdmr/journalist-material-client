// import { NEWS_STATUS } from "@/enums/NewsEnums";
import { Channel } from "./Channel";
import { User } from "./User";

export type AccessInfo = {
    canAccess: boolean;
    requiresPremium: boolean;
    reason?: string | null;
    requiredTierName?: string | null;
};

export type News = {
    id: string; // generated
    title: string;
    content: string;
    channelId: string;
    status: number;
    requiredTierId: string;
    isPremium: boolean;

    // relations
    newsFund: any;
    creator: User;
    channel: Channel;
    qualityMetrics: QualityMetrics;
    tags: NewsTag[];
    socialLinks: SocialLink[];
    media: NewsMedia[];
    publishedAt: string;
    createdAt: string;
    updatedAt: string;

    // access control
    accessInfo?: AccessInfo;
};

export type QualityMetrics = {
    id: string;
    correctnessScore: number;
    objectivityScore: number;
    ethicalValueScore: number;
    sourcingQualityScore: number;
    relevanceScore: number;
    clarityScore: number;
    timelinessScore: number;
    overallQualityScore: number;
};

export type SocialLink = {
    id: string;
    newsId: string;
    platform: number;
    url: string;
};

export type NewsMedia = {
    id: string;
    newsId: string;
    type: number;
    format: number;
    url: string;
};

export type NewsTag = {
    id: string;
    tagId: string;
    title: string;
}; 