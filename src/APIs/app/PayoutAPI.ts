import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi, PaginationObject, DEFAULT_PAGINATION, PaginatedCollection } from "@/utils/http";
import { Payout, PayoutStats } from "../../types";

const API_PATH = '/api/payouts';

export class PayoutAPI extends HTTPApi {
  constructor(axiosJ: AxiosJournalist) {
    super(axiosJ, API_PATH);
  }

  // ==================== ADMIN/FINANCE MANAGER METHODS ====================

  public async getPayouts(params?: any): Promise<PaginatedCollection<Payout>> {
    return this._list<Payout>(API_PATH, params || {});
  }

  public async getPayoutById(payoutId: string): Promise<Payout> {
    return this._get<Payout>(`${API_PATH}/${payoutId}`);
  }

  public async getPendingPayouts(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Payout>> {
    return this._list<Payout>(`${API_PATH}/pending`, pagination);
  }

  public async getFailedPayouts(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Payout>> {
    return this._list<Payout>(`${API_PATH}/failed`, pagination);
  }

  public async getPayoutsReadyForRetry(): Promise<Payout[]> {
    return this._get<Payout[]>(`${API_PATH}/ready-for-retry`);
  }

  public async getPayoutsByJournalist(journalistId: string, pagination: PaginationObject = DEFAULT_PAGINATION, status?: string): Promise<PaginatedCollection<Payout>> {
    const params: any = { ...pagination };
    if (status) params.status = status;
    return this._list<Payout>(`${API_PATH}/journalist/${journalistId}`, params);
  }

  public async getPayoutsByChannel(channelId: string, pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Payout>> {
    return this._list<Payout>(`${API_PATH}/channel/${channelId}`, pagination);
  }

  public async getPayoutStats(params?: { channelId?: string; startDate?: string; endDate?: string }): Promise<PayoutStats> {
    return this._get<PayoutStats>(`${API_PATH}/stats`, { params });
  }

  public async processPayout(payoutId: string): Promise<Payout> {
    return this._post<Payout>(`${API_PATH}/${payoutId}/process`, {});
  }

  public async retryPayout(payoutId: string): Promise<Payout> {
    return this._post<Payout>(`${API_PATH}/${payoutId}/retry`, {});
  }

  public async cancelPayout(payoutId: string, data: { reason?: string }): Promise<Payout> {
    return this._post<Payout>(`${API_PATH}/${payoutId}/cancel`, data);
  }
}
