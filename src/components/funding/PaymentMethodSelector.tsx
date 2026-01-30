import React from 'react';
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Alert
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  AccountBalance as PayPalIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { PAYMENT_METHOD_TYPE_ID } from '@/enums/PaymentMethodEnums';

interface PaymentMethod {
  id: string;
  type_id: number;
  type_name: string;
  currency: string;
  is_default: boolean;
  details: {
    email?: string;
    cardHolderName?: string;
    cardNumber?: string;
    expiryMonth?: string;
    expiryYear?: string;
  };
  last_used_at?: string;
}

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethod[];
  selectedMethodId: string;
  onMethodSelect: (methodId: string) => void;
  currency: string;
  onAddPaymentMethod?: () => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  paymentMethods,
  selectedMethodId,
  onMethodSelect,
  currency,
  onAddPaymentMethod
}) => {
  const getPaymentMethodIcon = (typeId: number) => {
    switch (typeId) {
      case PAYMENT_METHOD_TYPE_ID.PAYPAL:
        return <PayPalIcon color="primary" />;
      case PAYMENT_METHOD_TYPE_ID.IYZICO:
        return <CreditCardIcon color="primary" />;
      default:
        return <CreditCardIcon color="primary" />;
    }
  };

  const formatCardNumber = (cardNumber?: string) => {
    if (!cardNumber) return '';
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

  const getPaymentMethodDisplay = (method: PaymentMethod) => {
    switch (method.type_id) {
      case PAYMENT_METHOD_TYPE_ID.PAYPAL:
        return {
          title: 'PayPal',
          subtitle: method.details.email || 'PayPal Account',
          description: `PayPal account`
        };
      case PAYMENT_METHOD_TYPE_ID.IYZICO:
        return {
          title: 'Credit Card',
          subtitle: formatCardNumber(method.details.cardNumber),
          description: method.details.cardHolderName || 'Credit Card'
        };
      default:
        return {
          title: method.type_name,
          subtitle: 'Payment Method',
          description: ''
        };
    }
  };

  // Filter payment methods that support the selected currency
  const compatibleMethods = paymentMethods.filter(method => 
    method.currency === currency
  );

  if (paymentMethods.length === 0) {
    return (
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Payment Method
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          No payment methods found. Please add a payment method to continue.
        </Alert>
        {onAddPaymentMethod && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onAddPaymentMethod}
            fullWidth
          >
            Add Payment Method
          </Button>
        )}
      </Box>
    );
  }

  if (compatibleMethods.length === 0) {
    return (
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Payment Method
        </Typography>
        <Alert severity="warning" sx={{ mb: 2 }}>
          No payment methods found for {currency}. Please add a payment method in {currency}.
        </Alert>
        {onAddPaymentMethod && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onAddPaymentMethod}
            fullWidth
          >
            Add {currency} Payment Method
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Select Payment Method
      </Typography>
      
      <RadioGroup
        value={selectedMethodId}
        onChange={(e) => onMethodSelect(e.target.value)}
      >
        <Stack spacing={2}>
          {compatibleMethods.map((method) => {
            const display = getPaymentMethodDisplay(method);
            
            return (
              <Card
                key={method.id}
                variant="outlined"
                sx={{
                  cursor: 'pointer',
                  border: selectedMethodId === method.id ? 2 : 1,
                  borderColor: selectedMethodId === method.id ? 'primary.main' : 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover'
                  }
                }}
                onClick={() => onMethodSelect(method.id)}
              >
                <CardContent sx={{ py: 2 }}>
                  <FormControlLabel
                    value={method.id}
                    control={<Radio />}
                    label=""
                    sx={{ m: 0 }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 4, mt: -4 }}>
                    <Box sx={{ mr: 2 }}>
                      {getPaymentMethodIcon(method.type_id)}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {display.title}
                        </Typography>
                        {method.is_default && (
                          <Chip 
                            label="Default" 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {display.subtitle}
                      </Typography>
                      {display.description && (
                        <Typography variant="caption" color="text.secondary">
                          {display.description}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary">
                        {method.currency}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </RadioGroup>

      {onAddPaymentMethod && (
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onAddPaymentMethod}
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Another Payment Method
        </Button>
      )}
    </Box>
  );
};

export default PaymentMethodSelector;