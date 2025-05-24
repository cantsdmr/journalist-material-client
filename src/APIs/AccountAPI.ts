import { HTTPApi } from "@/utils/http";
import { AxiosJournalist } from "@/utils/axios";

export type UserProfile = {
  id: string;
  email: string;
  display_name: string;
  photo_url?: string;
  handle?: string;
  role: number;
  status: number;
  last_login?: string;
};

export type UpdateProfileData = {
  display_name?: string;
  photo_url?: string;
  handle?: string;
};

export type PaymentMethodType = {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
};

export type PaymentMethod = {
  id: string;
  type_id: number;
  type: PaymentMethodType;
  currency: string;
  is_default: boolean;
  expires_at?: string;
  last_used_at?: string;
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
  status: 'active' | 'canceled' | 'expired';
  started_at: string;
  expires_at?: string;
  canceled_at?: string;
};

export type SubscribeData = {
  tier_id: string;
  payment_method_id?: string;
};

const API_PATH = '/api/account';

export class AccountAPI extends HTTPApi {
  constructor(axiosJ: AxiosJournalist) {
    super(axiosJ, API_PATH);
  }

  // Profile methods
  public async getProfile(): Promise<UserProfile> {
    return this._get<UserProfile>(`${API_PATH}/profile`);
  }

  public async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    return this._put<UserProfile>(`${API_PATH}/profile`, data);
  }

  // Payment Methods
  public async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await this._get<{ success: boolean; data: PaymentMethod[] }>(`${API_PATH}/payment-methods`);
    return response.data;
  }

  public async addPaymentMethod(data: AddPaymentMethodData): Promise<PaymentMethod> {
    const response = await this._post<{ success: boolean; data: PaymentMethod; message: string }>(`${API_PATH}/payment-methods`, data);
    return response.data;
  }

  public async updatePaymentMethod(paymentMethodId: string, data: UpdatePaymentMethodData): Promise<PaymentMethod> {
    const response = await this._put<{ success: boolean; data: PaymentMethod; message: string }>(`${API_PATH}/payment-methods/${paymentMethodId}`, data);
    return response.data;
  }

  public async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    await this._remove<{ success: boolean; message: string }>(`${API_PATH}/payment-methods/${paymentMethodId}`);
  }

  public async setDefaultPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
    const response = await this._patch<{ success: boolean; data: PaymentMethod; message: string }>(`${API_PATH}/payment-methods/${paymentMethodId}/default`, {});
    return response.data;
  }

  public async getAvailablePaymentMethods(): Promise<PaymentMethodType[]> {
    const response = await this._get<{ success: boolean; data: PaymentMethodType[] }>(`${API_PATH}/payment-methods/available`);
    return response.data;
  }

  // Subscriptions
  public async getSubscriptions(): Promise<Subscription[]> {
    const response = await this._get<{ success: boolean; data: Subscription[] }>(`${API_PATH}/subscriptions`);
    return response.data;
  }

  public async subscribe(channelId: string, data: SubscribeData): Promise<Subscription> {
    const response = await this._post<{ success: boolean; data: Subscription; message: string }>(`${API_PATH}/subscriptions/${channelId}`, data);
    return response.data;
  }

  public async cancelSubscription(subscriptionId: string): Promise<void> {
    await this._remove<{ success: boolean; message: string }>(`${API_PATH}/subscriptions/${subscriptionId}`);
  }
} 