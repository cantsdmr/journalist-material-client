import { DEFAULT_PAGINATION, HTTPApi, PaginationObject, PaginatedCollection } from "@/utils/http";
import { ChannelUser, ChannelMembership } from "./ChannelAPI";
import { AxiosJournalist } from "@/utils/axios";

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
    channels?: ChannelUser[];
};

export type CreateUserData = {
    email: string;
    externalId: string;
    displayName: string;
    photoUrl: string;
    roleId: number;
    statusId: number;
};

const API_PATH = '/api/users'

export class UserAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    public async getAll(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<User>> {
        return this._list<User>(API_PATH, pagination);
    }

    public async get(id: string): Promise<User> {
        return this._get<User>(`${API_PATH}/${id}`);
    }

    public async create(data: CreateUserData): Promise<User> {
        return this._post<User>(API_PATH, data);
    }

    public async update(id: string, data: Partial<CreateUserData>): Promise<User> {
        return this._put<User>(`${API_PATH}/${id}`, data);
    }

    public async delete(id: string): Promise<void> {
        return this._remove<void>(`${API_PATH}/${id}`);
    }
}
