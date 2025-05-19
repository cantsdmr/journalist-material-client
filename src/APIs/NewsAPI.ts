import { NEWS_STATUS } from "@/enums/NewsEnums";
import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi, PaginationObject, DEFAULT_PAGINATION } from "@/utils/http";
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
    public createNews = (data: CreateNewsData) => {
        return this._post<News>(API_PATH, data);
    }

    public get = (id: string) => {
        return this._get<News>(`${API_PATH}/${id}`);
    }

    public update = (id: string, data: EditNewsData) => {
        return this._patch<News>(`${API_PATH}/${id}`, data);
    }

    public delete = (id: string) => {
        return this._remove<void>(`${API_PATH}/${id}`);
    }

    // News Lists
    public getNews = (pagination: PaginationObject = DEFAULT_PAGINATION) => {
        return this._list<News>(API_PATH, pagination);
    }

    public getTrending = (pagination: PaginationObject = DEFAULT_PAGINATION) => {
        return this._list<News>(`${API_PATH}/${SUB_PATH.TRENDING}`, pagination);
    }

    public getSubscribed = (pagination: PaginationObject = DEFAULT_PAGINATION) => {
        return this._list<News>(`${API_PATH}/${SUB_PATH.SUBSCRIBED}`, pagination);
    }

    public getFollowed = (pagination: PaginationObject = DEFAULT_PAGINATION) => {
        return this._list<News>(`${API_PATH}/${SUB_PATH.FOLLOWED}`, pagination);
    }

    public getNewsByTags = (tags: string[], pagination: PaginationObject = DEFAULT_PAGINATION) => {
        return this._list<News>(`${API_PATH}/${SUB_PATH.TAGS}/${tags.join(',')}`, pagination);
    }

    // Creator News
    public getCreatorNews = (creatorId: string, pagination: PaginationObject = DEFAULT_PAGINATION) => {
        return this._list<News>(`${API_PATH}/${SUB_PATH.CREATOR}/${creatorId}`, pagination);
    }

    // Tags
    public getTags = () => {
        return this._listAll<NewsTag>(`${API_PATH}/${SUB_PATH.TAGS}`);
    }
}