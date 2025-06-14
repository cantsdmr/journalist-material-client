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
    return this._list<PaymentMethod>(`${API_PATH}/payment-methods`);
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

  public async setDefaultPaymentMethod(paymentMethodId: string) {
    return this._patch<PaymentMethod>(`${API_PATH}/payment-methods/${paymentMethodId}/default`, {});
  }

  public async getAvailablePaymentMethods() {
    return this._list<PaymentMethodType>(`${API_PATH}/payment-methods/available`);
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