import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';

interface UseApiCallOptions {
  showSuccessMessage?: boolean;
  successMessage?: string;
  showErrorToast?: boolean; // Whether to show error toast (default: true, axios interceptor handles validation errors separately)
}

interface UseApiCallReturn<T> {
  loading: boolean;
  error: string | null;
  execute: (apiCall: () => Promise<T>, options?: UseApiCallOptions) => Promise<T | null>;
  clearError: () => void;
}

export const useApiCall = <T = any>(): UseApiCallReturn<T> => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useNotification();

  const execute = useCallback(async (
    apiCall: () => Promise<T>,
    options: UseApiCallOptions = {}
  ): Promise<T | null> => {
    const {
      showSuccessMessage = false,
      successMessage = 'Operation completed successfully',
      showErrorToast = true // Default to true, but validation errors (400) are handled by axios interceptor
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
      const errorMessage = err?.response?.data?.message || err?.message || 'An error occurred';
      setError(errorMessage);
      
      // Log error for debugging (only in development)
      if (import.meta.env.DEV) {
        console.error('API Call Error:', {
          url: err?.config?.url,
          method: err?.config?.method,
          status: err?.response?.status,
          message: errorMessage,
          response: err?.response?.data
        });
      }
      
      // Show error toast if requested, but skip validation errors since axios interceptor handles them
      // Validation errors (400) with structured error format are handled globally
      const isValidationError = err?.response?.status === 400 && 
                               err?.response?.data?.status === 'error' && 
                               err?.response?.data?.errors;
      
      if (showErrorToast && !isValidationError) {
        showError(errorMessage);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

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