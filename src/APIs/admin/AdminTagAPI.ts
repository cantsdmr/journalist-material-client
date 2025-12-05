import { AxiosJournalist } from "@/utils/axios";
import { DEFAULT_PAGINATION, HTTPApi, PaginationObject, PaginatedResponse } from "@/utils/http";

const ADMIN_API_PATH = '/api/admin';

export type CreateTagData = {
    name: string;
    description?: string;
};

export type UpdateTagData = {
    name?: string;
    description?: string;
};

/**
 * Admin Tag API
 * Provides administrative access to tag management
 */
export class AdminTagAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, `${ADMIN_API_PATH}/tags`);
    }

    public async getTags(
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedResponse<any>> {
        return this._list<any>(`${ADMIN_API_PATH}/tags`, pagination);
    }

    public async createTag(data: CreateTagData): Promise<any> {
        return this._post<any>(`${ADMIN_API_PATH}/tags`, data);
    }

    public async updateTag(id: string, data: UpdateTagData): Promise<void> {
        await this._put<void>(`${ADMIN_API_PATH}/tags/${id}`, data);
    }

    public async deleteTag(id: string): Promise<void> {
        await this._remove<void>(`${ADMIN_API_PATH}/tags/${id}`);
    }
}
