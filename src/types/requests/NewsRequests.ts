import { NEWS_STATUS } from "@/enums/NewsEnums";

export type CreateNewsData = {
    title: string;
    content: string;
    channelId: string;
    tags?: string[];
    status?: keyof typeof NEWS_STATUS;
    isPremium?: boolean;
    requiredTierId?: string;
    socialLinks?: Record<number, string>;
    media?: {
        mediaTypeId: number;
        mediaFormatId: number;
        url: string;
    }[];
};

export type EditNewsData = {
    title?: string;
    content?: string;
    tags?: string[];
    status?: keyof typeof NEWS_STATUS;
    isPremium?: boolean;
    requiredTierId?: string;
}; 