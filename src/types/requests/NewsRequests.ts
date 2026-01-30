import { NewsStatus, SocialPlatformType, NewsMediaType, NewsMediaFormat } from "@/enums/NewsEnums";

export type CreateNewsData = {
    title: string;
    content: string;
    channelId: string;
    tags?: string[];
    status?: NewsStatus;
    isPremium?: boolean;
    requiredTierId?: string;
    socialLinks?: Record<SocialPlatformType, string>;
    media?: {
        mediaTypeId: NewsMediaType;
        mediaFormatId: NewsMediaFormat;
        url: string;
    }[];
};

export type EditNewsData = {
    title?: string;
    content?: string;
    tags?: string[];
    status?: NewsStatus;
    isPremium?: boolean;
    requiredTierId?: string;
}; 