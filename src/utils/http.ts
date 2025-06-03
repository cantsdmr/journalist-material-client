import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { AxiosJournalist } from './axios';
import { PaginatedResponse } from '../types/ApiTypes';

// Re-export commonly used types for convenience
export type { 
  PaginatedResponse, 
  ListResponse, 
  Meta, 
  PaginatedCollection, 
  Collection, 
  PaginationObject, 
} from '../types/ApiTypes';

export { DEFAULT_PAGINATION } from '../types/ApiTypes';

// ============================================================================
// HTTP CLIENT CLASS
// ============================================================================

export class HTTPApi {
  protected axiosJ: AxiosJournalist;
  protected apiPath: string;

  constructor(axiosJ: AxiosJournalist, apiPath: string) {
    this.axiosJ = axiosJ;
    this.apiPath = apiPath;
  }

  // Base HTTP methods with generics
  protected _list = async <T>(url: string, query?: Record<string, any>, config?: AxiosRequestConfig): Promise<PaginatedResponse<T>> => {
    try {
      const params = new URLSearchParams(query);
      const paramString = params.size === 0 ? '' : `?${params.toString()}`
      const response: AxiosResponse<PaginatedResponse<T>> = await this.axiosJ.axiosInstance.get(`${url}${paramString}`, config);
      return response.data;
    } catch (error) {
      throw this.axiosJ.handleAxiosError(error as AxiosError);
    }
  };

  protected _listAll = async <T>(url: string, query?: Record<string, any>, config?: AxiosRequestConfig): Promise<PaginatedResponse<T>> => {
    try {
      const params = new URLSearchParams(query);
      const paramString = params.size === 0 ? '' : `?${params.toString()}`
      const response: AxiosResponse<PaginatedResponse<T>> = await this.axiosJ.axiosInstance.get(`${url}${paramString}`, config);
      return response.data;
    } catch (error) {
      throw this.axiosJ.handleAxiosError(error as AxiosError);
    }
  };

  protected _get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await this.axiosJ.axiosInstance.get(url, config);
      return response.data;
    } catch (error) {
      throw this.axiosJ.handleAxiosError(error as AxiosError);
    }
  };

  protected _post = async <T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await this.axiosJ.axiosInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.axiosJ.handleAxiosError(error as AxiosError);
    }
  };

  protected _patch = async <T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await this.axiosJ.axiosInstance.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw this.axiosJ.handleAxiosError(error as AxiosError);
    }
  };

  protected _put = async <T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await this.axiosJ.axiosInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this.axiosJ.handleAxiosError(error as AxiosError);
    }
  };

  protected _remove = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await this.axiosJ.axiosInstance.delete(url, config);
      return response.data;
    } catch (error) {
      throw this.axiosJ.handleAxiosError(error as AxiosError);
    }
  };
}
