import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  Alert,
  LinearProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Chip
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { useApiContext } from '@/contexts/ApiContext';
import PaymentMethodSelector from './PaymentMethodSelector';
import FundingProgress from './FundingProgress';

export interface FundingData {
  id: string;
  title: string;
  currentAmount: number;
  goalAmount?: number;
  currency: string;
  contributorCount: number;
  description?: string;
}

interface FundingModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (contribution: any) => void;
  contentType: 'news' | 'poll';
  contentId: string;
  fundingData: FundingData;
}

interface ContributionData {
  amount: number;
  currency: string;
  payment_method_id: string;
  comment?: string;
  is_anonymous: boolean;
}

const PRESET_AMOUNTS = [5, 10, 25, 50, 100];

const FundingModal: React.FC<FundingModalProps> = ({
  open,
  onClose,
  onSuccess,
  contentType,
  contentId,
  fundingData
}) => {
  const [step, setStep] = useState<'amount' | 'payment' | 'processing'>('amount');
  const [contributionData, setContributionData] = useState<ContributionData>({
    amount: 0,
    currency: fundingData.currency,
    payment_method_id: '',
    comment: '',
    is_anonymous: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  const { api } = useApiContext();

  useEffect(() => {
    if (open) {
      loadPaymentMethods();
    }
  }, [open]);

  const loadPaymentMethods = async () => {
    try {
      const methods = await api.accountApi.getPaymentMethods();
      setPaymentMethods(methods.data || []);
    } catch (err) {
      console.error('Failed to load payment methods:', err);
    }
  };

  const handleClose = () => {
    setStep('amount');
    setContributionData({
      amount: 0,
      currency: fundingData.currency,
      payment_method_id: '',
      comment: '',
      is_anonymous: false
    });
    setError(null);
    onClose();
  };

  const handleAmountSelect = (amount: number) => {
    setContributionData(prev => ({ ...prev, amount }));
  };

  const handleNextStep = () => {
    if (step === 'amount') {
      if (contributionData.amount <= 0) {
        setError('Please enter a valid contribution amount');
        return;
      }
      if (paymentMethods.length === 0) {
        setError('No payment methods available. Please add a payment method first.');
        return;
      }
      setError(null);
      setStep('payment');
    }
  };

  const handlePreviousStep = () => {
    if (step === 'payment') {
      setStep('amount');
      setError(null);
    }
  };

  const handleSubmitContribution = async () => {
    try {
      setLoading(true);
      setStep('processing');
      setError(null);

      if (!contributionData.payment_method_id) {
        setError('Please select a payment method');
        return;
      }

      // Create contribution via API
      const contribution = await api.fundingApi.createContribution(
        contentType,
        contentId,
        contributionData
      );

      onSuccess(contribution);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to process contribution');
      setStep('payment');
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = fundingData.goalAmount 
    ? Math.min((fundingData.currentAmount / fundingData.goalAmount) * 100, 100)
    : 0;

  const renderAmountStep = () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Fund this {contentType}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {fundingData.description || `Support this ${contentType} with your contribution`}
        </Typography>
      </Box>

      <FundingProgress 
        currentAmount={fundingData.currentAmount}
        goalAmount={fundingData.goalAmount}
        contributorCount={fundingData.contributorCount}
        currency={fundingData.currency}
      />

      <Divider />

      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Choose contribution amount
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
          {PRESET_AMOUNTS.map((amount) => (
            <Chip
              key={amount}
              label={`${fundingData.currency} ${amount}`}
              onClick={() => handleAmountSelect(amount)}
              color={contributionData.amount === amount ? 'primary' : 'default'}
              variant={contributionData.amount === amount ? 'filled' : 'outlined'}
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>

        <TextField
          label="Custom Amount"
          type="number"
          value={contributionData.amount || ''}
          onChange={(e) => setContributionData(prev => ({ 
            ...prev, 
            amount: Number(e.target.value) 
          }))}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {fundingData.currency}
              </InputAdornment>
            ),
          }}
          inputProps={{
            min: 1,
            step: 0.01
          }}
        />
      </Box>

      <TextField
        label="Comment (Optional)"
        multiline
        rows={3}
        value={contributionData.comment}
        onChange={(e) => setContributionData(prev => ({ 
          ...prev, 
          comment: e.target.value 
        }))}
        fullWidth
        placeholder="Leave a message of support..."
      />
    </Stack>
  );

  const renderPaymentStep = () => (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Payment Details
        </Typography>
        <Box sx={{ 
          p: 2, 
          bgcolor: 'background.paper', 
          borderRadius: 1, 
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="body1" fontWeight="medium">
            Contribution: {fundingData.currency} {contributionData.amount}
          </Typography>
          {contributionData.comment && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              "{contributionData.comment}"
            </Typography>
          )}
        </Box>
      </Box>

      <PaymentMethodSelector
        paymentMethods={paymentMethods}
        selectedMethodId={contributionData.payment_method_id}
        onMethodSelect={(methodId) => setContributionData(prev => ({ 
          ...prev, 
          payment_method_id: methodId 
        }))}
        currency={contributionData.currency}
      />
    </Stack>
  );

  const renderProcessingStep = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <LinearProgress sx={{ mb: 3 }} />
      <Typography variant="h6" gutterBottom>
        Processing your contribution...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Please wait while we process your payment
      </Typography>
    </Box>
  );

  const getDialogActions = () => {
    switch (step) {
      case 'amount':
        return (
          <>
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={handleNextStep}
              variant="contained"
              disabled={loading || contributionData.amount <= 0}
            >
              Continue
            </Button>
          </>
        );
      case 'payment':
        return (
          <>
            <Button onClick={handlePreviousStep} disabled={loading}>
              Back
            </Button>
            <Button 
              onClick={handleSubmitContribution}
              variant="contained"
              disabled={loading || !contributionData.payment_method_id}
            >
              {loading ? 'Processing...' : `Contribute ${fundingData.currency} ${contributionData.amount}`}
            </Button>
          </>
        );
      case 'processing':
        return null;
      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={loading ? undefined : handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        Fund {fundingData.title}
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {step === 'amount' && renderAmountStep()}
        {step === 'payment' && renderPaymentStep()}
        {step === 'processing' && renderProcessingStep()}
      </DialogContent>
      
      {getDialogActions() && (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {getDialogActions()}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default FundingModal;