import { DEFAULT_PAGINATION, HTTPApi, PaginatedCollection, PaginationObject } from "@/utils/http";
import { AxiosJournalist } from "@/utils/axios";
import { Channel, ChannelMembership } from "./ChannelAPI";
import { ChannelTier } from "./ChannelAPI";

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
  memberships?: ChannelMembership[];
  channelUsers?: ChannelUser[];
};

export type UpdateProfileData = {
  displayName?: string;
  photoUrl?: string;
  roleId?: number;
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

export type AddPaymentMethodData = {
  type_id: number;
  currency: string;
  is_default?: boolean;
  details: {
    email?: string; // PayPal
    cardNumber?: string; // iyzico
    expiryMonth?: number; // iyzico
    expiryYear?: number; // iyzico
    cvv?: string; // iyzico
    cardHolderName?: string; // iyzico
    [key: string]: any;
  };
};

export type UpdatePaymentMethodData = {
  currency?: string;
  is_default?: boolean;
  details?: {
    email?: string; // PayPal
    cardNumber?: string; // iyzico
    expiryMonth?: number; // iyzico
    expiryYear?: number; // iyzico
    cvv?: string; // iyzico
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

export type SubscribeData = {
  tier_id: string;
  payment_method_id?: string;
};

export type ChannelUser = {
  id: string;
  name: string;
  description: string;
  userRole: {
    id: number;
    name: string;
    joinedAt: string;
    lastActiveAt: string;
  };
  tiers: ChannelTier[];
};

const API_PATH = '/api/account';

export class AccountAPI extends HTTPApi {
  constructor(axiosJ: AxiosJournalist) {
    super(axiosJ, API_PATH);
  }

  public async getProfile() {
    return this._get<UserProfile>(`${API_PATH}/profile`);
  }

  public async updateProfile(data: UpdateProfileData) {
    return this._put<UserProfile>(`${API_PATH}/profile`, data);
  }

  public async getPaymentMethods() {
    return this._get<PaginatedCollection<PaymentMethod>>(`${API_PATH}/payment-methods`);
  }

  public async addPaymentMethod(data: AddPaymentMethodData) {
    return this._post<PaymentMethod>(`${API_PATH}/payment-methods`, data);
  }

  public async updatePaymentMethod(paymentMethodId: string, data: UpdatePaymentMethodData) {
    return this._put<PaymentMethod>(`${API_PATH}/payment-methods/${paymentMethodId}`, data);
  }

  public async deletePaymentMethod(paymentMethodId: string) {
    return this._remove<void>(`${API_PATH}/payment-methods/${paymentMethodId}`);
  }

  public async setDefaultPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
    return this._patch<PaymentMethod>(`${API_PATH}/payment-methods/${paymentMethodId}/default`, {});
  }

  public async getAvailablePaymentMethods(): Promise<PaginatedCollection<PaymentMethodType>> {
    return this._list<PaymentMethodType>(`${API_PATH}/payment-methods/available`);
  }

  public async getSubscriptions(): Promise<PaginatedCollection<Subscription>> {
    return this._list<Subscription>(`${API_PATH}/subscriptions`);
  }

  public async subscribe(channelId: string, data: SubscribeData): Promise<Subscription> {
    return this._post<Subscription>(`${API_PATH}/subscriptions/${channelId}`, data);
  }

  public async cancelSubscription(subscriptionId: string){
    return this._remove<void>(`${API_PATH}/subscriptions/${subscriptionId}`);
  }

  public async getUserChannels(pagination: PaginationObject = DEFAULT_PAGINATION): Promise<PaginatedCollection<Channel>> {
    return this._list<Channel>(`${API_PATH}/channels`, pagination);
  }
} 