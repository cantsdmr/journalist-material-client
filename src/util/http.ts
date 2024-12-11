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

export interface Collection<T>{
  items: T[]
  _meta: Meta
}

export class HTTPApi<T, P, R> {
  private axiosJ;
  private apiPath;

  constructor(axiosJ: AxiosJournalist, apiPath: string) {
    this.axiosJ = axiosJ
    this.apiPath = apiPath
  }

  public list = async (path: string, query?: Record<string, any> , config?: AxiosRequestConfig): Promise<Collection<T>> => {
    const params = new URLSearchParams(query);
    const paramString = params.size === 0 ? '' : `?${params.toString()}`
    return this._list(`${this.apiPath}${path}${paramString}`, config);
  };

  public get = async (id: string, config?: AxiosRequestConfig): Promise<T> => {
      return this._get(`${this.apiPath}/${id}`, config);
  };

  public create = async (data: P, config?: AxiosRequestConfig): Promise<T> => {
      return this._post(this.apiPath, data, config);
  };

  public replace = async (id: string, data: R, config?: AxiosRequestConfig): Promise<T> => {
      return this._put(`${this.apiPath}/${id}`, data, config);
  };

  public update = async (id: string, data: R, config?: AxiosRequestConfig): Promise<T> => {
      return this._put(`${this.apiPath}/${id}`, data, config);
  };

  public remove = async (id: string, config?: AxiosRequestConfig): Promise<void> => {
      return this._remove(`${this.apiPath}/${id}`, config);
  };

  // HTTP GET request
  private _list = async (url: string, config?: AxiosRequestConfig): Promise<Collection<T>> => {
    try {
      const response: AxiosResponse<Collection<T>> = await this.axiosJ.axiosInstance.get(url, config);
      return response.data;
    } catch (error) {
      throw this.axiosJ.handleAxiosError(error as AxiosError);
    }
  };
  
  // HTTP GET request
  protected _get = async (url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await this.axiosJ.axiosInstance.get(url, config);
      return response.data;
    } catch (error) {
      throw this.axiosJ.handleAxiosError(error as AxiosError);
    }
  };

  // HTTP POST request
  protected _post = async (url: string, data: P, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await this.axiosJ.axiosInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.axiosJ.handleAxiosError(error as AxiosError);
    }
  };

  // HTTP PUT request
  protected _put = async (url: string, data: R, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await this.axiosJ.axiosInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this.axiosJ.handleAxiosError(error as AxiosError);
    }
  };

  // HTTP PUT request
  protected _patch = async (url: string, data: T, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await this.axiosJ.axiosInstance.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw this.axiosJ.handleAxiosError(error as AxiosError);
    }
  };

  // HTTP DELETE request
  protected _remove = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      try {
        const response: AxiosResponse<T> = await this.axiosJ.axiosInstance.delete(url, config);
        return response.data;
      } catch (error) {
        throw this.axiosJ.handleAxiosError(error as AxiosError);
      }
  };
}
