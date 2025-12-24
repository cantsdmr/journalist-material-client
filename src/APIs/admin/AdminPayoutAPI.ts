import { AxiosJournalist } from "@/utils/axios";
import { DEFAULT_PAGINATION, HTTPApi, PaginationObject, PaginatedResponse } from "@/utils/http";

const ADMIN_API_PATH = '/api/admin';

export type PayoutFilters = {
    status?: string;
    channelId?: string;
    startDate?: string;
    endDate?: string;
};

export type PayoutStatsFilters = {
    startDate?: string;
    endDate?: string;
};

export type ProcessPayoutData = {
    // Add fields if needed
};

export type RetryPayoutData = {
    reason?: string;
};

/**
 * Admin Payout API
 * Provides administrative access to payout management
 */
export class AdminPayoutAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, `${ADMIN_API_PATH}/payouts`);
    }

    public async getPayouts(
        filters: PayoutFilters = {},
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedResponse<any>> {
        const params = { ...pagination, ...filters };
        return this._list<any>(`${ADMIN_API_PATH}/payouts`, params);
    }

    public async getPendingPayouts(
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedResponse<any>> {
        return this._list<any>(`${ADMIN_API_PATH}/payouts/pending`, pagination);
    }

    public async getFailedPayouts(
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedResponse<any>> {
        return this._list<any>(`${ADMIN_API_PATH}/payouts/failed`, pagination);
    }

    public async getPayoutStats(filters: PayoutStatsFilters = {}): Promise<any> {
        return this._list<any>(`${ADMIN_API_PATH}/payouts/stats`, filters);
    }

    public async getPayoutById(id: string): Promise<any> {
        return this._get<any>(`${ADMIN_API_PATH}/payouts/${id}`);
    }

    public async processPayout(id: string, data: ProcessPayoutData = {}): Promise<void> {
        await this._post<void>(`${ADMIN_API_PATH}/payouts/${id}/process`, data);
    }

    public async retryPayout(id: string, data: RetryPayoutData = {}): Promise<void> {
        await this._post<void>(`${ADMIN_API_PATH}/payouts/${id}/retry`, data);
    }

    public async cancelPayout(id: string): Promise<void> {
        await this._post<void>(`${ADMIN_API_PATH}/payouts/${id}/cancel`, {});
    }
}
