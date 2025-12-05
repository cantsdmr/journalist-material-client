import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi } from "@/utils/http";

const API_PATH = '/api/payment-tokens';

export interface PayPalTokenizationOrder {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export interface PayPalTokenizationResult {
  capture_id: string;
  payment_token?: string;
  payer_info?: any;
}

export class PaymentTokenAPI extends HTTPApi {
  constructor(axiosJ: AxiosJournalist) {
    super(axiosJ, API_PATH);
  }
  
  /**
   * Create PayPal tokenization order
   */
  async createPayPalTokenizationOrder() {
    return this._post<PayPalTokenizationOrder>(`${API_PATH}/paypal/orders`, {});
  }

  /**
   * Capture PayPal tokenization order and get payment token
   */
  async capturePayPalTokenizationOrder(orderId: string) {
    return this._post<PayPalTokenizationResult>(`${API_PATH}/paypal/orders/${orderId}/capture`, {});
  }

  /**
   * Get payment token details
   */
  async getPaymentTokenDetails(tokenId: string): Promise<{ data: any }> {
    return this._get<any>(`${API_PATH}/paypal/tokens/${tokenId}`);
  }

  /**
   * Delete payment token
   */
  async deletePaymentToken(tokenId: string): Promise<{ data: any }> {
    return this._remove<any>(`${API_PATH}/paypal/tokens/${tokenId}`);
  }
}

export default PaymentTokenAPI;