import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Stack,
  Alert,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useApiContext } from '@/contexts/ApiContext';
import { PaymentMethodTypeEnum, AddPaymentMethodData } from '@/types/index';
import PayPalPayoutConnect from './PayPalPayoutConnect';
import IyzicoPaymentTokens from './IyzicoPaymentTokens';

interface AddPaymentMethodDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availableTypes: Array<{ id: number; name: string; description?: string }>;
}

const AddPaymentMethodDialog: React.FC<AddPaymentMethodDialogProps> = ({
  open,
  onClose,
  onSuccess,
  availableTypes
}) => {
  const [formData, setFormData] = useState<AddPaymentMethodData>({
    typeId: 0,
    currency: 'USD',
    isDefault: false,
    details: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { api } = useApiContext();

  const handleClose = () => {
    setFormData({
      typeId: 0,
      currency: 'USD',
      isDefault: false,
      details: {}
    });
    setError(null);
    onClose();
  };


  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.typeId) {
        setError('Please select a payment method type');
        return;
      }

      // PayPal now uses Payment Tokens - should not reach here for PayPal
      if (formData.typeId === PaymentMethodTypeEnum.PAYPAL) {
        setError('Please use the PayPal Connect button for PayPal accounts');
        return;
      }

      // Iyzico now uses Pay with iyzico - should not reach here for Iyzico
      if (formData.typeId === PaymentMethodTypeEnum.IYZICO) {
        setError('Please use the Pay with iyzico button to add your card securely');
        return;
      }

      await api.app.account.addPayoutMethod(formData);
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add payment method');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    
    if (field.startsWith('details.')) {
      const detailField = field.replace('details.', '');
      setFormData(prev => ({
        ...prev,
        details: {
          ...prev.details,
          [detailField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSelectChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const selectedType = availableTypes.find(type => type.id === formData.typeId);

  const renderPaymentFields = () => {
    switch (formData.typeId) {
      case PaymentMethodTypeEnum.PAYPAL:
        return (
          <PayPalPayoutConnect
            onSuccess={() => {
              onSuccess();
              handleClose();
            }}
            onError={(error) => setError(error)}
            disabled={loading}
          />
        );
      
      case PaymentMethodTypeEnum.IYZICO:
        return (
          <IyzicoPaymentTokens
            onSuccess={() => {
              onSuccess();
              handleClose();
            }}
            onError={(error) => setError(error)}
            disabled={loading}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Payment Method</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <FormControl fullWidth required>
            <InputLabel>Payment Method Type</InputLabel>
            <Select
              value={formData.typeId}
              onChange={handleSelectChange('typeId')}
              label="Payment Method Type"
            >
              <MenuItem value={0}>Select a payment method</MenuItem>
              {availableTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedType && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedType.description}
              </Typography>
              {formData.typeId === PaymentMethodTypeEnum.PAYPAL && (
                <Typography variant="body2" color="primary" sx={{ mb: 2, fontWeight: 'medium' }}>
                  Click the Connect with PayPal button below to securely link your account for receiving payouts
                </Typography>
              )}
              {formData.typeId === PaymentMethodTypeEnum.IYZICO && (
                <Typography variant="body2" color="primary" sx={{ mb: 2, fontWeight: 'medium' }}>
                  Click the Pay with iyzico button below to securely add your card
                </Typography>
              )}
              {renderPaymentFields()}
            </Box>
          )}

          {formData.typeId !== PaymentMethodTypeEnum.PAYPAL && formData.typeId !== PaymentMethodTypeEnum.IYZICO && (
            <>
              <FormControl fullWidth required>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.currency}
                  onChange={handleSelectChange('currency')}
                  label="Currency"
                >
                  <MenuItem value="USD">USD - US Dollar</MenuItem>
                  <MenuItem value="EUR">EUR - Euro</MenuItem>
                  <MenuItem value="TRY">TRY - Turkish Lira</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isDefault}
                    onChange={handleInputChange('isDefault')}
                  />
                }
                label="Set as default payment method"
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        {formData.typeId !== PaymentMethodTypeEnum.PAYPAL && formData.typeId !== PaymentMethodTypeEnum.IYZICO && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !formData.typeId}
          >
            {loading ? 'Adding...' : 'Add Payment Method'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export { AddPaymentMethodDialog }; 