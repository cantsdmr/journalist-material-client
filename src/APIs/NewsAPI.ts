import { NEWS_STATUS } from "@/enums/NewsEnums";
import { AxiosJournalist } from "../util/axios";
import { PaginatedCollection, HTTPApi, Collection } from "../util/http";
import { Channel } from "./ChannelAPI";
import { User } from "./UserAPI";

export type News = {
    id: string;
    title: string;
    content: string;
    channelId: string;
    status: keyof typeof NEWS_STATUS;
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
}

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
}

export type SocialLink = {
    id: string;
    newsId: string;
    platform: number;
    url: string;
}

export type NewsMedia = {
    id: string;
    newsId: string;
    type: number;
    format: number;
    url: string;
}

export interface NewsTag {
    id: string;
    tagId: string;
    title: string;
  }

export type CreateNewsData = Omit<News, "id" | "fund_id" | "created_by">
export type EditNewsData = Omit<News, "id" | "fund_id" | "created_by">

const API_PATH = '/api/news'
const SUB_PATH = {
    MOST_POPULAR: 'most-popular',
    TAGS: 'tags',
    FOLLOWED: 'followed',
    SUBSCRIBED: 'subscribed'
}

export class NewsAPI extends HTTPApi<News, CreateNewsData, EditNewsData> {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    // get most popular news
    public getMostPopular = async (page: number = 1, limit: number = 10): Promise<PaginatedCollection<News>> => {
        return this.list(SUB_PATH.MOST_POPULAR, {
            // order: 'desc',
            limit: limit,
            page: page
        });
    }

    // get subscribed channel news
    public getSubscribed = async (page: number = 1, limit: number = 10): Promise<PaginatedCollection<News>> => {
        return this.list(SUB_PATH.SUBSCRIBED, {
            // order: 'desc',
            limit: limit,
            page: page
        });
    }

    public getFollowed = async (page: number = 1, limit: number = 10): Promise<PaginatedCollection<News>> => {
        return this.list(SUB_PATH.FOLLOWED, {
            // order: 'desc',
            limit: limit,
            page: page
        });
    }

    // get news tags
    public getNewsTags = async (): Promise<Collection<NewsTag>> => {
        return this.listAll(SUB_PATH.TAGS);
    }
}