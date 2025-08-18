import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Stack,
  Alert,
  FormControlLabel,
  Checkbox,
  Grid
} from '@mui/material';
import { useApiContext } from '@/contexts/ApiContext';
import { PaymentMethodTypeEnum, AddPaymentMethodData } from '@/types/index';

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

      // Validate PayPal fields
      if (formData.typeId === PaymentMethodTypeEnum.PAYPAL && !formData.details.email) {
        setError('PayPal email is required');
        return;
      }

      // Validate iyzico fields
      if (formData.typeId === PaymentMethodTypeEnum.IYZICO) {
        const { cardNumber, expiryMonth, expiryYear, cvv, cardHolderName } = formData.details;
        if (!cardNumber || !expiryMonth || !expiryYear || !cvv || !cardHolderName) {
          setError('All card details are required for iyzico');
          return;
        }
      }

      await api.accountApi.addPaymentMethod(formData);
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
          <TextField
            label="PayPal Email"
            type="email"
            value={formData.details.email || ''}
            onChange={handleInputChange('details.email')}
            fullWidth
            required
            placeholder="your-email@example.com"
          />
        );
      
      case PaymentMethodTypeEnum.IYZICO:
        return (
          <Stack spacing={2}>
            <TextField
              label="Card Number"
              value={formData.details.cardNumber || ''}
              onChange={handleInputChange('details.cardNumber')}
              fullWidth
              required
              placeholder="1234 5678 9012 3456"
            />
            <TextField
              label="Card Holder Name"
              value={formData.details.cardHolderName || ''}
              onChange={handleInputChange('details.cardHolderName')}
              fullWidth
              required
              placeholder="John Doe"
            />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="Expiry Month"
                  type="number"
                  value={formData.details.expiryMonth || ''}
                  onChange={handleInputChange('details.expiryMonth')}
                  fullWidth
                  required
                  inputProps={{ min: 1, max: 12 }}
                  placeholder="MM"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Expiry Year"
                  type="number"
                  value={formData.details.expiryYear || ''}
                  onChange={handleInputChange('details.expiryYear')}
                  fullWidth
                  required
                  inputProps={{ min: new Date().getFullYear() }}
                  placeholder="YYYY"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="CVV"
                  type="password"
                  value={formData.details.cvv || ''}
                  onChange={handleInputChange('details.cvv')}
                  fullWidth
                  required
                  inputProps={{ maxLength: 4 }}
                  placeholder="123"
                />
              </Grid>
            </Grid>
          </Stack>
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
              {renderPaymentFields()}
            </Box>
          )}

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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.typeId}
        >
          {loading ? 'Adding...' : 'Add Payment Method'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { AddPaymentMethodDialog }; 