import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi, PaginationObject, DEFAULT_PAGINATION, PaginatedCollection } from "@/utils/http";
import { News } from "./NewsAPI";
import { Poll } from "./PollAPI";
import { User } from "./UserAPI";

export type Channel = {
    id: string;
    name: string;
    description: string;
    handle: string;
    createdAt: Date;
    updatedAt: Date;
    logoUrl?: string;
    bannerUrl?: string;
    status: number;
    memberships?: ChannelMembership[];
    news?: News[];
    polls?: Poll[];
    users?: User[];
    tiers?: ChannelTier[];
    tags?: string[];
    stats?: ChannelStats;
    creatorId: string;
    isFollowing?: boolean;
    isSubscribed?: boolean;
};

export type ChannelExecutive = {
    id: string;
    userId: string;
    channelId: string;
    channelName: string;
    user: User;
    channel: Channel;
};

export type ChannelMember = {
    id: string;
    userId: string;
    channelId: string;
    user: User;
    channel: Channel;
    createdAt: string;
};

export type SubscriptionTier = {
    id: string;
    name: string;
    description: string;
    price: number;
    channelId: string;
    order: number;
    benefits: any[];
};

export type ChannelSubscription = {
    id: string;
    channelId: string;
    status: number;
    subscribedAt: string;
    expiresAt: string;
    tierId: string;
    createdAt: string;
    tier: SubscriptionTier;
    channel?: Channel;
    user?: User;
};

export type ChannelTier = {
    id: string;
    name: string;
    description: string;
    price: number;
    channelId: string;
    order: number;
    isDefault: boolean;
    maxSubscribers?: number;
    benefits: any[];
    currency: string;
}

export type ChannelStats = {
    activeMemberCount: number;
    paidMemberCount: number;
    popularityScore: number;
    newsCount: number;
    pollCount: number;
    tierCount: number;
}

export type CreateChannelData = {
    name: string;
    description: string;
    handle: string;
    logoUrl: string;
    bannerUrl: string;
    status: number;
    tags: string[];
};

export type EditChannelData = {
    name?: string;
    description?: string;
    handle?: string;
    logoUrl?: string;
    bannerUrl?: string;
    status?: number;
    tags?: string[];
};

export type CreateChannelTierData = {
    name: string;
    description: string;
    price: number;
    benefits: string[];
    order: number;
};

export type EditChannelTierData = CreateChannelTierData;

export type ChannelMembership = {
    id: string;
    channelId: string;
    userId: string;
    tierId?: string;
    status: 'active' | 'cancelled' | 'expired' | 'suspended';
    createdAt: string;
    updatedAt: string;
    tier: ChannelTier;
    channel: Channel;
    user: User;
};

// Unified subscription data for channel operations
export type ChannelSubscribeData = {
    tier_id?: string;
    payment_method_id?: string;
};

// Query parameter types for filtering
export type ChannelFilters = {
    trending?: boolean;
    popular?: boolean;
    subscribed?: boolean;
    followed?: boolean;
    creator?: string;
    category?: string;
    verified?: boolean;
    tags?: string[];
};

// Response wrapper types
export type ApiResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
};

const API_PATH = '/api/channels'
const SUB_PATH = {
    TIER: 'tiers',
    SUBSCRIPTIONS: 'subscriptions'  // Updated to match backend
}

export class ChannelAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    // ==================== MAIN CHANNELS ENDPOINT WITH FILTERING ====================

    /**
     * Get channels with comprehensive filtering via query parameters
     * Supports: trending, popular, subscribed, followed, creator, category, verified, tags
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
    public async getAll(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Channel>> {
        return this.getChannels({}, pagination);
    }

    /**
     * Get trending channels
     */
    public async getTrending(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Channel>> {
        return this.getChannels({ trending: true }, pagination);
    }

    /**
     * Get popular channels
     */
    public async getPopular(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Channel>> {
        return this.getChannels({ popular: true }, pagination);
    }

    /**
     * Get subscribed channels
     */
    public async getSubscribed(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Channel>> {
        return this.getChannels({ subscribed: true }, pagination);
    }

    /**
     * Get followed channels
     */
    public async getFollowed(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Channel>> {
        return this.getChannels({ followed: true }, pagination);
    }

    /**
     * Get verified channels
     */
    public async getVerified(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Channel>> {
        return this.getChannels({ verified: true }, pagination);
    }

    // ==================== INDIVIDUAL CHANNEL OPERATIONS ====================

    // Channel methods
    public async createChannel(data: CreateChannelData): Promise<Channel> {
        return this._post<Channel>(API_PATH, data);
    }

    public async getChannel(channelId: string): Promise<Channel> {
        return this._get<Channel>(`${API_PATH}/${channelId}`);
    }

    public async getCreatorChannels(userId: string, pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Channel>> {
        return this.getChannels({ creator: userId }, pagination);
    }

    public async updateChannel(channelId: string, data: EditChannelData): Promise<Channel> {
        return this._put<Channel>(`${API_PATH}/${channelId}`, data);
    }

    public async deleteChannel(channelId: string): Promise<void> {
        return this._remove<void>(`${API_PATH}/${channelId}`);
    }

    // Tier methods
    public async createTier(channelId: string, data: CreateChannelTierData): Promise<ChannelTier> {
        return this._post<ChannelTier>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}`, data);
    }

    public async updateTier(channelId: string, tierId: string, data: EditChannelTierData): Promise<ChannelTier> {
        return this._put<ChannelTier>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}/${tierId}`, data);
    }

    public async updateTiers(channelId: string, tiers: ChannelTier[]): Promise<ChannelTier[]> {
        const tiersWithoutCurrency = tiers.map(tier => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { currency, channelId, isDefault, ...rest } = tier;
            return rest;
        });
        return this._put<ChannelTier[]>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}`, tiersWithoutCurrency);
    }

    public async getTiers(channelId: string): Promise<PaginatedCollection<ChannelTier>> {
        return this._list<ChannelTier>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}`);
    }

    public async getTier(channelId: string, tierId: string): Promise<ChannelTier> {
        return this._get<ChannelTier>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}/${tierId}`);
    }

    public async deleteTier(channelId: string, tierId: string): Promise<void> {
        return this._remove<void>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}/${tierId}`);
    }

    // CHANNEL VIEWPOINT: Unified subscription methods
    public async subscribeToChannel(channelId: string, data: ChannelSubscribeData = {}): Promise<ChannelMembership> {
        const response = await this._post<ApiResponse<ChannelMembership>>(`${API_PATH}/${channelId}/${SUB_PATH.SUBSCRIPTIONS}`, data);
        return response.data;
    }

    public async unsubscribeFromChannel(channelId: string): Promise<void> {
        await this._remove<ApiResponse<void>>(`${API_PATH}/${channelId}/${SUB_PATH.SUBSCRIPTIONS}`);
    }

    // CREATOR/OWNER VIEWPOINT: Channel subscriber management
    public async getChannelSubscribers(channelId: string, pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<ChannelMembership>> {
        return this._list<ChannelMembership>(`${API_PATH}/${channelId}/${SUB_PATH.SUBSCRIPTIONS}`, pagination);
    }

    public async getSubscriptionDetails(channelId: string, subscriptionId: string): Promise<ChannelMembership> {
        const response = await this._get<ApiResponse<ChannelMembership>>(`${API_PATH}/${channelId}/${SUB_PATH.SUBSCRIPTIONS}/${subscriptionId}`);
        return response.data;
    }

    // Legacy methods for backward compatibility (deprecated)
    /** @deprecated Use subscribeToChannel instead */
    public async joinChannel(channelId: string, options: { 
        tierId?: string;
        notificationLevel?: number;
    } = {}): Promise<ChannelMembership> {
        return this.subscribeToChannel(channelId, { tier_id: options.tierId });
    }

    /** @deprecated Use subscribeToChannel instead */
    public async subscribe(channelId: string, tierId: string): Promise<ChannelMembership> {
        return this.subscribeToChannel(channelId, { tier_id: tierId });
    }

    /** @deprecated Use unsubscribeFromChannel instead */
    public async unsubscribe(channelId: string): Promise<void> {
        return this.unsubscribeFromChannel(channelId);
    }

    /** @deprecated Use unsubscribeFromChannel instead */
    public async cancelMembership(channelId: string): Promise<void> {
        return this.unsubscribeFromChannel(channelId);
    }
}