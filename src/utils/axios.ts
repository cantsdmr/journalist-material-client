import axios, { AxiosError, AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
// const ENV = import.meta.env.VITE_ENV;

export class AxiosJournalist {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
                // 'X-Environment': ENV
            }
        });
      
        // Only keep logging and other cross-cutting concerns
        this.instance.interceptors.request.use(
            (config) => {
                // Log requests in development
                if (import.meta.env.DEV) {
                    console.log('API Request:', {
                        method: config.method?.toUpperCase(),
                        url: config.url,
                        data: config.data
                    });
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.instance.interceptors.response.use(
            (response) => {
                // Log successful responses in development
                if (import.meta.env.DEV) {
                    console.log('API Response:', {
                        method: response.config.method?.toUpperCase(),
                        url: response.config.url,
                        status: response.status,
                        data: response.data
                    });
                }
                return response;
            },
            (error: AxiosError) => {
                // Only log errors, don't handle them - let useApiCall handle all error logic
                if (import.meta.env.DEV) {
                    console.error('API Error:', {
                        method: error.config?.method?.toUpperCase(),
                        url: error.config?.url,
                        status: error.response?.status,
                        message: error.response?.data,
                    });
                }
                return Promise.reject(error);
            }
        );
    }

    public get axiosInstance(): AxiosInstance {
        return this.instance;
    }

    // Handle Axios errors and convert them into a standard format
    public handleAxiosError = (error: AxiosError) => {
        if (error.response) {
            return {
                status: error.response.status,
                data: error.response.data,
            };
        } else {
            return {
                status: 500, // Default status for network errors
                data: 'Network Error',
            };
        }
    };
}