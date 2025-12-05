import { AxiosJournalist } from "@/utils/axios";
import { DEFAULT_PAGINATION, HTTPApi, PaginationObject, PaginatedResponse } from "@/utils/http";

const ADMIN_API_PATH = '/api/admin';

/**
 * Admin Subscription API
 * Provides administrative access to subscription management
 */
export class AdminSubscriptionAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, `${ADMIN_API_PATH}/subscriptions`);
    }

    public async getSubscriptions(
        filters: any = {},
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedResponse<any>> {
        const params = { ...pagination, ...filters };
        return this._list<any>(`${ADMIN_API_PATH}/subscriptions`, params);
    }

    public async getSubscriptionById(id: string): Promise<any> {
        return this._get<any>(`${ADMIN_API_PATH}/subscriptions/${id}`);
    }
}
