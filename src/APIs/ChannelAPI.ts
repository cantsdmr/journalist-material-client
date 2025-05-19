import { AxiosJournalist } from "@/utils/axios";
import { DEFAULT_PAGINATION, HTTPApi, PaginationObject } from "@/utils/http";
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
}

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
    channel?: Channel;  // Optional as it might be populated in some contexts
    user?: User;        // Optional as it might be populated in some contexts
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

export type CreateChannelData = Omit<Channel, "id" | "createdAt" | "updatedAt" | "membershipCount" | "currentUserMembership" | "memberships" | "news" | "polls" | "users" | "tiers" | "stats">;
export type EditChannelData = Omit<Channel, "id" | "createdAt" | "updatedAt" | "membershipCount" | "currentUserMembership" | "memberships" | "news" | "polls" | "users" | "tiers" | "stats">;

export type CreateChannelTierData = Omit<ChannelTier, "id" | "channelId">;
export type EditChannelTierData = Omit<ChannelTier, "id" | "channelId">;

export type ChannelMembership = {
    id: string;
    userId: string;
    channelId: string;
    tierId: string;
    statusId: number;
    notificationLevelId: number;
    subscribedAt: Date;
    expiresAt?: Date;
    renewalDate?: Date;
    paymentReference?: string;
    totalContributions: number;
    monthlyContribution: number;
    autoContribute: boolean;
    contributionLimit?: number;
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
    public createChannel = (data: CreateChannelData) => {
        return this._post<Channel>(API_PATH, data);
    }

    public getChannel = (channelId: string) => {
        return this._get<Channel>(`${API_PATH}/${channelId}`);
    }

    public getChannels = (pagination: PaginationObject = DEFAULT_PAGINATION) => {
        return this._list<Channel>(API_PATH, pagination);
    }

    public getCreatorChannels = (userId: string, pagination: PaginationObject = DEFAULT_PAGINATION) => {
        return this._list<Channel>(`${API_PATH}/creator/${userId}`, pagination);
    }

    public updateChannel = (channelId: string, data: EditChannelData) => {
        return this._put<Channel>(`${API_PATH}/${channelId}`, data);
    }

    public deleteChannel = (channelId: string) => {
        return this._remove<Channel>(`${API_PATH}/${channelId}`);
    }

    // Tier methods
    public createTier = (channelId: string, data: CreateChannelTierData) => {
        return this._post<ChannelTier>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}`, data);
    }

    public updateTier = (channelId: string, tierId: string, data: EditChannelTierData) => {
        return this._put<ChannelTier>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}/${tierId}`, data);
    }

    public updateTiers = (channelId: string, tiers: ChannelTier[]) => {
        return this._put<ChannelTier>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}`, tiers);
    }

    public getTiers = (channelId: string) => {
        return this._list<ChannelTier>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}`);
    }

    public getTier = (channelId: string, tierId: string) => {
        return this._get<ChannelTier>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}/${tierId}`);
    }

    public deleteTier = (channelId: string, tierId: string) => {
        return this._remove<ChannelTier>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}/${tierId}`);
    }

    // Membership methods
    public joinChannel = (channelId: string, options: { 
        tierId?: string;
        notificationLevel?: number;
    } = {}) => {
        return this._post<ChannelMembership>(`${API_PATH}/${channelId}/${SUB_PATH.MEMBERSHIP}`, options);
    }

    public updateMembership = (channelId: string, data: {
        tierId?: string;
        notificationLevel?: number;
        autoContribute?: boolean;
        contributionLimit?: number;
    }) => {
        return this._put<ChannelMembership>(`${API_PATH}/${channelId}/${SUB_PATH.MEMBERSHIP}`, data);
    }

    public cancelMembership = (channelId: string) => {
        return this._remove<void>(`${API_PATH}/${channelId}/${SUB_PATH.MEMBERSHIP}`);
    }

    public getChannelMembers = (channelId: string, pagination: PaginationObject = DEFAULT_PAGINATION) => {
        return this._list<ChannelMembership>(`${API_PATH}/${channelId}/${SUB_PATH.MEMBERSHIP}`, pagination);
    }

    public getMembershipDetails = (channelId: string) => {
        return this._get<ChannelMembership>(`${API_PATH}/${channelId}/${SUB_PATH.MEMBERSHIP}`);
    }
}