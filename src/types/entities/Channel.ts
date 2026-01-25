import { PaymentProvider } from "./Account";
import { User } from "./User";
import { USER_ROLE } from "@/enums/UserEnums";

export type Channel = {
    id: string;
    name: string;
    description: string;
    handle: string;
    createdAt: Date;
    updatedAt: Date;
    logoUrl?: string;
    bannerUrl?: string;
    status: number;
    defaultCurrency: string;
    tags?: string[];
    tiers?: ChannelTier[];
    stats?: ChannelStats;
    creatorId: string;
    isSubscribed?: boolean;
};

export type TierPaymentConfig = {
    id: string;
    tierId: string;
    providerId: string;
    providerProductId: string;
    providerPlanId: string;
    isActive: boolean;
    config?: Record<string, any>;
    provider?: {
        id: string;
        code: string;
        name: string;
        isActive: boolean;
    };
};

export type ChannelTier = {
    id: string;
    name: string;
    description: string;
    price: number;
    channelId: string;
    order: number;
    isDefault: boolean;
    maxSubscribers?: number;
    benefits: any[];
    currency: string;
    paymentProviders?: PaymentProvider[];  // Multi-provider support (legacy)
    paymentConfigs?: TierPaymentConfig[];  // New multi-provider configs
};

export type ChannelStats = {
    activeSubscriptionCount: number;
    paidSubscriptionCount: number;
    popularityScore: number;
    newsCount: number;
    pollCount: number;
    tierCount: number;
};

export type ChannelStaff = {
    id: string;
    userId: string;
    role: keyof typeof USER_ROLE;
    channelId: string;
    user: User;
    channel: Channel;
    createdAt: string;
};

export type ChannelSubscriber = {
    id: string;
    userId: string;
    channelId: string;
    user: User;
    channel: Channel;
    createdAt: string;
};

export type ChannelSubscription = {
    id: string;
    channelId: string;
    status: number;
    subscribedAt: string;
    expiresAt: string;
    tierId: string;
    createdAt: string;
    tier: SubscriptionTier;
    channel?: Channel;
    user?: User;
}; 

export type SubscriptionTier = {
    id: string;
    name: string;
    description: string;
    price: number;
    channelId: string;
    order: number;
    benefits: any[];
};