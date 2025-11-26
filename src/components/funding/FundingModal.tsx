import React, { useState } from 'react';
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
  InputAdornment,
  Chip
} from '@mui/material';
import PayPalFundingButton from './PayPalFundingButton';
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
  comment?: string;
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
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setStep('amount');
    setContributionData({
      amount: 0,
      currency: fundingData.currency,
      comment: ''
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

  const handlePayPalSuccess = (contribution: any) => {
    onSuccess(contribution);
    handleClose();
  };

  const handlePayPalError = (err: Error) => {
    setError(err.message || 'Payment failed. Please try again.');
    setLoading(false);
  };

  const handlePayPalCancel = () => {
    setError('Payment cancelled. You can try again when ready.');
    setLoading(false);
  };

  // Calculate progress percentage for funding display
  // const progressPercentage = fundingData.goalAmount 
  //   ? Math.min((fundingData.currentAmount / fundingData.goalAmount) * 100, 100)
  //   : 0;

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

      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Complete payment with PayPal
        </Typography>
        <PayPalFundingButton
          contentType={contentType}
          contentId={contentId}
          amount={contributionData.amount}
          currency={contributionData.currency}
          comment={contributionData.comment}
          onSuccess={handlePayPalSuccess}
          onError={handlePayPalError}
          onCancel={handlePayPalCancel}
          disabled={loading}
        />
      </Box>
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