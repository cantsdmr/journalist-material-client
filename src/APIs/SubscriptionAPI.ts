import { HTTPApi, PaginationObject, DEFAULT_PAGINATION, PaginatedCollection } from "@/utils/http";
import { AxiosJournalist } from "@/utils/axios";

// Admin subscription types
export type AdminSubscription = {
  id: string;
  user: {
    id: string;
    email: string;
    display_name: string;
  };
  channel: {
    id: string;
    name: string;
  };
  tier: {
    id: string;
    name: string;
    price: number;
    currency: string;
  };
  status: 'active' | 'canceled' | 'expired' | 'suspended';
  started_at: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
};

export type SubscriptionAnalytics = {
  period: string;
  total_subscriptions: number;
  new_subscriptions: number;
  canceled_subscriptions: number;
  active_subscriptions: number;
  churn_rate: number;
  revenue_by_currency: Record<string, number>;
};

export type RevenueMetrics = {
  period: string;
  metrics: Array<{
    currency: string;
    total_revenue: number;
    subscription_count: number;
    average_revenue_per_user: number;
    channels: Record<string, {
      name: string;
      revenue: number;
      subscriptions: number;
    }>;
  }>;
};

export type BulkUpdateResult = {
  success: number;
  failed: number;
  errors: string[];
};

export type SubscriptionFilters = {
  status?: 'active' | 'canceled' | 'expired' | 'suspended';
  channel_id?: string;
  user_id?: string;
  tier_id?: string;
  start_date?: string;
  end_date?: string;
};

export type AnalyticsOptions = {
  period?: string; // e.g., "30d", "7d", "90d"
  channel_id?: string;
};

export type RevenueOptions = {
  period?: string;
  channel_id?: string;
  currency?: string;
};

export type BulkUpdateData = {
  action: 'cancel' | 'activate' | 'suspend' | 'update_tier';
  subscription_ids: string[];
  reason?: string;
  tier_id?: string; // Required for update_tier action
};

// Response wrapper types
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

const API_PATH = '/api/subscriptions';

export class SubscriptionAPI extends HTTPApi {
  constructor(axiosJ: AxiosJournalist) {
    super(axiosJ, API_PATH);
  }

  // ADMIN VIEWPOINT: Platform-wide subscription management
  public async getAllSubscriptions(
    pagination: PaginationObject = DEFAULT_PAGINATION,
    filters: SubscriptionFilters = {}
  ): Promise<PaginatedCollection<AdminSubscription>> {
    const params = { ...pagination, ...filters };
    return this._list<AdminSubscription>(API_PATH, params);
  }

  public async getSubscriptionById(id: string): Promise<AdminSubscription> {
    const response = await this._get<ApiResponse<AdminSubscription>>(`${API_PATH}/${id}`);
    return response.data;
  }

  public async updateSubscriptionStatus(
    id: string, 
    status: 'active' | 'canceled' | 'expired' | 'suspended',
    reason?: string
  ): Promise<AdminSubscription> {
    const response = await this._patch<ApiResponse<AdminSubscription>>(`${API_PATH}/${id}/status`, {
      status,
      reason
    });
    return response.data;
  }

  public async bulkUpdateSubscriptions(data: BulkUpdateData): Promise<BulkUpdateResult> {
    const response = await this._post<ApiResponse<BulkUpdateResult>>(`${API_PATH}/bulk-update`, data);
    return response.data;
  }

  // Analytics endpoints
  public async getSubscriptionAnalytics(options: AnalyticsOptions = {}): Promise<SubscriptionAnalytics> {
    const params = new URLSearchParams(options as Record<string, string>).toString();
    const url = params ? `${API_PATH}/analytics?${params}` : `${API_PATH}/analytics`;
    const response = await this._get<ApiResponse<SubscriptionAnalytics>>(url);
    return response.data;
  }

  public async getRevenueMetrics(options: RevenueOptions = {}): Promise<RevenueMetrics> {
    const params = new URLSearchParams(options as Record<string, string>).toString();
    const url = params ? `${API_PATH}/revenue?${params}` : `${API_PATH}/revenue`;
    const response = await this._get<ApiResponse<RevenueMetrics>>(url);
    return response.data;
  }

  // Export functionality for admin reports
  public async exportSubscriptions(
    filters: SubscriptionFilters = {},
    format: 'csv' | 'xlsx' = 'csv'
  ): Promise<Blob> {
    const params = new URLSearchParams({ ...filters, format } as Record<string, string>).toString();
    const url = params ? `${API_PATH}/export?${params}` : `${API_PATH}/export`;
    return this._get<Blob>(url);
  }

  // Subscription lifecycle management
  public async cancelSubscription(id: string, reason?: string): Promise<void> {
    await this.updateSubscriptionStatus(id, 'canceled', reason);
  }

  public async activateSubscription(id: string, reason?: string): Promise<void> {
    await this.updateSubscriptionStatus(id, 'active', reason);
  }

  public async suspendSubscription(id: string, reason?: string): Promise<void> {
    await this.updateSubscriptionStatus(id, 'suspended', reason);
  }

  // Tier management for subscriptions
  public async updateSubscriptionTier(id: string, tierId: string): Promise<AdminSubscription> {
    const response = await this._patch<ApiResponse<AdminSubscription>>(`${API_PATH}/${id}/tier`, {
      tier_id: tierId
    });
    return response.data;
  }

  // Search and filtering helpers
  public async searchSubscriptions(
    query: string,
    pagination: PaginationObject = DEFAULT_PAGINATION
  ): Promise<PaginatedCollection<AdminSubscription>> {
    const params = { ...pagination, search: query };
    return this._list<AdminSubscription>(`${API_PATH}/search`, params);
  }

  public async getSubscriptionsByChannel(
    channelId: string,
    pagination: PaginationObject = DEFAULT_PAGINATION
  ): Promise<PaginatedCollection<AdminSubscription>> {
    return this.getAllSubscriptions(pagination, { channel_id: channelId });
  }

  public async getSubscriptionsByUser(
    userId: string,
    pagination: PaginationObject = DEFAULT_PAGINATION
  ): Promise<PaginatedCollection<AdminSubscription>> {
    return this.getAllSubscriptions(pagination, { user_id: userId });
  }
} 