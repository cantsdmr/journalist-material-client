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
    isFollowing: boolean;
    isSubscribed: boolean;
    followers?: any[];
    followerCount: number;
    subscriberCount: number;
    subscriptions?: any[];
    news?: News[];
    polls?: Poll[];
    users?: User[];
    tiers?: ChannelTier[];
    tags?: string[];
}

export type ChannelFollower = {
    id: string;
    channelId: string;
    userId: string;
    followedAt: Date;
}

export type ChannelSubscription = {
    id: string;
    channelId: string;
    userId: string;
    subscribedAt: Date;
    expiresAt: Date;
    tierId: string;
}

export type ChannelTier = {
    id: string;
    name: string;
    description: string;
    price: number;
    channelId: string;
    order: number;
    benefits: any[];
}

export type CreateChannelData = Omit<Channel, "id" | "createdAt" | "updatedAt" | "isFollowing" | "isSubscribed" | "followers" | "subscriptions" | "news" | "polls" | "users" | "tiers" | "followerCount" | "subscriberCount">
export type EditChannelData = Omit<Channel, "id" | "createdAt" | "updatedAt" | "isFollowing" | "isSubscribed" | "followers" | "subscriptions" | "news" | "polls" | "users" | "tiers" | "followerCount" | "subscriberCount">

export type CreateTierData = Omit<ChannelTier, "id" | "channelId">;
export type EditTierData = Omit<ChannelTier, "id" | "channelId">;

const API_PATH = '/api/channels'
const SUB_PATH = {
    TIER: 'tier',
    FOLLOWER: 'follower',
    SUBSCRIBER: 'subscriber'
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
        return this._patch<Channel>(`${API_PATH}/${channelId}`, data);
    }

    public deleteChannel = (channelId: string) => {
        return this._remove<Channel>(`${API_PATH}/${channelId}`);
    }

    // Tier methods
    public createTier = (channelId: string, data: CreateTierData) => {
        return this._post<ChannelTier>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}`, data);
    }

    public updateTier = (channelId: string, tierId: string, data: EditTierData) => {
        return this._patch<ChannelTier>(`${API_PATH}/${channelId}/${SUB_PATH.TIER}/${tierId}`, data);
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

    // Follower methods
    public follow = (channelId: string) => {
        return this._post<ChannelFollower>(`${API_PATH}/${channelId}/${SUB_PATH.FOLLOWER}`, {});
    }

    public unfollow = (channelId: string) => {
        return this._remove<void>(`${API_PATH}/${channelId}/${SUB_PATH.FOLLOWER}`);
    }

    // Subscriber methods
    public subscribe = (channelId: string, tierId: string) => {
        return this._post<ChannelSubscription>(`${API_PATH}/${channelId}/${SUB_PATH.SUBSCRIBER}`, { tierId });
    }

    public unsubscribe = (channelId: string) => {
        return this._remove<void>(`${API_PATH}/${channelId}/${SUB_PATH.SUBSCRIBER}`);
    }

    public changeSubscriptionTier = (channelId: string, tierId: string) => {
        return this._patch<ChannelSubscription>(`${API_PATH}/${channelId}/${SUB_PATH.SUBSCRIBER}`, { tierId })
    }
}