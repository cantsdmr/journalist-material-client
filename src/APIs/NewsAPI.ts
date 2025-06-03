import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi, PaginationObject, DEFAULT_PAGINATION, PaginatedCollection, PaginatedResponse } from "@/utils/http";
import { 
    News, 
    CreateNewsData, 
    EditNewsData, 
    NewsFilters, 
    NewsStatsResponse, 
    NewsTagResponse 
} from "../types";

const API_PATH = '/api/news';

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
    ): Promise<PaginatedResponse<News>> {
        const params: any = { ...pagination };
        
        // Add filter parameters
        if (filters.feed) params.feed = 'true';
        if (filters.trending) params.trending = 'true';
        if (filters.subscribed) params.subscribed = 'true';
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
     * Get news feed
     */
    public async getFeed(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedResponse<News>> {
        return this.getNews({ feed: true }, pagination);
    }

    /**
     * Get trending news
     */
    public async getTrending(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedResponse<News>> {
        return this.getNews({ trending: true }, pagination);
    }

    /**
     * Get news from subscribed channels
     */
    public async getSubscribed(pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this.getNews({ subscribed: true }, pagination);
    }

    /**
     * Get premium news
     */
    public async getPremium(pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this.getNews({ premium: true }, pagination);
    }

    /**
     * Get news by channel
     */
    public async getNewsByChannel(channelId: string, pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this.getNews({ channel: channelId }, pagination);
    }

    /**
     * Get news by creator
     */
    public async getCreatorNews(creatorId: string, pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this.getNews({ creator: creatorId }, pagination);
    }

    /**
     * Get news by tags
     */
    public async getNewsByTags(tags: string[], pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this.getNews({ tags }, pagination);
    }

    /**
     * Get news by status
     */
    public async getNewsByStatus(status: string, pagination: PaginationObject = DEFAULT_PAGINATION) {
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
    public async update(id: string, data: EditNewsData): Promise<void> {
        await this._put<void>(`${API_PATH}/${id}`, data);
    }

    /**
     * Delete news article  
     */
    public async delete(id: string): Promise<void> {
        await this._remove<void>(`${API_PATH}/${id}`);
    }

    /**
     * Get news statistics/analytics
     */
    public async getNewsStats(id: string, startDate: string, endDate: string): Promise<NewsStatsResponse> {
        return this._get<NewsStatsResponse>(`${API_PATH}/${id}/stats?startDate=${startDate}&endDate=${endDate}`);
    }

    /**
     * Get all available news tags
     */
    public async getNewsTags(pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this._list<NewsTagResponse>(`${API_PATH}/tags`, pagination);
    }

    // ==================== BACKWARD COMPATIBILITY (DEPRECATED) ====================

    /**
     * @deprecated Use createNews instead
     */
    public async create(data: CreateNewsData): Promise<News> {
        return this.createNews(data);
    }
}