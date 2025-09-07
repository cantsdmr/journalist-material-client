import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Alert,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Grid,
  Paper,
  Collapse,
  Avatar,
  CardActionArea,
  useTheme
} from '@mui/material';
import { 
  Add, 
  Delete, 
  Star, 
  CreditCard, 
  ExpandLess,
  CheckCircle,
  RadioButtonUnchecked,
  Security,
  Speed,
  Verified
} from '@mui/icons-material';
import { useApiContext } from '@/contexts/ApiContext';
import { PaymentMethod, PaymentMethodTypeEnum } from '@/types/index';
import { useApiCall } from '@/hooks/useApiCall';

const PaymentMethodsTab: React.FC = () => {
  const theme = useTheme();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [connectingPayPal, setConnectingPayPal] = useState(false);
  
  const { api } = useApiContext();
  const { execute } = useApiCall();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    const methodsResult = await execute(
      () => api.accountApi.getPaymentMethods(),
      { showErrorToast: true }
    );
    
    if (methodsResult) {
      setPaymentMethods(methodsResult.data ?? []);
    }
    
    setLoading(false);
  };

  const handleSetDefault = async (paymentMethod: PaymentMethod) => {
    setError(null);
    
    const result = await execute(
      () => api.accountApi.setDefaultPaymentMethod(paymentMethod.id),
      {
        showSuccessMessage: true,
        successMessage: 'Default payment method updated'
      }
    );
    
    if (result) {
      await fetchData();
    }
  };

  const handleDelete = async () => {
    if (!selectedPaymentMethod) return;
    
    setError(null);
    
    const result = await execute(
      () => api.accountApi.deletePaymentMethod(selectedPaymentMethod.id),
      {
        showSuccessMessage: true,
        successMessage: 'Payment method deleted successfully'
      }
    );
    
    if (result) {
      await fetchData();
      setDeleteDialogOpen(false);
      setSelectedPaymentMethod(null);
    }
  };

  const openDeleteDialog = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedPaymentMethod(null);
  };

  const toggleAddSection = () => {
    setAddSectionOpen(!addSectionOpen);
  };

  const handlePaymentMethodAdded = () => {
    fetchData();
    setSuccess('Payment method added successfully');
    setAddSectionOpen(false);
  };

  const handlePayPalConnect = async () => {
    try {
      setConnectingPayPal(true);
      setError(null);

      const redirectUri = `${window.location.origin}/account/payment-methods/paypal/callback`;
      const response = await api.accountApi.generatePayPalOAuthUrl(redirectUri);
      const authUrl = response.data.authorization_url;

      const popup = window.open(
        authUrl,
        'paypal_oauth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup blocked! Please allow popups and try again.');
      }

      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'paypal_oauth_success') {
          const { code, state } = event.data;
          try {
            await api.accountApi.completePayPalOAuth(code, state, redirectUri);
            handlePaymentMethodAdded();
            popup.close();
          } catch (error: any) {
            setError(error.message || 'Failed to connect PayPal account');
            popup.close();
          }
          window.removeEventListener('message', handleMessage);
          setConnectingPayPal(false);
        } else if (event.data.type === 'paypal_oauth_error') {
          setError(event.data.message || 'PayPal authentication failed');
          popup.close();
          window.removeEventListener('message', handleMessage);
          setConnectingPayPal(false);
        }
      };

      window.addEventListener('message', handleMessage);

      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          setConnectingPayPal(false);
        }
      }, 1000);

    } catch (error: any) {
      setError(error.message || 'Failed to start PayPal authentication');
      setConnectingPayPal(false);
    }
  };

  const getPaymentMethodLogo = (typeId: number) => {
    switch (typeId) {
      case PaymentMethodTypeEnum.PAYPAL:
        return (
          <Avatar 
            sx={{ 
              bgcolor: '#0070ba', 
              width: 40, 
              height: 40,
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'white'
            }}
          >
            PayPal
          </Avatar>
        );
      case PaymentMethodTypeEnum.IYZICO:
        return (
          <Avatar 
            sx={{ 
              bgcolor: '#00a650', 
              width: 40, 
              height: 40,
              fontSize: '11px',
              fontWeight: 'bold',
              color: 'white'
            }}
          >
            iyzico
          </Avatar>
        );
      default:
        return (
          <Avatar sx={{ bgcolor: theme.palette.grey[400], width: 40, height: 40 }}>
            <CreditCard />
          </Avatar>
        );
    }
  };

  const getPaymentMethodDetails = (method: PaymentMethod) => {
    switch (method.typeId) {
      case PaymentMethodTypeEnum.PAYPAL:
        return method.details.email;
      case PaymentMethodTypeEnum.IYZICO:
        return `${method.details.cardNumber} • ${method.details.cardHolderName}`;
      default:
        return 'Payment method';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Stack spacing={2}>
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </Box>
                  <Skeleton variant="rectangular" width={100} height={32} />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              Payment Methods
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Securely manage your payment methods for subscriptions
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={addSectionOpen ? <ExpandLess /> : <Add />}
            onClick={toggleAddSection}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5
            }}
          >
            {addSectionOpen ? 'Close' : 'Add Payment Method'}
          </Button>
        </Box>

        {/* Add Payment Method Section */}
        <Collapse in={addSectionOpen}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 3, 
              border: `2px dashed ${theme.palette.divider}`,
              borderRadius: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Choose Payment Method
            </Typography>
            <Grid container spacing={2}>
              {/* PayPal Option */}
              <Grid item xs={12} md={6}>
                <Card 
                  elevation={0}
                  sx={{ 
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      boxShadow: `0 4px 12px ${theme.palette.primary.main}20`
                    }
                  }}
                >
                  <CardActionArea 
                    onClick={handlePayPalConnect}
                    disabled={connectingPayPal}
                    sx={{ p: 3 }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar 
                        sx={{ 
                          bgcolor: '#0070ba', 
                          width: 48, 
                          height: 48,
                          fontSize: '13px',
                          fontWeight: 'bold'
                        }}
                      >
                        PayPal
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          PayPal
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Connect your PayPal account securely
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Chip 
                            icon={<Security />} 
                            label="Secure" 
                            size="small" 
                            variant="outlined"
                          />
                          <Chip 
                            icon={<Speed />} 
                            label="Fast" 
                            size="small" 
                            variant="outlined"
                          />
                        </Stack>
                      </Box>
                      {connectingPayPal && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" color="primary" sx={{ mr: 1 }}>
                            Connecting...
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardActionArea>
                </Card>
              </Grid>

              {/* Credit Card Option */}
              <Grid item xs={12} md={6}>
                <Card 
                  elevation={0}
                  sx={{ 
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    opacity: 0.6,
                    position: 'relative'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar 
                        sx={{ 
                          bgcolor: '#00a650', 
                          width: 48, 
                          height: 48,
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }}
                      >
                        iyzico
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Credit/Debit Card
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Visa, Mastercard, and more
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Chip 
                            icon={<Verified />} 
                            label="Verified" 
                            size="small" 
                            variant="outlined"
                          />
                        </Stack>
                      </Box>
                    </Stack>
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        bgcolor: 'warning.main',
                        color: 'warning.contrastText',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '11px',
                        fontWeight: 600
                      }}
                    >
                      Coming Soon
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>

        {paymentMethods.length === 0 ? (
          <Paper 
            elevation={0} 
            sx={{ 
              textAlign: 'center', 
              py: 6, 
              px: 3,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              bgcolor: 'transparent'
            }}
          >
            <Box sx={{ mb: 3 }}>
              <CreditCard sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              No Payment Methods Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
              Add a secure payment method to start subscribing to your favorite channels and unlock premium content.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={toggleAddSection}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5
              }}
            >
              Add Your First Payment Method
            </Button>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {paymentMethods.map((method) => (
              <Card 
                key={method.id}
                elevation={0}
                sx={{ 
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: method.isDefault ? theme.palette.primary.main : theme.palette.grey[400],
                    boxShadow: `0 2px 8px ${theme.palette.grey[300]}30`
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={3} alignItems="center">
                    {getPaymentMethodLogo(method.typeId)}
                    
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {method.type.name}
                        </Typography>
                        {method.isDefault && (
                          <Chip 
                            icon={<CheckCircle />}
                            label="Default" 
                            size="small" 
                            color="primary" 
                            variant="filled"
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                      </Stack>
                      
                      <Typography variant="body1" sx={{ mb: 0.5, fontFamily: 'monospace' }}>
                        {getPaymentMethodDetails(method)}
                      </Typography>
                      
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {method.currency.toUpperCase()}
                        </Typography>
                        {method.lastUsedAt && (
                          <>
                            <Box sx={{ width: 4, height: 4, bgcolor: 'text.secondary', borderRadius: '50%' }} />
                            <Typography variant="body2" color="text.secondary">
                              Last used {new Date(method.lastUsedAt).toLocaleDateString()}
                            </Typography>
                          </>
                        )}
                      </Stack>
                    </Box>
                    
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        onClick={() => handleSetDefault(method)}
                        disabled={method.isDefault}
                        title={method.isDefault ? "Already default" : "Set as default"}
                        sx={{ 
                          color: method.isDefault ? 'primary.main' : 'text.secondary',
                          '&:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' }
                        }}
                      >
                        {method.isDefault ? <Star /> : <RadioButtonUnchecked />}
                      </IconButton>
                      <IconButton
                        onClick={() => openDeleteDialog(method)}
                        sx={{ 
                          color: 'text.secondary',
                          '&:hover': { bgcolor: 'error.main', color: 'error.contrastText' }
                        }}
                        title="Delete payment method"
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>


      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Payment Method</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this payment method?
            {selectedPaymentMethod?.isDefault && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                This is your default payment method. You'll need to set another payment method as default.
              </Alert>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentMethodsTab; 