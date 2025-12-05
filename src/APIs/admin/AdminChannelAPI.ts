import { AxiosJournalist } from "@/utils/axios";
import { DEFAULT_PAGINATION, HTTPApi, PaginationObject, PaginatedResponse } from "@/utils/http";
import { Channel } from "../../types";

const ADMIN_API_PATH = '/api/admin';

/**
 * Admin Channel API
 * Provides unfiltered access to all channels for administrative purposes
 */
export class AdminChannelAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, `${ADMIN_API_PATH}/channels`);
    }

    /**
     * Get all channels (admin - unfiltered access)
     */
    public async getAllChannels(
        filters: any = {},
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedResponse<Channel>> {
        const params = { ...pagination, ...filters };
        return this._list<Channel>(`${ADMIN_API_PATH}/channels`, params);
    }
}
