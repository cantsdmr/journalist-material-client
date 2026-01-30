import { AxiosJournalist } from "@/utils/axios";
import { DEFAULT_PAGINATION, HTTPApi, PaginationObject } from "@/utils/http";
import { User } from "../../types";

export type CreateUserData = {
    email: string;
    externalId: string;
    displayName: string;
    photoUrl: string;
    roleId: string;
    statusId: string;
};

const API_PATH = '/api/users';

export class UserAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, API_PATH);
    }

    public async getAll(pagination: PaginationObject = DEFAULT_PAGINATION) {
        return this._list<User>(API_PATH, pagination);
    }

    public async get(id: string): Promise<User> {
        return this._get<User>(`${API_PATH}/${id}`);
    }

    public async create(data: CreateUserData): Promise<User> {
        return this._post<User>(API_PATH, data);
    }

    public async update(id: string, data: Partial<CreateUserData>): Promise<void> {
        await this._put<void>(`${API_PATH}/${id}`, data);
    }

    public async delete(id: string): Promise<void> {
        return this._remove<void>(`${API_PATH}/${id}`);
    }
}
