import { AxiosJournalist } from "@/utils/axios";
import { DEFAULT_PAGINATION, HTTPApi, PaginationObject } from "@/utils/http";
import { Channel, ChannelFollower, ChannelSubscription } from "./ChannelAPI";

export type User = {
    id: string;
    displayName: string | null;
    email: string | null;
    createdAt: Date;
    photoUrl: string | null;
    roleId: number;
    statusId: number;
    externalId: string | null;
    followings: ChannelFollower[];
    subscriptions: ChannelSubscription[];
    channels: ChannelUser[];
}

export type ChannelUser = {
    id: string;
    userId: string;
    channelId: string;
    channelName: string;
    channel: Channel;
}

export type CreateUserData = Omit<User, "id" | "createdAt" | "memberships">
export type EditUserData = Omit<User, "id" | "createdAt" | "externalId" | "memberships">

const API_PATH = 'api/users'
const SUB_PATH = {
    PROFILE: 'profile',
    SIGN_IN: 'sign-in',
    SIGN_UP: 'sign-up'
}

export class UserAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    public signUp = async ({
        external_id,
        email,
        display_name,
        photo_url,
        role_id
    }: {
        external_id: string | null,
        email: string | null,
        display_name: string | null,
        photo_url: string | null,
        role_id: number
    }) => {
        return this._post<void>(`${API_PATH}/${SUB_PATH.SIGN_UP}`, { external_id, email, display_name, photo_url, role_id });
    }

    public signIn = async ({
        idToken
    }: {
        idToken: string
    }) => {
        return this._post<void>(`${API_PATH}/${SUB_PATH.SIGN_IN}`, { idToken });
    }

    public getUserInfo = async () => {
        return this._get<User>(`${API_PATH}/${SUB_PATH.PROFILE}`);
    }

    public getUserInfoByExternalId = async (externalId: string) => {
        return this._get<User>(`${API_PATH}/${SUB_PATH.PROFILE}/${externalId}`);
    }

    public getUserChannels = async (userId: string, pagination: PaginationObject = DEFAULT_PAGINATION) => {
        return this._list<ChannelUser>(`${API_PATH}/${userId}/channel`, pagination);
    }
}
