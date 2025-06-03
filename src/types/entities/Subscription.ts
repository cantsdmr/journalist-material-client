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