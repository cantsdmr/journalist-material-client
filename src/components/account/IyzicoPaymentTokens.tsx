import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { useApiContext } from '@/contexts/ApiContext';

interface IyzicoPaymentTokensProps {
  onSuccess: (tokenData: any) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

interface UserInfo {
  name: string;
  surname: string;
  email: string;
}

const IyzicoPaymentTokens: React.FC<IyzicoPaymentTokensProps> = ({
  onSuccess,
  onError,
  disabled = false
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const { api } = useApiContext();

  // Get user info when component mounts
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const profile = await api.app.account.getProfile();
        if (profile?.displayName && profile?.email) {
          // Parse display name into first and last name
          const nameParts = profile.displayName.trim().split(' ');
          const firstName = nameParts[0] || 'User';
          const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Name';
          
          setUserInfo({
            name: firstName,
            surname: lastName,
            email: profile.email
          });
        } else {
          setError('Unable to retrieve user information. Please ensure your profile is complete.');
        }
      } catch (err: any) {
        console.error('Failed to fetch user info:', err);
        setError('Failed to retrieve user information');
      }
    };

    fetchUserInfo();
  }, [api]);

  // Get user IP address
  const getUserIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || '127.0.0.1';
    } catch {
      return '127.0.0.1'; // Fallback IP
    }
  };

  const handlePayWithIyzico = async () => {
    if (!userInfo) {
      setError('User information is not available');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const userIP = await getUserIP();

      // Initialize Iyzico tokenization session
      const initResponse = await api.app.iyzicoToken.initializeTokenization({
        name: userInfo.name,
        surname: userInfo.surname,
        email: userInfo.email,
        ip: userIP
      });

      if (!initResponse.sessionToken) {
        throw new Error('Failed to initialize Iyzico session');
      }

      setSessionToken(initResponse.sessionToken);

      // If we get checkoutFormContent, we need to render it
      // If we get paymentPageUrl, we can redirect to it
      if (initResponse.checkoutFormContent) {
        // For iframe/embedded checkout
        const newWindow = window.open('', 'IyzicoCheckout', 'width=800,height=600');
        if (newWindow) {
          newWindow.document.write(initResponse.checkoutFormContent);
          newWindow.document.close();
          
          // Listen for messages from the checkout window
          window.addEventListener('message', handleCheckoutMessage, false);
          
          // Check if window is closed manually
          const checkClosed = setInterval(() => {
            if (newWindow.closed) {
              clearInterval(checkClosed);
              window.removeEventListener('message', handleCheckoutMessage, false);
              setLoading(false);
              setError('Payment window was closed');
            }
          }, 1000);
        } else {
          throw new Error('Failed to open payment window. Please allow popups.');
        }
      } else if (initResponse.paymentPageUrl) {
        // For direct redirect
        window.open(initResponse.paymentPageUrl, 'IyzicoCheckout', 'width=800,height=600');
      } else {
        throw new Error('No checkout method provided by Iyzico');
      }

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to initialize Iyzico payment';
      setError(errorMessage);
      onError(errorMessage);
      setLoading(false);
    }
  };

  const handleCheckoutMessage = async (event: MessageEvent) => {
    // Handle messages from Iyzico checkout
    if (event.origin !== window.location.origin) {
      // For security, only accept messages from same origin or Iyzico domains
      // In production, you'd want to validate this more carefully
      return;
    }

    if (event.data && event.data.type === 'IYZICO_CHECKOUT_SUCCESS') {
      try {
        if (!sessionToken || !userInfo) {
          throw new Error('Session information is missing');
        }

        const userIP = await getUserIP();

        // Complete the tokenization process
        const tokenResponse = await api.app.iyzicoToken.savePaymentMethod({
          sessionToken,
          name: userInfo.name,
          surname: userInfo.surname,
          email: userInfo.email,
          ip: userIP
        });

        // Clean up
        window.removeEventListener('message', handleCheckoutMessage, false);
        setLoading(false);

        // Notify parent component of success
        onSuccess(tokenResponse);

      } catch (err: any) {
        const errorMessage = err.message || 'Failed to save Iyzico payment method';
        setError(errorMessage);
        onError(errorMessage);
        setLoading(false);
      }
    } else if (event.data && event.data.type === 'IYZICO_CHECKOUT_ERROR') {
      window.removeEventListener('message', handleCheckoutMessage, false);
      setLoading(false);
      const errorMessage = event.data.message || 'Payment failed';
      setError(errorMessage);
      onError(errorMessage);
    } else if (event.data && event.data.type === 'IYZICO_CHECKOUT_CANCEL') {
      window.removeEventListener('message', handleCheckoutMessage, false);
      setLoading(false);
      console.log('Iyzico payment cancelled by user');
    }
  };

  if (!userInfo) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Loading user information...
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
        Kartınızı güvenli bir şekilde Iyzico ile kaydedin
      </Typography>
      
      <Button
        variant="contained"
        onClick={handlePayWithIyzico}
        disabled={disabled || loading || !userInfo}
        sx={{
          backgroundColor: '#1B4332',
          color: 'white',
          '&:hover': {
            backgroundColor: '#2D5A3D'
          },
          '&:disabled': {
            backgroundColor: '#ccc'
          },
          minHeight: '48px',
          minWidth: '200px',
          fontWeight: 'bold'
        }}
      >
        {loading ? 'İyzico ile Bağlanıyor...' : 'İyzico ile Ödeme Ekle'}
      </Button>
      
      {loading && (
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
          Güvenli ödeme sayfasına yönlendiriliyorsunuz...
        </Typography>
      )}

      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
        Kart bilgileriniz Iyzico'nun güvenli sisteminde saklanır
      </Typography>

      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
        İşlem tamamlandıktan sonra pop-up pencereyi kapatabilirsiniz
      </Typography>
    </Box>
  );
};

export default IyzicoPaymentTokens;