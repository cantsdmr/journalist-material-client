import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

// Set an authentication header if the user is authenticated.
const setAuthHeader = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Handle unauthorized access
      // You can log out the user or redirect to the login page
    }
    return Promise.reject(error);
  }
);


//------------------------------------Basic Ops------------------------------------

// HTTP GET request
const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.get(url, config);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error as AxiosError);
  }
};

// HTTP POST request
const post = async <T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.post(url, data, config);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error as AxiosError);
  }
};

// HTTP PUT request
const put = async <T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.put(url, data, config);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error as AxiosError);
  }
};

// HTTP DELETE request
const remove = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.delete(url, config);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error as AxiosError);
  }
};

// Handle Axios errors and convert them into a standard format
const handleAxiosError = (error: AxiosError) => {
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
const Api = { 
    setAuthHeader, get, post, put, remove
}
export { Api };
