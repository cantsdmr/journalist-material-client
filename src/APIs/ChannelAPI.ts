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
    membershipCount: number;
    currentUserMembership?: ChannelMembership | null;
    memberships?: ChannelMembership[];
    news?: News[];
    polls?: Poll[];
    users?: User[];
    tiers?: ChannelTier[];
    tags?: string[];
    stats?: {
        memberCount: number;
        newsCount: number;
        pollCount: number;
    };
    creatorId: string;
    followerCount: number;
    subscriberCount: number;
    isFollowing?: boolean;
    isSubscribed?: boolean;
    subscriptionTier?: string;
};

export type ChannelUser = {
    id: string;
    userId: string;
    channelId: string;
    channelName: string;
    user: User;
    channel: Channel;
};

export type ChannelFollower = {
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
    isDefault: boolean;
};

export type EditChannelTierData = Omit<ChannelTier, "id" | "channelId">;

export type ChannelMembership = {
    id: string;
    channelId: string;
    userId: string;
    tierId?: string;
    status: 'active' | 'cancelled';
    createdAt: string;
    updatedAt: string;
    tier: ChannelTier;
    channel: Channel;
    user: User;
};

const API_PATH = '/api/channels'
const SUB_PATH = {
    TIER: 'tier',
    MEMBERSHIP: 'membership'
}

export class ChannelAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    // Channel methods
    public async createChannel(data: CreateChannelData): Promise<Channel> {
        return this._post<Channel>(API_PATH, data);
    }

    public async getChannel(channelId: string): Promise<Channel> {
        return this._get<Channel>(`${API_PATH}/${channelId}`);
    }

    public async getChannels(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Channel>> {
        return this._list<Channel>(API_PATH, pagination);
    }

    public async getCreatorChannels(userId: string, pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Channel>> {
        return this._list<Channel>(`${API_PATH}/creator/${userId}`, pagination);
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
        return this._put<ChannelTier[]>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}`, tiers);
    }

    public async getTiers(channelId: string, pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<ChannelTier>> {
        return this._list<ChannelTier>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}`, pagination);
    }

    public async getTier(channelId: string, tierId: string): Promise<ChannelTier> {
        return this._get<ChannelTier>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}/${tierId}`);
    }

    public async deleteTier(channelId: string, tierId: string): Promise<void> {
        return this._remove<void>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}/${tierId}`);
    }

    // Membership methods
    public async joinChannel(channelId: string, options: { 
        tierId?: string;
        notificationLevel?: number;
    } = {}): Promise<ChannelMembership> {
        return this._post<ChannelMembership>(`${API_PATH}/${channelId}/${SUB_PATH.MEMBERSHIP}`, options);
    }

    public async updateMembership(channelId: string, data: {
        tierId?: string;
        notificationLevel?: number;
        autoContribute?: boolean;
        contributionLimit?: number;
    }): Promise<ChannelMembership> {
        return this._put<ChannelMembership>(`${API_PATH}/${channelId}/${SUB_PATH.MEMBERSHIP}`, data);
    }

    public async cancelMembership(channelId: string): Promise<void> {
        return this._remove<void>(`${API_PATH}/${channelId}/${SUB_PATH.MEMBERSHIP}`);
    }

    public async getChannelMembers(channelId: string, pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<ChannelMembership>> {
        return this._list<ChannelMembership>(`${API_PATH}/${channelId}/${SUB_PATH.MEMBERSHIP}`, pagination);
    }

    public async getMembershipDetails(channelId: string): Promise<ChannelMembership> {
        return this._get<ChannelMembership>(`${API_PATH}/${channelId}/${SUB_PATH.MEMBERSHIP}`);
    }

    public async subscribe(channelId: string, tierId: string): Promise<ChannelMembership> {
        return this._post<ChannelMembership>(`${API_PATH}/${channelId}/subscribe`, { tierId });
    }

    public async unsubscribe(channelId: string): Promise<void> {
        return this._post<void>(`${API_PATH}/${channelId}/unsubscribe`, {});
    }

    public async changeSubscriptionTier(channelId: string, tierId: string): Promise<ChannelMembership> {
        return this._post<ChannelMembership>(`${API_PATH}/${channelId}/change-subscription`, { tierId });
    }

    public async getMembership(channelId: string): Promise<ChannelMembership> {
        return this._get<ChannelMembership>(`${API_PATH}/${channelId}/membership`);
    }

    public async hasMembership(channelId: string): Promise<boolean> {
        const membership = await this.getMembership(channelId);
        return !!membership;
    }

    public async getMembershipTier(channelId: string): Promise<string> {
        const membership = await this.getMembership(channelId);
        return membership?.tierId || null;
    }

    public async isFollowing(channelId: string): Promise<boolean> {
        const channel = await this.getChannel(channelId);
        return !!channel?.isFollowing;
    }

    public async isSubscribed(channelId: string): Promise<boolean> {
        const channel = await this.getChannel(channelId);
        return !!channel?.isSubscribed;
    }

    public async getSubscriptionTier(channelId: string): Promise<string> {
        const channel = await this.getChannel(channelId);
        return channel?.subscriptionTier || '';
    }
}