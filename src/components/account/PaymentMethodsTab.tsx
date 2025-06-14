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
  Grid
} from '@mui/material';
import { Add, Delete, Star, StarBorder, CreditCard, AccountBalanceWallet } from '@mui/icons-material';
import { useApiContext } from '@/contexts/ApiContext';
import { PaymentMethod, PaymentMethodType } from '@/types/index';
import { AddPaymentMethodDialog } from '@/components/account/AddPaymentMethodDialog';
import { useApiCall } from '@/hooks/useApiCall';

const PaymentMethodsTab: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [availableTypes, setAvailableTypes] = useState<PaymentMethodType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  
  const { api } = useApiContext();
  const { execute } = useApiCall();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    const [methodsResult, typesResult] = await Promise.all([
      execute(
        () => api.accountApi.getPaymentMethods(),
        { showErrorToast: true }
      ),
      execute(
        () => api.accountApi.getAvailablePaymentMethods(),
        { showErrorToast: true }
      )
    ]);
    
    if (methodsResult) {
      setPaymentMethods(methodsResult.items ?? []);
    }
    
    if (typesResult) {
      setAvailableTypes(typesResult.items ?? []);
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

  const openAddDialog = () => {
    setAddDialogOpen(true);
  };

  const closeAddDialog = () => {
    setAddDialogOpen(false);
  };

  const handlePaymentMethodAdded = () => {
    fetchData();
    setSuccess('Payment method added successfully');
  };

  const getPaymentMethodIcon = (typeId: number) => {
    switch (typeId) {
      case 3: // PayPal
        return <AccountBalanceWallet />;
      case 4: // iyzico
        return <CreditCard />;
      default:
        return <CreditCard />;
    }
  };

  const getPaymentMethodDetails = (method: PaymentMethod) => {
    switch (method.typeId) {
      case 3: // PayPal
        return method.details.email;
      case 4: // iyzico
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
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Payment Methods</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openAddDialog}
          >
            Add Payment Method
          </Button>
        </Box>

        {paymentMethods.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <CreditCard sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Payment Methods
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add a payment method to subscribe to channels
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={openAddDialog}
              >
                Add Your First Payment Method
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {paymentMethods.map((method) => (
              <Grid item xs={12} md={6} key={method.id}>
                <Card>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      {getPaymentMethodIcon(method.typeId)}
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                          <Typography variant="subtitle1">
                            {method.type.name}
                          </Typography>
                          {method.isDefault && (
                            <Chip label="Default" size="small" color="primary" />
                          )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {getPaymentMethodDetails(method)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {method.currency.toUpperCase()}
                        </Typography>
                        {method.lastUsedAt && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Last used: {new Date(method.lastUsedAt).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleSetDefault(method)}
                          disabled={method.isDefault}
                          title={method.isDefault ? "Already default" : "Set as default"}
                        >
                          {method.isDefault ? <Star color="primary" /> : <StarBorder />}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => openDeleteDialog(method)}
                          color="error"
                          title="Delete payment method"
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>

      {/* Add Payment Method Dialog */}
      <AddPaymentMethodDialog
        open={addDialogOpen}
        onClose={closeAddDialog}
        onSuccess={handlePaymentMethodAdded}
        availableTypes={availableTypes}
      />

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