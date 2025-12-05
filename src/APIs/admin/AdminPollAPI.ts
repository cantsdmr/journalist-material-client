import { AxiosJournalist } from "@/utils/axios";
import { DEFAULT_PAGINATION, HTTPApi, PaginationObject, PaginatedResponse } from "@/utils/http";
import { Poll } from "../../types";

const ADMIN_API_PATH = '/api/admin';

/**
 * Admin Poll API
 * Provides unfiltered access to all polls for administrative purposes
 */
export class AdminPollAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, `${ADMIN_API_PATH}/polls`);
    }

    /**
     * Get all polls (admin - unfiltered access)
     */
    public async getAllPolls(
        filters: any = {},
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedResponse<Poll>> {
        const params = { ...pagination, ...filters };
        return this._list<Poll>(`${ADMIN_API_PATH}/polls`, params);
    }
}
