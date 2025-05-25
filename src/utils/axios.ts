import axios, { AxiosError, AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
// const ENV = import.meta.env.VITE_ENV;

// Global notification handler - will be set by the NotificationProvider
let globalNotificationHandler: {
  showValidationErrors?: (errors: any[]) => void;
  showError?: (message: string) => void;
} = {};

export const setGlobalNotificationHandler = (handler: typeof globalNotificationHandler) => {
  globalNotificationHandler = handler;
};

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
      
        this.instance.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                // Handle validation errors specifically
                if (error.response?.status === 400) {
                    const responseData = error.response.data as any;
                    
                    // Check if it's a validation error from our middleware
                    if (responseData?.status === 'error' && responseData?.errors) {
                        if (globalNotificationHandler.showValidationErrors) {
                            globalNotificationHandler.showValidationErrors(responseData.errors);
                        }
                    } else if (responseData?.message) {
                        // Generic error message
                        if (globalNotificationHandler.showError) {
                            globalNotificationHandler.showError(responseData.message);
                        }
                    }
                } else if (error.response?.status === 401) {
                    // Handle unauthorized access
                    console.log('Unauthorized access');
                    if (globalNotificationHandler.showError) {
                        globalNotificationHandler.showError('Unauthorized access. Please log in again.');
                    }
                } else if (error.response?.status >= 500) {
                    // Server errors
                    if (globalNotificationHandler.showError) {
                        globalNotificationHandler.showError('Server error. Please try again later.');
                    }
                } else if (!error.response) {
                    // Network errors
                    if (globalNotificationHandler.showError) {
                        globalNotificationHandler.showError('Network error. Please check your connection.');
                    }
                }
                
                return Promise.reject(error);
            }
        );
    }

    
    public get axiosInstance() : AxiosInstance {
        return this.instance
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