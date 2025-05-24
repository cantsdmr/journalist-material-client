import { NEWS_STATUS } from "@/enums/NewsEnums";
import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi, PaginationObject, DEFAULT_PAGINATION, PaginatedCollection } from "@/utils/http";
import { Channel } from "./ChannelAPI";
import { User } from "./UserAPI";

export type News = {
    id: string; // generated
    title: string;
    content: string;
    channelId: string;
    status: keyof typeof NEWS_STATUS;
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
    TRENDING: 'trending',
    TAGS: 'tags',
    FOLLOWED: 'followed',
    SUBSCRIBED: 'subscribed',
    CREATOR: 'creator'
}

export class NewsAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    // News CRUD
    public async createNews(data: CreateNewsData): Promise<News> {
        return this._post<News>(API_PATH, data);
    }

    public async get(id: string): Promise<News> {
        return this._get<News>(`${API_PATH}/${id}`);
    }

    public async update(id: string, data: EditNewsData): Promise<News> {
        return this._patch<News>(`${API_PATH}/${id}`, data);
    }

    public async delete(id: string): Promise<void> {
        return this._remove<void>(`${API_PATH}/${id}`);
    }

    // News Lists
    public async getNews(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<News>> {
        return this._list<News>(API_PATH, pagination);
    }

    public async getTrending(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<News>> {
        return this._list<News>(`${API_PATH}/${SUB_PATH.TRENDING}`, pagination);
    }

    public async getSubscribed(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<News>> {
        return this._list<News>(`${API_PATH}/${SUB_PATH.SUBSCRIBED}`, pagination);
    }

    public async getFollowed(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<News>> {
        return this._list<News>(`${API_PATH}/${SUB_PATH.FOLLOWED}`, pagination);
    }

    public async getNewsByTags(tags: string[], pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<News>> {
        return this._list<News>(`${API_PATH}/${SUB_PATH.TAGS}/${tags.join(',')}`, pagination);
    }

    // Creator News
    public async getCreatorNews(creatorId: string, pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<News>> {
        return this._list<News>(`${API_PATH}/${SUB_PATH.CREATOR}/${creatorId}`, pagination);
    }

    // Tags
    public async getTags(): Promise<PaginatedCollection<NewsTag>> {
        return this._list<NewsTag>(`${API_PATH}/${SUB_PATH.TAGS}`);
    }
}