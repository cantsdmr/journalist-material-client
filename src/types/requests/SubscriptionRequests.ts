export type BulkUpdateData = {
  action: 'cancel' | 'activate' | 'suspend' | 'update_tier';
  subscription_ids: string[];
  reason?: string;
  tier_id?: string; // Required for update_tier action
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