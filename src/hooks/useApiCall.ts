import { useState, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';

interface UseApiCallOptions {
  showSuccessMessage?: boolean;
  successMessage?: string;
  showErrorToast?: boolean; // Whether to show error toast (default: true, but axios interceptor will handle validation errors)
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
      showErrorToast = false // Default to false since axios interceptor handles most errors
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
      
      // Only show error toast if explicitly requested and it's not a validation error
      // (validation errors are handled by axios interceptor)
      if (showErrorToast && err?.response?.status !== 400) {
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