import { AxiosJournalist } from "@/utils/axios";
import { DEFAULT_PAGINATION, HTTPApi, PaginationObject, PaginatedResponse } from "@/utils/http";

const ADMIN_API_PATH = '/api/admin';

export type UpdateExpenseOrderData = {
    status?: string;
    notes?: string;
    amount?: number;
};

/**
 * Admin Expense Order API
 * Provides administrative access to expense order management
 */
export class AdminExpenseOrderAPI extends HTTPApi {
    constructor(axiosJ: AxiosJournalist) {
        super(axiosJ, `${ADMIN_API_PATH}/expense-orders`);
    }

    public async getAllExpenseOrders(
        filters: any = {},
        pagination: PaginationObject = DEFAULT_PAGINATION
    ): Promise<PaginatedResponse<any>> {
        const params = { ...pagination, ...filters };
        return this._list<any>(`${ADMIN_API_PATH}/expense-orders`, params);
    }

    public async getExpenseOrder(id: string): Promise<any> {
        return this._get<any>(`${ADMIN_API_PATH}/expense-orders/${id}`);
    }

    public async updateExpenseOrder(id: string, data: UpdateExpenseOrderData): Promise<void> {
        await this._put<void>(`${ADMIN_API_PATH}/expense-orders/${id}`, data);
    }
}
