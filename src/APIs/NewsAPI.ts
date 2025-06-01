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

// Query parameter types for filtering
export type NewsFilters = {
    trending?: boolean;
    subscribed?: boolean;
    followed?: boolean;
    channel?: string;
    creator?: string;
    status?: string;
    premium?: boolean;
    tags?: string[];
};

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

    // ==================== MAIN NEWS ENDPOINT WITH FILTERING ====================

    /**
     * Get news with comprehensive filtering via query parameters
     * Supports: trending, subscribed, followed, channel, creator, status, premium, tags
     */
    public async getNews(
        filters: NewsFilters = {},
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedCollection<News>> {
        const params: any = { ...pagination };
        
        // Add filter parameters
        if (filters.trending) params.trending = 'true';
        if (filters.subscribed) params.subscribed = 'true';
        if (filters.followed) params.followed = 'true';
        if (filters.channel) params.channel = filters.channel;
        if (filters.creator) params.creator = filters.creator;
        if (filters.status) params.status = filters.status;
        if (filters.premium !== undefined) params.premium = filters.premium.toString();
        if (filters.tags && filters.tags.length > 0) params.tags = filters.tags.join(',');

        return this._list<News>(API_PATH, params);
    }

    // ==================== CONVENIENCE METHODS ====================

    /**
     * Get all news (default)
     */
    public async getAll(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<News>> {
        return this.getNews({}, pagination);
    }

    /**
     * Get trending news
     */
    public async getTrending(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<News>> {
        return this.getNews({ trending: true }, pagination);
    }

    /**
     * Get news from subscribed channels
     */
    public async getSubscribed(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<News>> {
        return this.getNews({ subscribed: true }, pagination);
    }

    /**
     * Get news from followed creators
     */
    public async getFollowed(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<News>> {
        return this.getNews({ followed: true }, pagination);
    }

    /**
     * Get premium news
     */
    public async getPremium(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<News>> {
        return this.getNews({ premium: true }, pagination);
    }

    /**
     * Get news by channel
     */
    public async getNewsByChannel(channelId: string, pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<News>> {
        return this.getNews({ channel: channelId }, pagination);
    }

    /**
     * Get news by creator
     */
    public async getCreatorNews(creatorId: string, pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<News>> {
        return this.getNews({ creator: creatorId }, pagination);
    }

    /**
     * Get news by tags
     */
    public async getNewsByTags(tags: string[], pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<News>> {
        return this.getNews({ tags }, pagination);
    }

    /**
     * Get news by status
     */
    public async getNewsByStatus(status: string, pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<News>> {
        return this.getNews({ status }, pagination);
    }

    // ==================== INDIVIDUAL NEWS OPERATIONS ====================

    /**
     * Get specific news by ID
     */
    public async get(id: string): Promise<News> {
        return this._get<News>(`${API_PATH}/${id}`);
    }

    /**
     * Create news article
     */
    public async createNews(data: CreateNewsData): Promise<News> {
        return this._post<News>(API_PATH, data);
    }

    /**
     * Update news article
     */
    public async update(id: string, data: EditNewsData): Promise<News> {
        return this._patch<News>(`${API_PATH}/${id}`, data);
    }

    /**
     * Delete news article
     */
    public async delete(id: string): Promise<void> {
        return this._remove<void>(`${API_PATH}/${id}`);
    }

    // ==================== NEWS TAGS ====================

    /**
     * Get all available news tags
     */
    public async getTags(): Promise<PaginatedCollection<NewsTag>> {
        return this._list<NewsTag>(`${API_PATH}/${SUB_PATH.TAGS}`);
    }

    // ==================== BACKWARD COMPATIBILITY (DEPRECATED) ====================

    /**
     * @deprecated Use createNews instead
     */
    public async create(data: CreateNewsData): Promise<News> {
        return this.createNews(data);
    }
}