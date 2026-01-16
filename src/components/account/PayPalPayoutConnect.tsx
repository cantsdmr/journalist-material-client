import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useApiContext } from '@/contexts/ApiContext';

interface PayPalPayoutConnectProps {
  onSuccess: (data: { payerId: string; email: string }) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

/**
 * PayPal Payout Connect Component
 * Uses PayPal's AAC (Account Acquisition and Consent) flow to collect
 * payer ID and email for sending payouts TO users.
 *
 * This is different from payment collection - this is for PAYOUTS.
 */
const PayPalPayoutConnect: React.FC<PayPalPayoutConnectProps> = ({
  onSuccess,
  onError,
  disabled = false
}) => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { api } = useApiContext();

  // Get PayPal Client ID and Merchant ID from environment variables
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID ;
  const PAYPAL_MERCHANT_ID = import.meta.env.VITE_PAYPAL_MERCHANT_ID;
  const PAYPAL_ENV = import.meta.env.VITE_PAYPAL_ENV || 'sandbox';

  useEffect(() => {
    // Check if PayPal AAC SDK is already loaded
    if (window.paypal?.PayoutsAAC) {
      setIsSDKLoaded(true);
      return;
    }

    // Load PayPal AAC SDK for Payouts
    const script = document.createElement('script');
    script.src = 'https://www.paypalobjects.com/payouts/js/payouts_aac.js';
    script.async = true;

    script.onload = () => {
      setIsSDKLoaded(true);
    };

    script.onerror = () => {
      const errorMsg = 'Failed to load PayPal Payouts SDK';
      setError(errorMsg);
      onError(errorMsg);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [onError]);

  useEffect(() => {
    if (!isSDKLoaded || disabled || !containerRef.current || !window.paypal?.PayoutsAAC) return;

    // Clear any existing content
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    try {
      // Render PayPal AAC button for collecting payout information
      window.paypal.PayoutsAAC.render({
        env: PAYPAL_ENV,
        clientId: {
          sandbox: PAYPAL_CLIENT_ID
        },
        merchantId: PAYPAL_MERCHANT_ID,
        pageType: 'login', // Can be 'signup' or 'login'
        onLogin: async (response: any) => {
          if (response.err) {
            console.error('PayPal AAC error:', response.err);
            const errorMsg = 'Failed to connect PayPal account';
            setError(errorMsg);
            onError(errorMsg);
            setLoading(false);
            return;
          }

          try {
            setLoading(true);
            setError(null);

            // The authorization code from PayPal
            const authCode = response.body.code;

            // Exchange authorization code for payer information via backend
            const payerInfo = await api.app.account.exchangePayPalAuthCode(authCode);

            if (!payerInfo.payerId || !payerInfo.email) {
              throw new Error('Failed to retrieve payer information from PayPal');
            }

            // Save the PayPal payout method
            await api.app.account.savePayPalPayoutMethod({
              payerId: payerInfo.payerId,
              email: payerInfo.email
            });

            onSuccess(payerInfo);
          } catch (err: any) {
            const errorMsg = err.message || 'Failed to save PayPal payout method';
            setError(errorMsg);
            onError(errorMsg);
          } finally {
            setLoading(false);
          }
        }
      }, `#${containerRef.current.id}`);
    } catch (err: any) {
      console.error('Error rendering PayPal AAC:', err);
      const errorMsg = 'Failed to initialize PayPal connection';
      setError(errorMsg);
      onError(errorMsg);
    }
  }, [isSDKLoaded, disabled, PAYPAL_CLIENT_ID, PAYPAL_MERCHANT_ID, PAYPAL_ENV, api, onSuccess, onError]);

  if (!isSDKLoaded) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <CircularProgress size={24} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Loading PayPal...
        </Typography>
      </Box>
    );
  }

  if (!PAYPAL_MERCHANT_ID) {
    return (
      <Alert severity="error">
        PayPal Merchant ID is not configured. Please contact support.
      </Alert>
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
        Connect your PayPal account to receive payouts securely
      </Typography>

      {/* PayPal AAC Button will render here */}
      <div
        id="paypal-payout-connect-container"
        ref={containerRef}
        style={{ minHeight: '50px' }}
      />

      {loading && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <CircularProgress size={16} />
          <Typography variant="caption" color="text.secondary">
            Connecting to PayPal...
          </Typography>
        </Box>
      )}

      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
        Your PayPal email will be used to send you payouts
      </Typography>
    </Box>
  );
};

export default PayPalPayoutConnect;
