import { AxiosJournalist } from "@/utils/axios";
import { DEFAULT_PAGINATION, HTTPApi, PaginationObject, PaginatedResponse } from "@/utils/http";
import { User } from "../../types";

const ADMIN_API_PATH = '/api/admin';

export type RegisterUserData = {
    email: string;
    externalId: string;
    displayName: string;
    photoUrl?: string;
    roleId: string;
    statusId?: string;
};

export type UpdateUserData = {
    displayName?: string;
    email?: string;
    photoUrl?: string;
    roleId?: string;
    statusId?: string;
};

export type UpdateUserCustomClaimsData = {
    system_role: string;
    system_status: string;
};

export type SuspendUserData = {
    reason?: string;
};

export type UnsuspendUserData = {
    reason?: string;
};

/**
 * Admin User API
 * Provides unfiltered access to all users for administrative purposes
 */
export class AdminUserAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, `${ADMIN_API_PATH}/users`);
    }

    public async getAllUsers(
        params: any = {},
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedResponse<User>> {
        const queryParams = { ...pagination, ...params };
        return this._list<User>(`${ADMIN_API_PATH}/users`, queryParams);
    }

    public async getUserById(id: string): Promise<User> {
        return this._get<User>(`${ADMIN_API_PATH}/users/${id}`);
    }

    public async registerUser(data: RegisterUserData): Promise<User> {
        return this._post<User>(`${ADMIN_API_PATH}/users/register`, data);
    }

    public async updateUser(id: string, data: UpdateUserData): Promise<void> {
        await this._put<void>(`${ADMIN_API_PATH}/users/${id}`, data);
    }

    public async updateUserCustomClaims(id: string, data: UpdateUserCustomClaimsData): Promise<void> {
        await this._put<void>(`${ADMIN_API_PATH}/users/${id}/custom-claims`, { customClaims: data });
    }

    public async suspendUser(id: string, data: SuspendUserData): Promise<void> {
        await this._post<void>(`${ADMIN_API_PATH}/users/${id}/suspend`, data);
    }

    public async unsuspendUser(id: string, data: UnsuspendUserData): Promise<void> {
        await this._post<void>(`${ADMIN_API_PATH}/users/${id}/unsuspend`, data);
    }

    public async deleteUser(id: string): Promise<void> {
        await this._remove<void>(`${ADMIN_API_PATH}/users/${id}`);
    }

    public async getUsersByRole(roleId: string, pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedResponse<User>> {
        return this._list<User>(`${ADMIN_API_PATH}/users/role/${roleId}`, pagination);
    }
}
