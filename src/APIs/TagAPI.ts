import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi, PaginationObject, DEFAULT_PAGINATION } from "@/utils/http";
import { 
    Tag, 
    CreateTagData, 
    UpdateTagData, 
    TagFilters,
    TagContentResponse
} from "../types";

const API_PATH = '/api/tags';

export class TagAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    // ==================== CORE TAG CRUD OPERATIONS ====================

    /**
     * Get tags with comprehensive filtering via query parameters
     */
    public async getTags(
        filters: TagFilters = {},
        pagination: PaginationObject = DEFAULT_PAGINATION
    ) {
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
    public async getAll(pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this.getTags({}, pagination);
    }

    /**
     * Get trending tags
     */
    public async getTrending(pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this.getTags({ trending: true }, pagination);
    }

    /**
     * Get popular tags
     */
    public async getPopular(pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this.getTags({ popular: true }, pagination);
    }

    /**
     * Get verified tags
     */
    public async getVerified(pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this.getTags({ verified: true }, pagination);
    }

    /**
     * Get news tags
     */
    public async getNewsTags(pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this.getTags({ category: 'news' }, pagination);
    }

    /**
     * Get poll tags
     */
    public async getPollTags(pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this.getTags({ category: 'polls' }, pagination);
    }

    /**
     * Get specific tag by ID
     */
    public async getTagById(id: string) {
        return this._get<Tag>(`${API_PATH}/${id}`);
    }

    /**
     * Get tag by slug
     */
    public async getTagBySlug(slug: string) {
        return this._get<Tag>(`${API_PATH}/slug/${slug}`);
    }

    /**
     * Create new tag
     */
    public async createTag(data: CreateTagData) {
        return this._post<Tag>(API_PATH, data);
    }

    /**
     * Update existing tag
     */
    public async updateTag(id: string, data: UpdateTagData) {
        return this._put<Tag>(`${API_PATH}/${id}`, data);
    }

    /**
     * Delete tag
     */
    public async deleteTag(id: string) {
        await this._remove<void>(`${API_PATH}/${id}`);
    }

    // ==================== TAG CONTENT RELATIONSHIPS ====================

    /**
     * Get news articles with specific tag
     */
    public async getTagNews(
        tagId: string, 
        pagination: PaginationObject = DEFAULT_PAGINATION
    ) {
        return this._get<TagContentResponse>(
            `${API_PATH}/${tagId}/news`,
            { params: pagination }
        );
    }

    /**
     * Get polls with specific tag
     */
    public async getTagPolls(
        tagId: string, 
        pagination: PaginationObject = DEFAULT_PAGINATION
    ) {
        return this._get<TagContentResponse>(
            `${API_PATH}/${tagId}/polls`,
            { params: pagination }
        );
    }

    // ==================== TAG CONTENT MANAGEMENT ====================

    /**
     * Add tag to news article
     */
    public async addTagToNews(tagId: string, newsId: string) {
        return this._post<void>(
            `${API_PATH}/${tagId}/news/${newsId}`,
            {}
        );
    }

    /**
     * Remove tag from news article
     */
    public async removeTagFromNews(tagId: string, newsId: string) {
        return this._remove<void>(
            `${API_PATH}/${tagId}/news/${newsId}`
        );
    }

    /**
     * Add tag to poll
     */
    public async addTagToPoll(tagId: string, pollId: string) {
        return this._post<void>(
            `${API_PATH}/${tagId}/polls/${pollId}`,
            {}
        );
    }

    /**
     * Remove tag from poll
     */
    public async removeTagFromPoll(tagId: string, pollId: string) {
        return this._remove<void>(
            `${API_PATH}/${tagId}/polls/${pollId}`
        );
    }

    // ==================== ADMIN OPERATIONS ====================

    /**
     * Moderate tag (approve/reject)
     */
    public async moderateTag(tagId: string, statusId: number): Promise<Tag> {
        return this._patch<Tag>(
            `${API_PATH}/${tagId}/moderate`,
            { statusId }
        );
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
    ) {
        const params = { ...pagination, search: query };
        return this._list<Tag>(API_PATH, params);
    }

    /**
     * Get tag suggestions for autocomplete
     */
    public async getTagSuggestions(prefix: string, limit: number = 10): Promise<Tag[]> {
        const params = { prefix, limit };
        return this._get<Tag[]>(`${API_PATH}/suggestions`, { params });
    }

    // ==================== BACKWARD COMPATIBILITY ====================

    /** @deprecated Use getTagById instead */
    public async get(id: string): Promise<Tag> {
        return this.getTagById(id);
    }

    /** @deprecated Use createTag instead */
    public async create(data: CreateTagData): Promise<Tag> {
        return this.createTag(data);
    }

    /** @deprecated Use updateTag instead */
    public async update(id: string, data: UpdateTagData): Promise<Tag> {
        return this.updateTag(id, data);
    }

    /** @deprecated Use deleteTag instead */
    public async delete(id: string): Promise<void> {
        return this.deleteTag(id);
    }
}

export default TagAPI; 