import { AxiosJournalist } from "@/utils/axios";
import { DEFAULT_PAGINATION, HTTPApi, PaginationObject, PaginatedResponse } from "@/utils/http";
import { News } from "../../types";

const ADMIN_API_PATH = '/api/admin';

/**
 * Admin News API
 * Provides unfiltered access to all news for administrative purposes
 */
export class AdminNewsAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, `${ADMIN_API_PATH}/news`);
    }

    /**
     * Get all news (admin - unfiltered access)
     */
    public async getAllNews(
        filters: any = {},
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedResponse<News>> {
        const params = { ...pagination, ...filters };
        return this._list<News>(`${ADMIN_API_PATH}/news`, params);
    }
}
