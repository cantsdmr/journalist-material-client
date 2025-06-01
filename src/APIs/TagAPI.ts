import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi, PaginationObject, DEFAULT_PAGINATION, PaginatedCollection } from "@/utils/http";
import { News } from "./NewsAPI";
import { Poll } from "./PollAPI";

export type Tag = {
    id: string;
    name: string;
    slug: string;
    typeId: number;
    statusId: number;
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

export type CreateTagData = {
    name: string;
    typeId?: number;
};

export type UpdateTagData = {
    name?: string;
    typeId?: number;
    statusId?: number;
    isVerified?: boolean;
    isTrending?: boolean;
};

export type TagFilters = {
    trending?: boolean;
    popular?: boolean;
    category?: 'news' | 'polls';
    verified?: boolean;
};

export type TagContentResponse = {
    items: News[] | Poll[];
    metadata: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
};

export type TagManagementResponse = {
    success: boolean;
    message: string;
};

// Response wrapper types
export type ApiResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
};

const API_PATH = '/api/tags';

export class TagAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    // ==================== CORE TAG CRUD OPERATIONS ====================

    /**
     * Get tags with comprehensive filtering via query parameters
     * Supports: trending, popular, category, verified
     */
    public async getTags(
        filters: TagFilters = {},
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedCollection<Tag>> {
        const params: any = { ...pagination };
        
        // Add filter parameters
        if (filters.trending) params.trending = 'true';
        if (filters.popular) params.popular = 'true';
        if (filters.category) params.category = filters.category;
        if (filters.verified) params.verified = 'true';

        return this._list<Tag>(API_PATH, params);
    }

    /**
     * Get all tags (default)
     */
    public async getAll(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Tag>> {
        return this.getTags({}, pagination);
    }

    /**
     * Get trending tags
     */
    public async getTrending(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Tag>> {
        return this.getTags({ trending: true }, pagination);
    }

    /**
     * Get popular tags
     */
    public async getPopular(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Tag>> {
        return this.getTags({ popular: true }, pagination);
    }

    /**
     * Get verified tags
     */
    public async getVerified(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Tag>> {
        return this.getTags({ verified: true }, pagination);
    }

    /**
     * Get news tags
     */
    public async getNewsTags(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Tag>> {
        return this.getTags({ category: 'news' }, pagination);
    }

    /**
     * Get poll tags
     */
    public async getPollTags(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Tag>> {
        return this.getTags({ category: 'polls' }, pagination);
    }

    /**
     * Get specific tag by ID
     */
    public async getTagById(id: string): Promise<Tag> {
        const response = await this._get<ApiResponse<Tag>>(`${API_PATH}/${id}`);
        return response.data;
    }

    /**
     * Get tag by slug
     */
    public async getTagBySlug(slug: string): Promise<Tag> {
        const response = await this._get<ApiResponse<Tag>>(`${API_PATH}/slug/${slug}`);
        return response.data;
    }

    /**
     * Create new tag
     */
    public async createTag(data: CreateTagData): Promise<Tag> {
        const response = await this._post<ApiResponse<Tag>>(API_PATH, data);
        return response.data;
    }

    /**
     * Update existing tag
     */
    public async updateTag(id: string, data: UpdateTagData): Promise<Tag> {
        const response = await this._put<ApiResponse<Tag>>(`${API_PATH}/${id}`, data);
        return response.data;
    }

    /**
     * Delete tag
     */
    public async deleteTag(id: string): Promise<void> {
        await this._remove<void>(`${API_PATH}/${id}`);
    }

    // ==================== TAG CONTENT RELATIONSHIPS ====================

    /**
     * Get news articles with specific tag
     */
    public async getTagNews(
        tagId: string, 
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<TagContentResponse> {
        const response = await this._get<ApiResponse<TagContentResponse>>(
            `${API_PATH}/${tagId}/news`,
            { params: pagination }
        );
        return response.data;
    }

    /**
     * Get polls with specific tag
     */
    public async getTagPolls(
        tagId: string, 
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<TagContentResponse> {
        const response = await this._get<ApiResponse<TagContentResponse>>(
            `${API_PATH}/${tagId}/polls`,
            { params: pagination }
        );
        return response.data;
    }

    // ==================== TAG CONTENT MANAGEMENT ====================

    /**
     * Add tag to news article
     */
    public async addTagToNews(tagId: string, newsId: string): Promise<TagManagementResponse> {
        const response = await this._post<ApiResponse<TagManagementResponse>>(
            `${API_PATH}/${tagId}/news/${newsId}`,
            {}
        );
        return response.data;
    }

    /**
     * Remove tag from news article
     */
    public async removeTagFromNews(tagId: string, newsId: string): Promise<TagManagementResponse> {
        const response = await this._remove<ApiResponse<TagManagementResponse>>(
            `${API_PATH}/${tagId}/news/${newsId}`
        );
        return response.data;
    }

    /**
     * Add tag to poll
     */
    public async addTagToPoll(tagId: string, pollId: string): Promise<TagManagementResponse> {
        const response = await this._post<ApiResponse<TagManagementResponse>>(
            `${API_PATH}/${tagId}/polls/${pollId}`,
            {}
        );
        return response.data;
    }

    /**
     * Remove tag from poll
     */
    public async removeTagFromPoll(tagId: string, pollId: string): Promise<TagManagementResponse> {
        const response = await this._remove<ApiResponse<TagManagementResponse>>(
            `${API_PATH}/${tagId}/polls/${pollId}`
        );
        return response.data;
    }

    // ==================== ADMIN OPERATIONS ====================

    /**
     * Moderate tag (approve/reject)
     */
    public async moderateTag(tagId: string, statusId: number): Promise<Tag> {
        const response = await this._patch<ApiResponse<Tag>>(
            `${API_PATH}/${tagId}/moderate`,
            { statusId }
        );
        return response.data;
    }

    /**
     * Approve tag
     */
    public async approveTag(tagId: string): Promise<Tag> {
        return this.moderateTag(tagId, 2); // Assuming 2 is APPROVED status
    }

    /**
     * Reject tag
     */
    public async rejectTag(tagId: string): Promise<Tag> {
        return this.moderateTag(tagId, 3); // Assuming 3 is REJECTED status
    }

    // ==================== CONVENIENCE METHODS ====================

    /**
     * Search tags by name/prefix
     */
    public async searchTags(
        query: string,
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedCollection<Tag>> {
        const params = { ...pagination, search: query };
        return this._list<Tag>(API_PATH, params);
    }

    /**
     * Get tag suggestions for autocomplete
     */
    public async getTagSuggestions(prefix: string, limit: number = 10): Promise<Tag[]> {
        const params = { prefix, limit };
        const response = await this._get<ApiResponse<Tag[]>>(`${API_PATH}/suggestions`, { params });
        return response.data;
    }

    // ==================== BACKWARD COMPATIBILITY ====================

    /**
     * @deprecated Use getTagById instead
     */
    public async get(id: string): Promise<Tag> {
        return this.getTagById(id);
    }

    /**
     * @deprecated Use createTag instead
     */
    public async create(data: CreateTagData): Promise<Tag> {
        return this.createTag(data);
    }

    /**
     * @deprecated Use updateTag instead
     */
    public async update(id: string, data: UpdateTagData): Promise<Tag> {
        return this.updateTag(id, data);
    }

    /**
     * @deprecated Use deleteTag instead
     */
    public async delete(id: string): Promise<void> {
        return this.deleteTag(id);
    }
}

export default TagAPI; 