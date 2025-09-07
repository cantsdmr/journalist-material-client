import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const PayPalOAuthCallbackPage: React.FC = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState<string>('Processing PayPal authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        if (error) {
          setStatus('error');
          setMessage(errorDescription || `PayPal authentication failed: ${error}`);
          
          // Send error message to parent window
          if (window.opener) {
            window.opener.postMessage({
              type: 'paypal_oauth_error',
              message: errorDescription || `PayPal authentication failed: ${error}`
            }, window.location.origin);
          }
          return;
        }

        if (!code || !state) {
          setStatus('error');
          setMessage('Missing authentication parameters');
          
          // Send error message to parent window
          if (window.opener) {
            window.opener.postMessage({
              type: 'paypal_oauth_error',
              message: 'Missing authentication parameters'
            }, window.location.origin);
          }
          return;
        }

        // Send success message to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'paypal_oauth_success',
            code,
            state
          }, window.location.origin);

          setStatus('success');
          setMessage('PayPal authentication successful! You can close this window.');
        } else {
          setStatus('error');
          setMessage('Unable to communicate with parent window');
        }

      } catch (error: any) {
        console.error('PayPal OAuth callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during authentication');
        
        // Send error message to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'paypal_oauth_error',
            message: 'An unexpected error occurred during authentication'
          }, window.location.origin);
        }
      }
    };

    handleCallback();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'success.main';
      case 'error':
        return 'error.main';
      default:
        return 'text.primary';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
        textAlign: 'center'
      }}
    >
      {status === 'processing' && (
        <CircularProgress sx={{ mb: 3 }} size={48} />
      )}
      
      <Typography 
        variant="h6" 
        sx={{ 
          color: getStatusColor(),
          mb: 2 
        }}
      >
        PayPal Authentication
      </Typography>
      
      <Typography 
        variant="body1" 
        sx={{ 
          color: getStatusColor(),
          maxWidth: 400 
        }}
      >
        {message}
      </Typography>

      {status === 'success' && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          This window will close automatically in a moment.
        </Typography>
      )}
    </Box>
  );
};

export default PayPalOAuthCallbackPage;