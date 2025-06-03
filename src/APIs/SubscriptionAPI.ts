import { HTTPApi, PaginationObject, DEFAULT_PAGINATION, PaginatedResponse } from "@/utils/http";
import { AxiosJournalist } from "@/utils/axios";
import { 
    AdminSubscription,
    SubscriptionAnalytics,
    RevenueMetrics,
    BulkUpdateResult,
    SubscriptionFilters,
    AnalyticsOptions,
    RevenueOptions,
    BulkUpdateData
} from "../types";

const API_PATH = '/api/subscriptions';

export class SubscriptionAPI extends HTTPApi {
  constructor(axiosJ: AxiosJournalist) {
    super(axiosJ, API_PATH);
  }

  // ==================== ADMIN SUBSCRIPTION MANAGEMENT ====================

  public async getAllSubscriptions(
    pagination: PaginationObject = DEFAULT_PAGINATION,
    filters: SubscriptionFilters = {}
  ): Promise<PaginatedResponse<AdminSubscription>> {
    const params = { ...pagination, ...filters };
    return this._list<AdminSubscription>(API_PATH, params);
  }

  public async getSubscriptionById(id: string): Promise<AdminSubscription> {
    return this._get<AdminSubscription>(`${API_PATH}/${id}`);
  }

  public async updateSubscriptionStatus(
    id: string, 
    status: 'active' | 'canceled' | 'expired' | 'suspended',
    reason?: string
  ): Promise<AdminSubscription> {
    return this._patch<AdminSubscription>(`${API_PATH}/${id}/status`, {
      status,
      reason
    });
  }

  public async bulkUpdateSubscriptions(data: BulkUpdateData): Promise<BulkUpdateResult> {
    return this._post<BulkUpdateResult>(`${API_PATH}/bulk-update`, data);
  }

  // ==================== ANALYTICS ENDPOINTS ====================

  public async getSubscriptionAnalytics(options: AnalyticsOptions = {}): Promise<SubscriptionAnalytics> {
    const params = new URLSearchParams(options as Record<string, string>).toString();
    const url = params ? `${API_PATH}/analytics?${params}` : `${API_PATH}/analytics`;
    return this._get<SubscriptionAnalytics>(url);
  }

  public async getRevenueMetrics(options: RevenueOptions = {}): Promise<RevenueMetrics> {
    const params = new URLSearchParams(options as Record<string, string>).toString();
    const url = params ? `${API_PATH}/revenue?${params}` : `${API_PATH}/revenue`;
    return this._get<RevenueMetrics>(url);
  }

  // ==================== EXPORT FUNCTIONALITY ====================

  public async exportSubscriptions(
    filters: SubscriptionFilters = {},
    format: 'csv' | 'xlsx' = 'csv'
  ): Promise<Blob> {
    const params = new URLSearchParams({ ...filters, format } as Record<string, string>).toString();
    const url = params ? `${API_PATH}/export?${params}` : `${API_PATH}/export`;
    return this._get<Blob>(url);
  }

  // ==================== SUBSCRIPTION LIFECYCLE MANAGEMENT ====================

  public async cancelSubscription(id: string, reason?: string): Promise<void> {
    await this.updateSubscriptionStatus(id, 'canceled', reason);
  }

  public async activateSubscription(id: string, reason?: string): Promise<void> {
    await this.updateSubscriptionStatus(id, 'active', reason);
  }

  public async suspendSubscription(id: string, reason?: string): Promise<void> {
    await this.updateSubscriptionStatus(id, 'suspended', reason);
  }

  public async updateSubscriptionTier(id: string, tierId: string): Promise<AdminSubscription> {
    return this._patch<AdminSubscription>(`${API_PATH}/${id}/tier`, {
      tier_id: tierId
    });
  }

  // ==================== SEARCH AND FILTERING ====================

  public async searchSubscriptions(
    query: string,
    pagination: PaginationObject = DEFAULT_PAGINATION
  ): Promise<PaginatedResponse<AdminSubscription>> {
    const params = { ...pagination, search: query };
    return this._list<AdminSubscription>(`${API_PATH}/search`, params);
  }

  public async getSubscriptionsByChannel(
    channelId: string,
    pagination: PaginationObject = DEFAULT_PAGINATION
  ): Promise<PaginatedResponse<AdminSubscription>> {
    return this.getAllSubscriptions(pagination, { channel_id: channelId });
  }

  public async getSubscriptionsByUser(
    userId: string,
    pagination: PaginationObject = DEFAULT_PAGINATION
  ): Promise<PaginatedResponse<AdminSubscription>> {
    return this.getAllSubscriptions(pagination, { user_id: userId });
  }
} 