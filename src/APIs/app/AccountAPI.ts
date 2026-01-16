import { AxiosJournalist } from "@/utils/axios";
import { DEFAULT_PAGINATION, HTTPApi, PaginationObject } from "@/utils/http";
import {
    UserProfile,
    PaymentMethod,
    PaymentProvider,
    Subscription,
    UpdateProfileData,
    AddPaymentMethodData,
    UpdatePaymentMethodData,
    SubscribeData,
    Channel
} from "../../types";

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

  // Payout Methods endpoints (for receiving payouts)
  public async getPayoutMethods() {
    return this._list<{ data: PaymentMethod[], pagination: any }>(`${API_PATH}/payout-methods`);
  }

  public async getPayoutMethod(payoutMethodId: string) {
    return this._get<PaymentMethod>(`${API_PATH}/payout-methods/${payoutMethodId}`);
  }

  public async getDefaultPayoutMethod() {
    return this._get<PaymentMethod>(`${API_PATH}/payout-methods/default`);
  }

  public async addPayoutMethod(data: AddPaymentMethodData) {
    return this._post<{ data: PaymentMethod }>(`${API_PATH}/payout-methods`, data);
  }

  public async updatePayoutMethod(payoutMethodId: string, data: UpdatePaymentMethodData) {
    return this._put<{ data: PaymentMethod }>(`${API_PATH}/payout-methods/${payoutMethodId}`, data);
  }

  public async deletePayoutMethod(payoutMethodId: string) {
    return this._remove<void>(`${API_PATH}/payout-methods/${payoutMethodId}`);
  }

  public async setDefaultPayoutMethod(payoutMethodId: string) {
    return this._patch<{ data: PaymentMethod }>(`${API_PATH}/payout-methods/${payoutMethodId}/default`, {});
  }

  public async getAvailablePayoutMethods() {
    return this._get<PaymentProvider[]>(`${API_PATH}/payout-methods/available`);
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

  // PayPal AAC (Account Acquisition and Consent) methods for payout setup
  public async exchangePayPalAuthCode(authCode: string) {
    return this._post<{ payerId: string; email: string }>(`${API_PATH}/paypal/exchange-auth-code`, { authCode });
  }

  public async savePayPalPayoutMethod(data: { payerId: string; email: string }) {
    return this._post<PaymentMethod>(`${API_PATH}/paypal/save-payout-method`, data);
  }
} 