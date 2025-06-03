import { ChannelStaff, ChannelSubscription } from "./Channel";

export type UserProfile = {
  id: string;
  externalId: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  roleId: number;
  statusId: number;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  subscriptions?: ChannelSubscription[];
  staffChannels?: ChannelStaff[];
};

export type PaymentMethodType = {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
};

export type PaymentMethod = {
  id: string;
  typeId: number;
  type: PaymentMethodType;
  currency: string;
  isDefault: boolean;
  expiresAt?: string;
  lastUsedAt?: string;
  details: {
    email?: string; // PayPal
    cardNumber?: string; // iyzico (masked)
    expiryMonth?: number; // iyzico
    expiryYear?: number; // iyzico
    cardHolderName?: string; // iyzico
    [key: string]: any;
  };
};

export type Subscription = {
  id: string;
  channel_id: string;
  channel_name: string;
  tier_id: string;
  tier_name: string;
  tier_price: number;
  currency: string;
  status: 'active' | 'canceled' | 'expired' | 'suspended';
  started_at: string;
  expires_at?: string;
  canceled_at?: string;
};