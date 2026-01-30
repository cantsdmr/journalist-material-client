import { NewsStatus, SocialPlatformType, NewsMediaType, NewsMediaFormat } from "@/enums/NewsEnums";
import { AccessInfo } from "../ApiTypes";
import { Channel } from "./Channel";
import { User } from "./User";

export type News = {
    id: string; // generated
    title: string;
    content: string;
    channelId: string;
    status: NewsStatus;
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

    // bookmark status
    isBookmarked?: boolean;
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
    platform: SocialPlatformType;
    url: string;
};

export type NewsMedia = {
    id: string;
    newsId: string;
    type: NewsMediaType;
    format: NewsMediaFormat;
    url: string;
};

export type NewsTag = {
    id: string;
    tagId: string;
    title: string;
}; 