import { TagType, TagStatus } from "@/enums/TagEnums";

export type Tag = {
    id: string;
    name: string;
    slug: string;
    typeId: TagType;
    statusId: TagStatus;
    isVerified: boolean;
    isTrending: boolean;
    createdBy?: string;
    approvedBy?: string;
    approvedAt?: string;
    createdAt: string;
    updatedAt: string;
    analytics?: TagAnalytics;
};

export type TagAnalytics = {
    id: string;
    tagId: string;
    viewCount: number;
    searchCount: number;
    usageCount: number;
    lastTrendingAt?: string;
}; 