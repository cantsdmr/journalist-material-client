import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { setGlobalNotificationHandler } from '@/utils/axios';

export interface NotificationState {
  open: boolean;
  message: string;
  severity: AlertColor;
  autoHideDuration?: number;
}

export interface NotificationContextValue {
  showNotification: (message: string, severity?: AlertColor, autoHideDuration?: number) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  showValidationErrors: (errors: ValidationError[]) => void;
  hideNotification: () => void;
}

export interface ValidationError {
  property: string;
  constraints: Record<string, string>;
  value?: any; // Optional: the value that failed validation
  children?: ValidationError[]; // Optional: nested validation errors
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'info',
    autoHideDuration: 6000
  });

  const showNotification = useCallback((
    message: string, 
    severity: AlertColor = 'info', 
    autoHideDuration: number = 6000
  ) => {
    setNotification({
      open: true,
      message,
      severity,
      autoHideDuration
    });
  }, []);

  const showSuccess = useCallback((message: string) => {
    showNotification(message, 'success');
  }, [showNotification]);

  const showError = useCallback((message: string) => {
    showNotification(message, 'error');
  }, [showNotification]);

  const showWarning = useCallback((message: string) => {
    showNotification(message, 'warning');
  }, [showNotification]);

  const showInfo = useCallback((message: string) => {
    showNotification(message, 'info');
  }, [showNotification]);

  const showValidationErrors = useCallback((errors: ValidationError[]) => {
    if (errors.length === 0) return;
    
    // Helper function to format individual error
    const formatError = (error: ValidationError, prefix = ''): string => {
      const constraintMessages = Object.values(error.constraints || {});
      const errorText = `${prefix}${error.property}: ${constraintMessages.join(', ')}`;
      
      // Handle nested errors if present
      if (error.children && error.children.length > 0) {
        const childErrors = error.children.map(child => formatError(child, '  '));
        return `${errorText}\n${childErrors.join('\n')}`;
      }
      
      return errorText;
    };
    
    // Format all validation errors
    const errorMessages = errors.map(error => formatError(error));
    
    const message = errorMessages.length === 1 
      ? errorMessages[0]
      : `Validation errors:\n${errorMessages.map(msg => `• ${msg}`).join('\n')}`;
    
    showNotification(message, 'error', 10000); // Longer duration for validation errors
  }, [showNotification]);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  // Register notification handlers with axios utility
  useEffect(() => {
    setGlobalNotificationHandler({
      showValidationErrors,
      showError
    });
  }, [showValidationErrors, showError]);

  const contextValue: NotificationContextValue = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showValidationErrors,
    hideNotification
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={notification.autoHideDuration}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={hideNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            whiteSpace: 'pre-line' // Allow line breaks in validation error messages
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}; 