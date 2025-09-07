import { AxiosJournalist } from "@/utils/axios";
import { DEFAULT_PAGINATION, HTTPApi, PaginationObject } from "@/utils/http";
import { 
    UserProfile, 
    PaymentMethod, 
    PaymentMethodType, 
    Subscription, 
    UpdateProfileData, 
    AddPaymentMethodData, 
    UpdatePaymentMethodData, 
    SubscribeData,
    Channel 
} from "../types";

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
    return this._get<{ data: PaymentMethod[], pagination: any }>(`${API_PATH}/payment-methods`);
  }

  public async getPaymentMethod(paymentMethodId: string) {
    return this._get<PaymentMethod>(`${API_PATH}/payment-methods/${paymentMethodId}`);
  }

  public async getDefaultPaymentMethod() {
    return this._get<PaymentMethod>(`${API_PATH}/payment-methods/default`);
  }

  public async addPaymentMethod(data: AddPaymentMethodData) {
    return this._post<{ data: PaymentMethod }>(`${API_PATH}/payment-methods`, data);
  }

  public async updatePaymentMethod(paymentMethodId: string, data: UpdatePaymentMethodData) {
    return this._put<{ data: PaymentMethod }>(`${API_PATH}/payment-methods/${paymentMethodId}`, data);
  }

  public async deletePaymentMethod(paymentMethodId: string) {
    return this._remove<void>(`${API_PATH}/payment-methods/${paymentMethodId}`);
  }

  public async setDefaultPaymentMethod(paymentMethodId: string) {
    return this._patch<{ data: PaymentMethod }>(`${API_PATH}/payment-methods/${paymentMethodId}/default`, {});
  }

  public async getAvailablePaymentMethods() {
    return this._get<PaymentMethodType[]>(`${API_PATH}/payment-methods/available`);
  }

  // ============= PAYPAL OAUTH METHODS =============

  /**
   * Generate PayPal OAuth authorization URL
   */
  public async generatePayPalOAuthUrl(redirectUri: string) {
    return this._post<{ success: boolean; data: { authorization_url: string } }>(
      `${API_PATH}/payment-methods/paypal/oauth/url`,
      { redirect_uri: redirectUri }
    );
  }

  /**
   * Complete PayPal OAuth flow and create payment method
   */
  public async completePayPalOAuth(code: string, state: string, redirectUri: string) {
    return this._post<{ success: boolean; message: string; data: PaymentMethod }>(
      `${API_PATH}/payment-methods/paypal/oauth/complete`,
      { code, state, redirect_uri: redirectUri }
    );
  }


  public async getSubscriptions() {
    return this._list<Subscription>(`${API_PATH}/subscriptions`);
  }

  public async subscribe(channelId: string, data: SubscribeData) {
    return this._post<Subscription>(`${API_PATH}/subscriptions/${channelId}`, data);
  }

  public async cancelSubscription(subscriptionId: string){
    return this._remove<void>(`${API_PATH}/subscriptions/${subscriptionId}`);
  }

  public async getUserChannels(pagination: PaginationObject = DEFAULT_PAGINATION) {
    return this._list<Channel>(`${API_PATH}/channels`, pagination);
  }
} 