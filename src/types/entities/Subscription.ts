export type Subscription = {
  id: string;
  userId: string;
  channelId: string;
  tierId: string;
  statusId: number;
  notificationLevelId: number;
  subscribedAt: string;
  expiresAt?: string;
  renewalDate?: string;
  paymentReference?: string;
  totalContributions: number;
  monthlyContribution: number;
  autoContribute: boolean;
  contributionLimit?: number;
  createdAt: string;
  updatedAt: string;
  tier: {
    id: string;
    name: string;
    price: number;
    currency: string;
  };
  channel: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    email: string;
    displayName: string;
  };
};

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
  statusId: number;
  startedAt: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
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