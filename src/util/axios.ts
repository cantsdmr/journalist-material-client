import axios, { AxiosError, AxiosInstance } from 'axios';

export class AxiosJournalist {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({
            baseURL: 'http://localhost:3000',
        });
      
        this.instance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response.status === 401) {
                // Handle unauthorized access
                // You can log out the user or redirect to the login page
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