import { AxiosJournalist } from "@/utils/axios";
import { HTTPApi } from "@/utils/http";

const API_PATH = '/api/iyzico-tokens';

export interface IyzicoTokenizationRequest {
  name: string;
  surname: string;
  email: string;
  ip: string;
}

export interface IyzicoTokenizationResponse {
  sessionToken: string;
  checkoutFormContent?: string;
  paymentPageUrl?: string;
}

export interface IyzicoSavePaymentMethodRequest {
  sessionToken: string;
  name: string;
  surname: string;
  email: string;
  ip: string;
}

export interface IyzicoSavePaymentMethodResponse {
  success: boolean;
  message: string;
  data: {
    payment_method: any;
  };
}

export class IyzicoTokenAPI extends HTTPApi {
  constructor(axiosJ: AxiosJournalist) {
    super(axiosJ, API_PATH);
  }
  
  /**
   * Initialize Iyzico tokenization session
   */
  async initializeTokenization(request: IyzicoTokenizationRequest): Promise<IyzicoTokenizationResponse> {
    return this._post<IyzicoTokenizationResponse>(`${API_PATH}/tokenization/init`, request);
  }

  /**
   * Save Iyzico payment method using session token (after external authentication)
   */
  async savePaymentMethod(request: IyzicoSavePaymentMethodRequest): Promise<IyzicoSavePaymentMethodResponse> {
    return this._post<IyzicoSavePaymentMethodResponse>(`${API_PATH}/tokenization/save`, request);
  }

  /**
   * Get stored cards for user
   */
  async getStoredCards(): Promise<{ data: any[] }> {
    return this._get<any>(`${API_PATH}/cards`);
  }

  /**
   * Delete stored card
   */
  async deleteStoredCard(cardId: string): Promise<{ data: any }> {
    return this._remove<any>(`${API_PATH}/cards/${cardId}`);
  }
}

export default IyzicoTokenAPI;