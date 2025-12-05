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
  TextField,
  Box,
  Typography,
  Stack,
  Alert,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useApiContext } from '@/contexts/ApiContext';
import { PaymentMethodTypeEnum } from '@/types/index';

interface AddPayoutMethodDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availableTypes: Array<{ id: number; name: string; description?: string }>;
}

interface PayoutFormData {
  typeId: number;
  currency: string;
  isDefault: boolean;
  // PayPal fields
  paypalEmail?: string;
  // Bank Transfer fields
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  iban?: string;
  swiftCode?: string;
  // Iyzico fields
  iyzicoRecipientType?: 'IDENTITY' | 'PHONE' | 'MEMBER' | 'IBAN';
  iyzicoIdentityNumber?: string;
  iyzicoPhoneNumber?: string;
  iyzicoMemberId?: string;
  iyzicoRecipientName?: string;
}

const AddPayoutMethodDialog: React.FC<AddPayoutMethodDialogProps> = ({
  open,
  onClose,
  onSuccess,
  availableTypes
}) => {
  const [formData, setFormData] = useState<PayoutFormData>({
    typeId: 0,
    currency: 'USD',
    isDefault: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { api } = useApiContext();

  const handleClose = () => {
    setFormData({
      typeId: 0,
      currency: 'USD',
      isDefault: false
    });
    setError(null);
    onClose();
  };

  const validatePayPalEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateIBAN = (iban: string): boolean => {
    // Basic IBAN validation (remove spaces, check length)
    const cleanIban = iban.replace(/\s/g, '');
    return cleanIban.length >= 15 && cleanIban.length <= 34;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.typeId) {
        setError('Please select a payout method type');
        return;
      }

      let payoutIdentifier = '';
      let payoutDetails: any = {};

      // Validate and build payout details based on type
      if (formData.typeId === PaymentMethodTypeEnum.PAYPAL) {
        if (!formData.paypalEmail) {
          setError('PayPal email is required');
          return;
        }

        if (!validatePayPalEmail(formData.paypalEmail)) {
          setError('Please enter a valid PayPal email address');
          return;
        }

        payoutIdentifier = formData.paypalEmail;
        payoutDetails = {
          email: formData.paypalEmail,
          type: 'PAYPAL'
        };
      } else if (formData.typeId === PaymentMethodTypeEnum.IYZICO) {
        // Iyzico payout validation
        if (!formData.iyzicoRecipientType) {
          setError('Please select a recipient type for Iyzico');
          return;
        }

        if (!formData.iyzicoRecipientName) {
          setError('Recipient name is required');
          return;
        }

        if (formData.iyzicoRecipientType === 'IDENTITY') {
          if (!formData.iyzicoIdentityNumber || !/^\d{11}$/.test(formData.iyzicoIdentityNumber)) {
            setError('Please enter a valid 11-digit Turkish identity number');
            return;
          }
          payoutIdentifier = formData.iyzicoIdentityNumber;
          payoutDetails = {
            type: 'IYZICO_IDENTITY',
            identityNumber: formData.iyzicoIdentityNumber,
            recipientName: formData.iyzicoRecipientName
          };
        } else if (formData.iyzicoRecipientType === 'PHONE') {
          if (!formData.iyzicoPhoneNumber) {
            setError('Phone number is required');
            return;
          }
          const cleanPhone = formData.iyzicoPhoneNumber.replace(/\s/g, '');
          payoutIdentifier = cleanPhone;
          payoutDetails = {
            type: 'IYZICO_PHONE',
            phoneNumber: cleanPhone,
            recipientName: formData.iyzicoRecipientName
          };
        } else if (formData.iyzicoRecipientType === 'MEMBER') {
          if (!formData.iyzicoMemberId) {
            setError('Iyzico member ID is required');
            return;
          }
          payoutIdentifier = formData.iyzicoMemberId;
          payoutDetails = {
            type: 'IYZICO_MEMBER',
            memberId: formData.iyzicoMemberId,
            recipientName: formData.iyzicoRecipientName
          };
        } else if (formData.iyzicoRecipientType === 'IBAN') {
          if (!formData.iban || !validateIBAN(formData.iban)) {
            setError('Please enter a valid IBAN');
            return;
          }
          payoutIdentifier = formData.iban.replace(/\s/g, '');
          payoutDetails = {
            type: 'IBAN',
            iban: formData.iban.replace(/\s/g, ''),
            accountHolderName: formData.iyzicoRecipientName,
            swiftCode: formData.swiftCode
          };
        }
      } else if (formData.typeId === PaymentMethodTypeEnum.BANK_TRANSFER) {
        // For IBAN-based transfers
        if (formData.iban) {
          if (!validateIBAN(formData.iban)) {
            setError('Please enter a valid IBAN');
            return;
          }

          if (!formData.accountHolderName) {
            setError('Account holder name is required');
            return;
          }

          payoutIdentifier = formData.iban.replace(/\s/g, '');
          payoutDetails = {
            type: 'IBAN',
            iban: formData.iban.replace(/\s/g, ''),
            accountHolderName: formData.accountHolderName,
            swiftCode: formData.swiftCode
          };
        }
        // For traditional account/routing number
        else if (formData.accountNumber && formData.routingNumber) {
          if (!formData.accountHolderName || !formData.bankName) {
            setError('Account holder name and bank name are required');
            return;
          }

          payoutIdentifier = formData.accountNumber;
          payoutDetails = {
            type: 'ACH',
            accountNumber: formData.accountNumber,
            routingNumber: formData.routingNumber,
            accountHolderName: formData.accountHolderName,
            bankName: formData.bankName
          };
        } else {
          setError('Please provide either IBAN or account number with routing number');
          return;
        }
      } else {
        setError('Unsupported payment method type');
        return;
      }

      // Submit to API
      await api.accountApi.addPaymentMethod({
        typeId: formData.typeId,
        currency: formData.currency,
        isDefault: formData.isDefault,
        payoutIdentifier,
        details: payoutDetails
      });

      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add payout method');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PayoutFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: keyof PayoutFormData) => (event: any) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const selectedType = availableTypes.find(type => type.id === formData.typeId);

  const renderPayoutFields = () => {
    switch (formData.typeId) {
      case PaymentMethodTypeEnum.PAYPAL:
        return (
          <TextField
            fullWidth
            required
            label="PayPal Email Address"
            type="email"
            value={formData.paypalEmail || ''}
            onChange={handleInputChange('paypalEmail')}
            helperText="Enter the email address associated with your PayPal account"
            disabled={loading}
          />
        );

      case PaymentMethodTypeEnum.IYZICO:
        return (
          <Stack spacing={2}>
            <FormControl fullWidth required>
              <InputLabel>Alıcı Türü / Recipient Type</InputLabel>
              <Select
                value={formData.iyzicoRecipientType || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, iyzicoRecipientType: e.target.value as any }))}
                label="Alıcı Türü / Recipient Type"
                disabled={loading}
              >
                <MenuItem value="">Seçiniz / Select</MenuItem>
                <MenuItem value="IDENTITY">TC Kimlik No / Turkish ID</MenuItem>
                <MenuItem value="PHONE">Telefon / Phone Number</MenuItem>
                <MenuItem value="MEMBER">Iyzico Üyelik No / Member ID</MenuItem>
                <MenuItem value="IBAN">IBAN</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              required
              label="Alıcı Adı Soyadı / Recipient Name"
              value={formData.iyzicoRecipientName || ''}
              onChange={handleInputChange('iyzicoRecipientName')}
              disabled={loading}
            />

            {formData.iyzicoRecipientType === 'IDENTITY' && (
              <TextField
                fullWidth
                required
                label="TC Kimlik No"
                value={formData.iyzicoIdentityNumber || ''}
                onChange={handleInputChange('iyzicoIdentityNumber')}
                helperText="11 haneli TC kimlik numarası"
                inputProps={{ maxLength: 11 }}
                disabled={loading}
              />
            )}

            {formData.iyzicoRecipientType === 'PHONE' && (
              <TextField
                fullWidth
                required
                label="Telefon Numarası"
                value={formData.iyzicoPhoneNumber || ''}
                onChange={handleInputChange('iyzicoPhoneNumber')}
                helperText="Örnek: 05XX XXX XX XX"
                disabled={loading}
              />
            )}

            {formData.iyzicoRecipientType === 'MEMBER' && (
              <TextField
                fullWidth
                required
                label="Iyzico Üyelik No"
                value={formData.iyzicoMemberId || ''}
                onChange={handleInputChange('iyzicoMemberId')}
                helperText="Iyzico üyelik numarası"
                disabled={loading}
              />
            )}

            {formData.iyzicoRecipientType === 'IBAN' && (
              <>
                <TextField
                  fullWidth
                  required
                  label="IBAN"
                  value={formData.iban || ''}
                  onChange={handleInputChange('iban')}
                  helperText="TR ile başlayan IBAN numarası"
                  disabled={loading}
                />
                <TextField
                  fullWidth
                  label="SWIFT Kodu (Opsiyonel)"
                  value={formData.swiftCode || ''}
                  onChange={handleInputChange('swiftCode')}
                  disabled={loading}
                />
              </>
            )}

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Iyzico toplu ödeme için hesabınızın aktif olması gerekir.
                Detaylı bilgi için Iyzico destek ekibiyle iletişime geçin.
              </Typography>
            </Alert>
          </Stack>
        );

      case PaymentMethodTypeEnum.BANK_TRANSFER:
        return (
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Choose one option:
            </Typography>

            {/* IBAN Option */}
            <Box>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Option 1: IBAN (International)
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="IBAN"
                  value={formData.iban || ''}
                  onChange={handleInputChange('iban')}
                  helperText="International Bank Account Number (e.g., GB29 NWBK 6016 1331 9268 19)"
                  disabled={loading || !!(formData.accountNumber || formData.routingNumber)}
                />
                <TextField
                  fullWidth
                  label="Account Holder Name"
                  value={formData.accountHolderName || ''}
                  onChange={handleInputChange('accountHolderName')}
                  disabled={loading || !formData.iban}
                />
                <TextField
                  fullWidth
                  label="SWIFT/BIC Code (Optional)"
                  value={formData.swiftCode || ''}
                  onChange={handleInputChange('swiftCode')}
                  helperText="Required for international transfers"
                  disabled={loading || !formData.iban}
                />
              </Stack>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              OR
            </Typography>

            {/* ACH Option */}
            <Box>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Option 2: Account & Routing Number (US/Canada)
              </Typography>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Bank Name"
                  value={formData.bankName || ''}
                  onChange={handleInputChange('bankName')}
                  disabled={loading || !!formData.iban}
                />
                <TextField
                  fullWidth
                  label="Account Holder Name"
                  value={formData.accountHolderName || ''}
                  onChange={handleInputChange('accountHolderName')}
                  disabled={loading || !!formData.iban}
                />
                <TextField
                  fullWidth
                  label="Account Number"
                  value={formData.accountNumber || ''}
                  onChange={handleInputChange('accountNumber')}
                  disabled={loading || !!formData.iban}
                />
                <TextField
                  fullWidth
                  label="Routing Number"
                  value={formData.routingNumber || ''}
                  onChange={handleInputChange('routingNumber')}
                  helperText="9-digit routing number"
                  disabled={loading || !!formData.iban}
                />
              </Stack>
            </Box>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Payout Method</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <Alert severity="info">
            <Typography variant="body2">
              <strong>Important:</strong> This is for receiving payouts, not for making payments.
              Add the account where you want to receive your earnings.
            </Typography>
          </Alert>

          <FormControl fullWidth required>
            <InputLabel>Payout Method Type</InputLabel>
            <Select
              value={formData.typeId}
              onChange={handleSelectChange('typeId')}
              label="Payout Method Type"
              disabled={loading}
            >
              <MenuItem value={0}>Select a payout method</MenuItem>
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
              {renderPayoutFields()}
            </Box>
          )}

          {formData.typeId > 0 && (
            <>
              <FormControl fullWidth required>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.currency}
                  onChange={handleSelectChange('currency')}
                  label="Currency"
                  disabled={loading}
                >
                  <MenuItem value="USD">USD - US Dollar</MenuItem>
                  <MenuItem value="EUR">EUR - Euro</MenuItem>
                  <MenuItem value="GBP">GBP - British Pound</MenuItem>
                  <MenuItem value="TRY">TRY - Turkish Lira</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isDefault}
                    onChange={handleInputChange('isDefault')}
                    disabled={loading}
                  />
                }
                label="Set as default payout method"
              />
            </>
          )}
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
          {loading ? 'Adding...' : 'Add Payout Method'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { AddPayoutMethodDialog };
