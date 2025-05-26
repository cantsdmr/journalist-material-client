import { HTTPApi } from "@/utils/http";
import { AxiosJournalist } from "@/utils/axios";

export type UserProfile = {
  id: string;
  email: string;
  display_name: string;
  photo_url?: string;
  role: number;
  status: number;
  last_login?: string;
};

export type UpdateProfileData = {
  display_name?: string;
  photo_url?: string;
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
  status: 'active' | 'canceled' | 'expired' | 'suspended';
  started_at: string;
  expires_at?: string;
  canceled_at?: string;
};

export type SubscribeData = {
  tier_id: string;
  payment_method_id?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

const API_PATH = '/api/account';

export class AccountAPI extends HTTPApi {
  constructor(axiosJ: AxiosJournalist) {
    super(axiosJ, API_PATH);
  }

  public async getProfile(): Promise<UserProfile> {
    const response = await this._get<ApiResponse<UserProfile>>(`${API_PATH}/profile`);
    return response.data;
  }

  public async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await this._put<ApiResponse<UserProfile>>(`${API_PATH}/profile`, data);
    return response.data;
  }

  public async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await this._get<ApiResponse<PaymentMethod[]>>(`${API_PATH}/payment-methods`);
    return response.data;
  }

  public async addPaymentMethod(data: AddPaymentMethodData): Promise<PaymentMethod> {
    const response = await this._post<ApiResponse<PaymentMethod>>(`${API_PATH}/payment-methods`, data);
    return response.data;
  }

  public async updatePaymentMethod(paymentMethodId: string, data: UpdatePaymentMethodData): Promise<PaymentMethod> {
    const response = await this._put<ApiResponse<PaymentMethod>>(`${API_PATH}/payment-methods/${paymentMethodId}`, data);
    return response.data;
  }

  public async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    await this._remove<ApiResponse<void>>(`${API_PATH}/payment-methods/${paymentMethodId}`);
  }

  public async setDefaultPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
    const response = await this._patch<ApiResponse<PaymentMethod>>(`${API_PATH}/payment-methods/${paymentMethodId}/default`, {});
    return response.data;
  }

  public async getAvailablePaymentMethods(): Promise<PaymentMethodType[]> {
    const response = await this._get<ApiResponse<PaymentMethodType[]>>(`${API_PATH}/payment-methods/available`);
    return response.data;
  }

  public async getSubscriptions(): Promise<Subscription[]> {
    const response = await this._get<ApiResponse<Subscription[]>>(`${API_PATH}/subscriptions`);
    return response.data;
  }

  public async subscribe(channelId: string, data: SubscribeData): Promise<Subscription> {
    const response = await this._post<ApiResponse<Subscription>>(`${API_PATH}/subscriptions/${channelId}`, data);
    return response.data;
  }

  public async cancelSubscription(subscriptionId: string): Promise<void> {
    await this._remove<ApiResponse<void>>(`${API_PATH}/subscriptions/${subscriptionId}`);
  }
} 