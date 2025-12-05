import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi, PaginationObject, DEFAULT_PAGINATION, PaginatedResponse } from "@/utils/http";
import { 
    Poll, 
    CreatePollData, 
    UpdatePollData, 
    PollFilters,
    VotingEligibilityResponse
} from "../../types";

const API_PATH = '/api/polls';
   
export class PollAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    // ==================== MAIN POLLS ENDPOINT WITH FILTERING ====================

    /**
     * Get polls with comprehensive filtering via query parameters
     * Supports: trending, funded, claimed, channel, creator, subscribed, etc.
     */
    public async getPolls(
        filters: PollFilters = {}, 
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedResponse<Poll>> {
        const params: any = { ...pagination };
        
        // Add filter parameters
        if (filters.trending) params.trending = 'true';
        if (filters.funded) params.funded = 'true';
        if (filters.claimed) params.claimed = 'true';
        if (filters.subscribed) params.subscribed = 'true';
        if (filters.channel) params.channel = filters.channel;
        if (filters.creator) params.creator = filters.creator;
        if (filters.status) params.status = filters.status;
        if (filters.converted !== undefined) params.converted = filters.converted.toString();
        if (filters.tags && filters.tags.length > 0) params.tags = filters.tags.join(',');

        return this._list<Poll>(API_PATH, params);
    }

    // ==================== CONVENIENCE METHODS ====================

    /**
     * Get all polls (default)
     */
    public async getAll(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedResponse<Poll>> {
        return this.getPolls({}, pagination);
    }

    /**
     * Get trending polls
     */
    public async getTrending(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedResponse<Poll>> {
        return this.getPolls({ trending: true }, pagination);
    }

    /**
     * Get funded polls
     */
    public async getFunded(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedResponse<Poll>> {
        return this.getPolls({ funded: true }, pagination);
    }

    /**
     * Get claimed polls (user's claimed polls)
     */
    public async getClaimed(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedResponse<Poll>> {
        return this.getPolls({ claimed: true }, pagination);
    }

    /**
     * Get polls from subscribed channels
     */
    public async getSubscribed(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedResponse<Poll>> {
        return this.getPolls({ subscribed: true }, pagination);
    }

    /**
     * Get polls by channel
     */
    public async getPollsByChannel(channelId: string, pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedResponse<Poll>> {
        return this.getPolls({ channel: channelId }, pagination);
    }

    /**
     * Get polls by creator
     */
    public async getCreatorPolls(userId: string, pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedResponse<Poll>> {
        return this.getPolls({ creator: userId }, pagination);
    }

    /**
     * Get polls by tags
     */
    public async getPollsByTags(tags: string[], pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedResponse<Poll>> {
        return this.getPolls({ tags }, pagination);
    }

    // ==================== INDIVIDUAL POLL OPERATIONS ====================

    /**
     * Get specific poll by ID
     */
    public async get(id: string): Promise<Poll> {
        return this._get<Poll>(`${API_PATH}/${id}`);
    }

    /**
     * Create new poll
     */
    public async create(data: CreatePollData): Promise<Poll> {
        return this._post<Poll>(API_PATH, data);
    }

    /**
     * Update poll
     */
    public async update(id: string, data: UpdatePollData): Promise<void> {
        await this._put<void>(`${API_PATH}/${id}`, data);
    }

    /**
     * Delete poll
     */
    public async delete(id: string): Promise<void> {
        return this._remove<void>(`${API_PATH}/${id}`);
    }

    // ==================== POLL SUB-RESOURCES ====================

    /**
     * Get poll results/votes
     */
    public async getResults(id: string): Promise<any> {
        return this._get<any>(`${API_PATH}/${id}/votes`);
    }

    /**
     * Vote on poll
     */
    public async vote(id: string, data: any) {
        return this._post<void>(`${API_PATH}/${id}/votes`, data);
    }

    /**
     * Get user's vote for poll
     */
    public async getUserVote(id: string): Promise<{ optionId: string | null }> {
        return this._get<{ optionId: string | null }>(`${API_PATH}/${id}/votes/me`);
    }

    /**
     * Check if user can vote on poll
     */
    public async checkVotingEligibility(id: string): Promise<VotingEligibilityResponse> {
        return this._get<VotingEligibilityResponse>(`${API_PATH}/${id}/votes/eligibility`);
    }

    /**
     * Get poll funding information
     */
    public async getFunding(id: string): Promise<any> {
        return this._get<any>(`${API_PATH}/${id}/funding`);
    }

    // ==================== POLL ACTIONS (RESOURCE-BASED) ====================

    /**
     * Claim poll (create claim)
     */
    public async claim(id: string): Promise<Poll> {
        return this._post<Poll>(`${API_PATH}/${id}/claims`, {});
    }

    /**
     * Convert poll to news (create conversion)
     */
    public async convertToNews(id: string, newsData: any): Promise<any> {
        return this._post<any>(`${API_PATH}/${id}/conversions`, newsData);
    }

    // ==================== BACKWARD COMPATIBILITY (DEPRECATED) ====================

    /**
     * @deprecated Use getResults(id) instead
     */
    public async getVoteResults(id: string): Promise<any> {
        return this.getResults(id);
    }

    /**
     * @deprecated Use getUserVote(id) instead
     */
    public async getMyVote(id: string): Promise<{ optionId: string | null }> {
        return this.getUserVote(id);
    }
}