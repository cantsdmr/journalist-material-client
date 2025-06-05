import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { AxiosError } from 'axios';

interface UseApiCallOptions {
  showSuccessMessage?: boolean;
  successMessage?: string;
  showErrorToast?: boolean;
  customErrorHandler?: (error: any) => boolean; // Return true to prevent default error handling
}

interface UseApiCallReturn<T> {
  loading: boolean;
  error: string | null;
  execute: (apiCall: () => Promise<T>, options?: UseApiCallOptions) => Promise<T | null>;
  clearError: () => void;
}

// Error type detection helpers
const isValidationError = (error: AxiosError): boolean => {
  return error?.response?.status === 400 && 
         (error.response.data as any)?.status === 'error' && 
         (error.response.data as any)?.errors;
};

const isAuthError = (error: AxiosError): boolean => {
  return error?.response?.status === 401;
};

const isServerError = (error: AxiosError): boolean => {
  return (error?.response?.status || 0) >= 500;
};

const isNetworkError = (error: AxiosError): boolean => {
  return !error?.response;
};

/**
 * Enhanced API call hook that provides comprehensive error handling and loading states.
 * This is now the single source of truth for all API error handling.
 * 
 * Features:
 * - Automatic loading state management
 * - Comprehensive error type detection (validation, auth, server, network)
 * - Flexible notification options
 * - Custom error handling support
 * - TypeScript generics for type safety
 * 
 * @example Basic usage:
 * ```tsx
 * const { loading, error, execute } = useApiCall<User>();
 * 
 * const handleSubmit = async () => {
 *   const user = await execute(() => api.createUser(userData), {
 *     showSuccessMessage: true,
 *     successMessage: 'User created successfully!'
 *   });
 * };
 * ```
 * 
 * @example Custom error handling:
 * ```tsx
 * const result = await execute(() => api.deleteUser(id), {
 *   customErrorHandler: (error) => {
 *     if (error?.response?.status === 409) {
 *       showWarning('Cannot delete user with active sessions');
 *       return true; // Prevent default error handling
 *     }
 *     return false; // Use default error handling
 *   }
 * });
 * ```
 */
export const useApiCall = <T = any>(): UseApiCallReturn<T> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError, showValidationErrors } = useNotification();

  const execute = useCallback(async (
    apiCall: () => Promise<T>,
    options: UseApiCallOptions = {}
  ): Promise<T | null> => {
    const {
      showSuccessMessage = false,
      successMessage = 'Operation completed successfully',
      showErrorToast = true,
      customErrorHandler
    } = options;

    try {
      setLoading(true);
      setError(null);
      
      const result = await apiCall();
      
      if (showSuccessMessage) {
        showSuccess(successMessage);
      }
      
      return result;
    } catch (err: any) {
      // Allow custom error handling first
      if (customErrorHandler && customErrorHandler(err)) {
        return null;
      }

      const axiosError = err as AxiosError;
      let errorMessage = 'An error occurred';
      let shouldShowToast = showErrorToast;

      // Handle different error types
      if (isValidationError(axiosError)) {
        // Handle validation errors with structured format
        const responseData = axiosError.response?.data as any;
        errorMessage = responseData.message || 'Validation failed';
        setError(errorMessage);
        
        if (shouldShowToast && showValidationErrors) {
          showValidationErrors(responseData.errors);
          shouldShowToast = false; // Don't show generic toast since we showed validation errors
        }
      } else if (isAuthError(axiosError)) {
        // Handle authentication errors
        errorMessage = 'Unauthorized access. Please log in again.';
        setError(errorMessage);
        
        if (shouldShowToast) {
          showError(errorMessage);
        }
      } else if (isServerError(axiosError)) {
        // Handle server errors
        errorMessage = 'Server error. Please try again later.';
        setError(errorMessage);
        
        if (shouldShowToast) {
          showError(errorMessage);
        }
      } else if (isNetworkError(axiosError)) {
        // Handle network errors
        errorMessage = 'Network error. Please check your connection.';
        setError(errorMessage);
        
        if (shouldShowToast) {
          showError(errorMessage);
        }
      } else {
        // Handle other errors (400 without validation structure, etc.)
        const responseData = axiosError.response?.data as any;
        errorMessage = responseData?.message || axiosError.message || 'An error occurred';
        setError(errorMessage);
        
        if (shouldShowToast) {
          showError(errorMessage);
        }
      }

      // Log error for debugging (only in development)
      if (import.meta.env.DEV) {
        console.error('API Call Error:', {
          url: axiosError?.config?.url,
          method: axiosError?.config?.method,
          status: axiosError?.response?.status,
          message: errorMessage,
          response: axiosError?.response?.data
        });
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError, showValidationErrors]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError
  };
}; 