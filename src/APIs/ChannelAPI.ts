import { AxiosJournalist } from "../util/axios";
import { HTTPApi } from "../util/http";
import { News } from "./NewsAPI";
import { Poll } from "./PollAPI";
import { User } from "./UserAPI";

export type Channel = {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    logoUrl: string;
    isFollowing: boolean;
    isSubscribed: boolean;
    followers?: any[];
    subscriptions?: any[];
    news?: News[];
    polls?: Poll[];
    users?: User[];
    tiers?: SubscriptionTier[];
}

export type SubscriptionTier = {
    id: string;
    name: string;
    description: string;
    price: number;
    channelId: string;
    tierBenefits: any[];
}

export type CreateChannelData = Omit<Channel, "id">
export type EditChannelData = Omit<Channel, "id">

const API_PATH = '/api/channels'

export class ChannelAPI extends HTTPApi<Channel, CreateChannelData, EditChannelData> {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    public follow = (channelId: string) => {
        return this._post(`${API_PATH}/${channelId}/follower`, { channelId })
    }

    public unfollow = (channelId: string) => {
        return this._remove(`${API_PATH}/${channelId}/follower`)
    }

    public join = (channelId: string, tierId: string) => {
        return this._post(`${API_PATH}/${channelId}/subscriber`, { tierId })
    }

    public leave = (channelId: string) => {
        return this._remove(`${API_PATH}/${channelId}/subscriber`)
    }

    public changeSubscriptionTier = (channelId: string, tierId: string) => {
        return this._patch(`${API_PATH}/${channelId}/subscriber`, { tierId })
    }
}