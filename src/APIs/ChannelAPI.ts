import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi, PaginationObject, DEFAULT_PAGINATION, PaginatedCollection } from "@/utils/http";
import { 
    Channel, 
    ChannelTier, 
    ChannelSubscription,
    CreateChannelData, 
    EditChannelData, 
    CreateChannelTierData, 
    EditChannelTierData, 
    ChannelSubscribeData, 
    ChannelFilters 
} from "../types";

const API_PATH = '/api/channels';
const SUB_PATH = {
    TIER: 'tiers',
    SUBSCRIPTIONS: 'subscriptions'
};

export class ChannelAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    // ==================== MAIN CHANNELS ENDPOINT WITH FILTERING ====================

    /**
     * Get channels with comprehensive filtering via query parameters
     */
    public async getChannels(
        filters: ChannelFilters = {},
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedCollection<Channel>> {
        const params: any = { ...pagination };
        
        // Add filter parameters
        if (filters.trending) params.trending = 'true';
        if (filters.popular) params.popular = 'true';
        if (filters.subscribed) params.subscribed = 'true';
        if (filters.followed) params.followed = 'true';
        if (filters.verified) params.verified = 'true';
        if (filters.creator) params.creator = filters.creator;
        if (filters.category) params.category = filters.category;
        if (filters.tags && filters.tags.length > 0) params.tags = filters.tags.join(',');

        return this._list<Channel>(API_PATH, params);
    }

    /**
     * Get all channels (default)
     */
    public async getAll(pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this.getChannels({}, pagination);
    }

    /**
     * Get trending channels
     */
    public async getTrending(pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this.getChannels({ trending: true }, pagination);
    }

    /**
     * Get popular channels
     */
    public async getPopular(pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this.getChannels({ popular: true }, pagination);
    }

    /**
     * Get subscribed channels
     */
    public async getSubscribed(pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this.getChannels({ subscribed: true }, pagination);
    }

    /**
     * Get followed channels
     */
    public async getFollowed(pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this.getChannels({ followed: true }, pagination);
    }

    /**
     * Get verified channels
     */
    public async getVerified(pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this.getChannels({ verified: true }, pagination);
    }

    // ==================== INDIVIDUAL CHANNEL OPERATIONS ====================

    public async createChannel(data: CreateChannelData) {
        return this._post<Channel>(API_PATH, data);
    }

    public async getChannel(channelId: string) {
        return this._get<Channel>(`${API_PATH}/${channelId}`);
    }

    public async getCreatorChannels(userId: string, pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this.getChannels({ creator: userId }, pagination);
    }

    public async updateChannel(channelId: string, data: EditChannelData) {
        await this._put<void>(`${API_PATH}/${channelId}`, data);
    }

    public async deleteChannel(channelId: string) {
        return this._remove<void>(`${API_PATH}/${channelId}`);
    }

    // ==================== TIER OPERATIONS ====================

    public async createTier(channelId: string, data: CreateChannelTierData) {
        return this._post<ChannelTier>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}`, data);
    }

    public async updateTier(channelId: string, tierId: string, data: EditChannelTierData) {
        await this._put<void>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}/${tierId}`, data);
    }

    public async updateTiers(channelId: string, tiers: ChannelTier[]) {
        const tiersWithoutCurrency = tiers.map(tier => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { currency, channelId, isDefault, ...rest } = tier;
            return rest;
        });
        return this._put<ChannelTier[]>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}`, tiersWithoutCurrency);
    }

    public async getTiers(channelId: string) {
        return this._list<ChannelTier>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}`);
    }

    public async getTier(channelId: string, tierId: string) {
        return this._get<ChannelTier>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}/${tierId}`);
    }

    public async deleteTier(channelId: string, tierId: string) {
        return this._remove<void>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}/${tierId}`);
    }

    // ==================== SUBSCRIPTION OPERATIONS ====================

    public async subscribeToChannel(channelId: string, data: ChannelSubscribeData = {}) {
        return this._post<ChannelSubscription>(`${API_PATH}/${channelId}/${SUB_PATH.SUBSCRIPTIONS}`, data);
    }

    public async unsubscribeFromChannel(channelId: string) {
        await this._remove<void>(`${API_PATH}/${channelId}/${SUB_PATH.SUBSCRIPTIONS}`);
    }

    public async getChannelSubscribers(channelId: string, pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this._list<ChannelSubscription>(`${API_PATH}/${channelId}/${SUB_PATH.SUBSCRIPTIONS}`, pagination);
    }

    public async getSubscriptionDetails(channelId: string, subscriptionId: string) {
        return this._get<ChannelSubscription>(`${API_PATH}/${channelId}/${SUB_PATH.SUBSCRIPTIONS}/${subscriptionId}`);
    }

    // ==================== LEGACY METHODS (DEPRECATED) ====================

    /** @deprecated Use subscribeToChannel instead */
    public async joinChannel(channelId: string, options: { 
        tierId?: string;
        notificationLevel?: number;
    } = {}) {
        return this.subscribeToChannel(channelId, { tier_id: options.tierId });
    }

    /** @deprecated Use subscribeToChannel instead */
    public async subscribe(channelId: string, tierId: string) {
        return this.subscribeToChannel(channelId, { tier_id: tierId });
    }

    /** @deprecated Use unsubscribeFromChannel instead */
    public async unsubscribe(channelId: string) {
        return this.unsubscribeFromChannel(channelId);
    }

    /** @deprecated Use unsubscribeFromChannel instead */
    public async cancelMembership(channelId: string) {
        return this.unsubscribeFromChannel(channelId);
    }
}