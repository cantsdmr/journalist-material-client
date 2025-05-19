import { DEFAULT_PAGINATION, HTTPApi, PaginationObject } from "@/utils/http";
import { ChannelUser, ChannelMembership } from "./ChannelAPI";
import { AxiosJournalist } from "@/utils/axios";

export enum UserRole {
    ADMIN = 1,
    EDITOR = 2,
    JOURNALIST = 3,
    USER = 4
}

export enum UserStatus {
    ACTIVE = 1,
    INACTIVE = 2,
    BANNED = 3
}

export type User = {
    id: string;
    externalId: string;
    email: string;
    displayName: string;
    photoUrl?: string;
    roleId: number;
    statusId: number;
    createdAt: string;
    updatedAt: string;
    lastLogin?: string;
    memberships?: ChannelMembership[];
};

export type CreateUserData = {
    email: string;
    externalId: string;
    displayName: string;
    photoUrl: string;
    roleId: UserRole;
    statusId: UserStatus;
};

export type SignInData = {
    idToken: string;
};

export type SignUpData = {
    external_id: string | null;
    email: string | null;
    display_name: string | null;
    photo_url: string | null;
    role_id: number;
};

const API_PATH = '/api/users'

export class UserAPI extends HTTPApi {
    private readonly SUB_PATH = {
        PROFILE: 'profile',
        SIGN_IN: 'sign-in',
        SIGN_UP: 'sign-up'
    };

    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    public getAll = (pagination: PaginationObject = DEFAULT_PAGINATION) => {
        return this._list<User>(API_PATH, pagination);
    }

    public get = (id: string) => {
        return this._get<User>(`${API_PATH}/${id}`);
    }

    public create = (data: CreateUserData) => {
        return this._post<User>(API_PATH, data);
    }

    public update = (id: string, data: Partial<CreateUserData>) => {
        return this._put<User>(`${API_PATH}/${id}`, data);
    }

    public delete = (id: string) => {
        return this._remove<void>(`${API_PATH}/${id}`);
    }

    public getProfile = () => {
        return this._get<User>(`${API_PATH}/${this.SUB_PATH.PROFILE}`);
    }

    public getProfileByExternalId = (externalId: string) => {
        return this._get<User>(`${API_PATH}/${this.SUB_PATH.PROFILE}/${externalId}`);
    }

    public getUserInfoByExternalId = (externalId: string) => {
        return this._get<User>(`${API_PATH}/external/${externalId}`);
    }

    public getUserChannels = (userId: string, pagination: PaginationObject = DEFAULT_PAGINATION) => {
        return this._list<ChannelUser>(`${API_PATH}/${userId}/channels`, pagination);
    }

    public signIn = (data: SignInData) => {
        return this._post<void>(`${API_PATH}/${this.SUB_PATH.SIGN_IN}`, data);
    }

    public signUp = (data: SignUpData) => {
        return this._post<void>(`${API_PATH}/${this.SUB_PATH.SIGN_UP}`, data);
    }

    public getUserInfo = (userId: string) => {
        return this._get<User>(`${API_PATH}/${userId}`);
    }
}
