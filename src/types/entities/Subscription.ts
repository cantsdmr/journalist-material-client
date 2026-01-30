import { SubscriptionStatus } from "@/enums/SubscriptionEnums";

export type Subscription = {
  id: string;
  userId: string;
  channelId: string;
  tierId: string;
  statusId: SubscriptionStatus;
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
  paymentDetails?: Array<{
    id: string;
    subscriptionId: string;
    providerId: string;
    providerSubscriptionId: string;
    providerStatus: string;
    metadata?: Record<string, any>;
    provider?: {
      id: string;
      code: string;
      name: string;
    };
  }>;
};

export type AdminSubscription = {
  id: string;
  userId: string;
  channelId: string;
  tierId: string;
  statusId: SubscriptionStatus;
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
  user: {
    id: string;
    email: string;
    displayName: string;
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

export type SubscriptionBillingCycle = {
  id: string;
  subscriptionId: string;
  cycleNumber: number;
  periodStart: Date;
  periodEnd: Date;
  amount: number;
  currency: string;
  statusId: SubscriptionStatus;
  chargedAt?: Date;
  transactionId?: string;
  providerBillingId?: string;
  errorMessage?: string;
  retryCount: number;
  nextRetryAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  subscription?: Subscription;
  transaction?: any; // Import from Transaction.ts when needed
}; 