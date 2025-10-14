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
  useTheme,
  Divider
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
import PayPalPaymentTokens from './PayPalPaymentTokens';
import IyzicoPaymentTokens from './IyzicoPaymentTokens';

const PaymentMethodsTab: React.FC = () => {
  const theme = useTheme();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showPayPalDialog, setShowPayPalDialog] = useState(false);
  const [showIyzicoDialog, setShowIyzicoDialog] = useState(false);
  
  const { api } = useApiContext();
  const { execute } = useApiCall();

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handlePayPalConnect = () => {
    setShowPayPalDialog(true);
  };

  const handlePayPalSuccess = () => {
    setShowPayPalDialog(false);
    handlePaymentMethodAdded();
    setSuccess('PayPal account connected successfully!');
  };

  const handlePayPalError = (error: string) => {
    setError(error);
    setShowPayPalDialog(false);
  };

  const handleIyzicoConnect = () => {
    setShowIyzicoDialog(true);
  };

  const handleIyzicoSuccess = () => {
    setShowIyzicoDialog(false);
    handlePaymentMethodAdded();
    setSuccess('Iyzico card added successfully!');
  };

  const handleIyzicoError = (error: string) => {
    setError(error);
    setShowIyzicoDialog(false);
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
      case PaymentMethodTypeEnum.IYZICO: {
        // For tokenized Iyzico payments, show card type and last 4 digits
        const cardType = method.details.cardAssociation || 'Card';
        const lastFour = method.details.lastFourDigits || '****';
        return `${cardType} •••• ${lastFour}`;
      }
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
    <Box>
      <Stack spacing={3}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            Payment Methods
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your payment methods for subscriptions
          </Typography>
        </Box>

        {/* PayPal Row */}
        <Stack spacing={0} divider={<Divider />} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
          <Box
            sx={{
              p: 2.5,
              display: 'flex',
              alignItems: 'center',
              gap: 2.5,
              transition: 'background-color 0.2s',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'
              }
            }}
          >
            {/* PayPal Logo */}
            <Box sx={{ flexShrink: 0 }}>
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
            </Box>

            {/* Details */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                PayPal
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                Connect your PayPal account securely
              </Typography>
            </Box>

            {/* Action */}
            <Box sx={{ flexShrink: 0, width: 100 }}>
              <Button
                onClick={handlePayPalConnect}
                size="small"
                variant="outlined"
                fullWidth
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 500
                }}
              >
                Connect
              </Button>
            </Box>
          </Box>

          {/* Iyzico Row */}
          <Box
            sx={{
              p: 2.5,
              display: 'flex',
              alignItems: 'center',
              gap: 2.5,
              transition: 'background-color 0.2s',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'
              }
            }}
          >
            {/* Iyzico Logo */}
            <Box sx={{ flexShrink: 0 }}>
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
            </Box>

            {/* Details */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Credit/Debit Card
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                Güvenli kart ödeme sistemi
              </Typography>
            </Box>

            {/* Action */}
            <Box sx={{ flexShrink: 0, width: 100 }}>
              <Button
                onClick={handleIyzicoConnect}
                size="small"
                variant="outlined"
                fullWidth
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 500
                }}
              >
                Add Card
              </Button>
            </Box>
          </Box>
        </Stack>

        {/* Connected Payment Methods */}
        {paymentMethods.length > 0 && (
          <>
            <Box sx={{ mt: 4, mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                Connected Methods
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your active payment methods
              </Typography>
            </Box>
            <Stack spacing={0} divider={<Divider />} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
              {paymentMethods.map((method, index) => (
                <Box
                  key={method.id}
                  sx={{
                    p: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2.5,
                    bgcolor: index % 2 === 0 ? 'transparent' : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'),
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
                    }
                  }}
                >
                  {/* Logo */}
                  <Box sx={{ flexShrink: 0 }}>
                    {getPaymentMethodLogo(method.typeId)}
                  </Box>

                  {/* Details */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {method.type.name}
                      </Typography>
                      {method.isDefault && (
                        <Chip
                          label="Default"
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText'
                          }}
                        />
                      )}
                    </Box>

                    <Typography variant="body2" color="text.primary" sx={{ mb: 0.5, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                      {getPaymentMethodDetails(method)}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {method.currency.toUpperCase()}
                      </Typography>
                      {method.lastUsedAt && (
                        <>
                          <Box sx={{ width: 3, height: 3, bgcolor: 'text.secondary', borderRadius: '50%', opacity: 0.5 }} />
                          <Typography variant="caption" color="text.secondary">
                            Last used {new Date(method.lastUsedAt).toLocaleDateString()}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                    {!method.isDefault && (
                      <Button
                        onClick={() => handleSetDefault(method)}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: 1.5,
                          textTransform: 'none',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          px: 1.5,
                          minWidth: 'auto'
                        }}
                      >
                        Set default
                      </Button>
                    )}
                    <IconButton
                      onClick={() => openDeleteDialog(method)}
                      size="small"
                      sx={{
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'error.main',
                          bgcolor: 'error.main',
                          color: 'white'
                        }
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Stack>
          </>
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

      {/* PayPal Connection Dialog */}
      <Dialog 
        open={showPayPalDialog} 
        onClose={() => setShowPayPalDialog(false)}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Connect PayPal Account</DialogTitle>
        <DialogContent>
          <PayPalPaymentTokens
            onSuccess={handlePayPalSuccess}
            onError={handlePayPalError}
            disabled={false}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPayPalDialog(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Iyzico Connection Dialog */}
      <Dialog 
        open={showIyzicoDialog} 
        onClose={() => setShowIyzicoDialog(false)}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Kart Ekleme</DialogTitle>
        <DialogContent>
          <IyzicoPaymentTokens
            onSuccess={handleIyzicoSuccess}
            onError={handleIyzicoError}
            disabled={false}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowIyzicoDialog(false)}>
            İptal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentMethodsTab; 