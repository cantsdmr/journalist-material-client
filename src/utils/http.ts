import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { AxiosJournalist } from './axios';

export interface Meta {
  offset: number
  limit: number
  total: number
  pageCount: number
  currentPage: number
  hasPrev: boolean
  hasNext: boolean
}

export interface PaginatedCollection<T>{
  items: T[]
  metadata: Meta
}

export interface Collection<T>{
  items: T[]
}

export type PaginationObject = {
  page?: number;
  limit?: number;
  order?: 'asc' | 'desc';
}

export const DEFAULT_PAGINATION: PaginationObject = {
  page: 1,
  limit: 10,
  order: 'desc'
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export class HTTPApi {
  protected axiosJ: AxiosJournalist;
  protected apiPath: string;

  constructor(axiosJ: AxiosJournalist, apiPath: string) {
    this.axiosJ = axiosJ;
    this.apiPath = apiPath;
  }

  // Base HTTP methods with generics
  protected _list = async <T>(url: string, query?: Record<string, any>, config?: AxiosRequestConfig): Promise<PaginatedCollection<T>> => {
    try {
      const params = new URLSearchParams(query);
      const paramString = params.size === 0 ? '' : `?${params.toString()}`
      const response: AxiosResponse<PaginatedCollection<T>> = await this.axiosJ.axiosInstance.get(`${url}${paramString}`, config);
      return response.data;
    } catch (error) {
      throw this.axiosJ.handleAxiosError(error as AxiosError);
    }
  };

  protected _listAll = async <T>(url: string, query?: Record<string, any>, config?: AxiosRequestConfig): Promise<Collection<T>> => {
    try {
      const params = new URLSearchParams(query);
      const paramString = params.size === 0 ? '' : `?${params.toString()}`
      const response: AxiosResponse<Collection<T>> = await this.axiosJ.axiosInstance.get(`${url}${paramString}`, config);
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
