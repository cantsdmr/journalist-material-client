import { useCallback } from 'react';
import { useAppContext } from '@/contexts/AppContext';

export const useApp = () => {
  const context = useAppContext();
  
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }

  const withLoading = useCallback(async <T>(promise: Promise<T>): Promise<T> => {
    try {
      context.startLoading();
      const result = await promise;
      return result;
    } catch (error) {
      context.setError(error instanceof Error ? error : new Error('Unknown error'));
      throw error;
    } finally {
      context.stopLoading();
    }
  }, [context]);

  const isFullyInitialized = context.initialized.api && context.initialized.user;

  return {
    ...context,
    withLoading,
    
    isFullyInitialized
  };
}; 