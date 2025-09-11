import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { useApiContext } from '@/contexts/ApiContext';

interface PayPalPaymentTokensProps {
  onSuccess: (paymentToken: any) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    paypal: any;
  }
}

const PayPalPaymentTokens: React.FC<PayPalPaymentTokensProps> = ({
  onSuccess,
  onError,
  disabled = false
}) => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paypalRef = useRef<HTMLDivElement>(null);
  const { api } = useApiContext();

  // Get PayPal Client ID from environment variables
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'AUvVGkHGJD8OKekE_4XxFzzKL8a8yLtJ3ZG1woE3OobNy57zyofuPIiUo-zZag0O_L1KPB_u4TB0tuJp';

  useEffect(() => {
    // Check if PayPal SDK is already loaded
    if (window.paypal) {
      setIsSDKLoaded(true);
      return;
    }

    // Load PayPal SDK with Connect Button components for Payment Tokens
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&components=buttons&vault=true`;
    script.async = true;
    
    script.onload = () => {
      setIsSDKLoaded(true);
    };
    
    script.onerror = () => {
      setError('Failed to load PayPal SDK');
      onError('Failed to load PayPal SDK');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [PAYPAL_CLIENT_ID, onError]);

  useEffect(() => {
    if (!isSDKLoaded || disabled || !paypalRef.current) return;

    // Clear any existing PayPal buttons
    if (paypalRef.current) {
      paypalRef.current.innerHTML = '';
    }

    // Render PayPal Connect Button for Payment Tokens
    if (window.paypal && window.paypal.Buttons) {
      window.paypal.Buttons({
        style: {
          layout: 'horizontal',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          tagline: false,
          height: 40
        },

        createOrder: async () => {
          try {
            setLoading(true);
            setError(null);

            // Create order for tokenization (minimal amount)
            const response = await api.paymentTokenApi.createPayPalTokenizationOrder();
            return response.id;
          } catch (err: any) {
            const errorMessage = err.message || 'Failed to initialize PayPal connection';
            setError(errorMessage);
            onError(errorMessage);
            setLoading(false);
            throw err;
          }
        },

        onApprove: async (data: any) => {
          try {
            // Capture the order and get payment token
            const response = await api.paymentTokenApi.capturePayPalTokenizationOrder(data.orderID);
            
            if (response.payment_token) {
              // Save payment method using the token
              await api.accountApi.savePayPalPaymentMethod({
                payment_token: response.payment_token,
                payer_id: data.payerID
              });

              onSuccess(response);
            } else {
              throw new Error('No payment token received from PayPal');
            }
          } catch (err: any) {
            const errorMessage = err.message || 'Failed to save PayPal payment method';
            setError(errorMessage);
            onError(errorMessage);
          } finally {
            setLoading(false);
          }
        },

        onError: (err: any) => {
          console.error('PayPal button error:', err);
          const errorMessage = 'PayPal connection failed. Please try again.';
          setError(errorMessage);
          onError(errorMessage);
          setLoading(false);
        },

        onCancel: () => {
          setLoading(false);
          console.log('PayPal connection cancelled by user');
        }
      }).render(paypalRef.current);
    }
  }, [isSDKLoaded, disabled, api, onSuccess, onError]);

  if (!isSDKLoaded) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Loading PayPal...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', py: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Connect your PayPal account securely using PayPal's secure tokenization
      </Typography>
      
      {/* PayPal Connect Button will render here */}
      <div ref={paypalRef} />
      
      {loading && (
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
          Connecting to PayPal...
        </Typography>
      )}

      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
        Your payment information is stored securely with PayPal
      </Typography>
    </Box>
  );
};

export default PayPalPaymentTokens;