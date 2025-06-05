import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { 
  Subscriptions as SubscriptionsIcon,
  Cancel as CancelIcon,
  WorkspacePremium as PremiumIcon
} from '@mui/icons-material';
import { useApiContext } from '@/contexts/ApiContext';
import { ChannelTier, ChannelSubscription, PaymentMethod } from '@/types/index';
import { useApiCall } from '@/hooks/useApiCall';

interface SubscribeButtonProps {
  channelId: string;
  channelName: string;
  tiers: ChannelTier[];
  currentSubscription?: ChannelSubscription | null;
  onSubscriptionChange?: () => void;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({
  channelId,
  channelName,
  tiers,
  currentSubscription: currentMembership,
  onSubscriptionChange,
  variant = 'contained',
  size = 'medium',
  fullWidth = false
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState<string>('');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { api } = useApiContext();
  const { execute } = useApiCall();

  const isSubscribed = currentMembership?.status === 1;
  const freeTier = tiers.find(tier => tier.price === 0);
  const defaultTier = tiers.find(tier => tier.isDefault) || freeTier || tiers[0];

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(price / 100);
  };

  const handleSubscribeClick = async () => {
    if (isSubscribed) {
      // Unsubscribe
      setLoading(true);
      setError(null);
      
      const result = await execute(
        () => api.channelApi.unsubscribeFromChannel(channelId),
        {
          showSuccessMessage: true,
          successMessage: 'Successfully unsubscribed'
        }
      );
      
      if (result) {
        onSubscriptionChange?.();
      }
      
      setLoading(false);
    } else {
      // Subscribe - check if we need to show tier selection
      if (tiers.length === 1) {
        // Only one tier, subscribe directly
        await handleDirectSubscribe(tiers[0].id);
      } else {
        // Multiple tiers, show selection dialog
        setSelectedTierId(defaultTier?.id || '');
        setDialogOpen(true);
        await loadPaymentMethods();
      }
    }
  };

  const handleDirectSubscribe = async (tierId: string) => {
    setLoading(true);
    setError(null);
    
    const tier = tiers.find(t => t.id === tierId);
    const subscribeData: any = { tier_id: tierId };
    
    // For paid tiers, we might need a payment method
    if (tier && tier.price > 0) {
      // For now, let the backend handle payment method selection
      // In a real implementation, you'd want to ensure a payment method is selected
    }
    
    const result = await execute(
      () => api.channelApi.subscribeToChannel(channelId, subscribeData),
      {
        showSuccessMessage: true,
        successMessage: 'Successfully subscribed!'
      }
    );
    
    if (result) {
      onSubscriptionChange?.();
      setDialogOpen(false);
    }
    
    setLoading(false);
  };

  const loadPaymentMethods = async () => {
    const result = await execute(
      () => api.accountApi.getPaymentMethods(),
      { showErrorToast: false } // Don't show error toast for this
    );
    
    if (result) {
      setPaymentMethods(result.items ?? []);
      const defaultMethod = result.items?.find(m => m.isDefault);
      if (defaultMethod) {
        setSelectedPaymentMethodId(defaultMethod.id);
      }
    }
  };

  const handleConfirmSubscribe = async () => {
    if (!selectedTierId) return;
    await handleDirectSubscribe(selectedTierId);
  };

  const getButtonText = () => {
    if (loading) return 'Processing...';
    if (isSubscribed) return 'Unsubscribe';
    if (tiers.length === 0) return 'Follow';
    return 'Subscribe';
  };

  const getButtonIcon = () => {
    if (loading) return <CircularProgress size={16} />;
    if (isSubscribed) return <CancelIcon />;
    if (freeTier && tiers.length === 1) return <SubscriptionsIcon />;
    return <PremiumIcon />;
  };

  const getButtonColor = () => {
    if (isSubscribed) return 'error' as const;
    return 'primary' as const;
  };

  const selectedTier = tiers.find(t => t.id === selectedTierId);
  const requiresPayment = selectedTier && selectedTier.price > 0;

  return (
    <>
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        color={getButtonColor()}
        startIcon={getButtonIcon()}
        onClick={handleSubscribeClick}
        disabled={loading}
      >
        {getButtonText()}
        {isSubscribed && currentMembership?.tier && (
          <Chip
            label={currentMembership.tier.name}
            size="small"
            sx={{ ml: 1 }}
          />
        )}
      </Button>

      {/* Tier Selection Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Subscribe to {channelName}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Tier</InputLabel>
            <Select
              value={selectedTierId}
              onChange={(e) => setSelectedTierId(e.target.value)}
              label="Select Tier"
            >
              {tiers.map((tier) => (
                <MenuItem key={tier.id} value={tier.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Typography>{tier.name}</Typography>
                    <Typography color="text.secondary">
                      {tier.price === 0 ? 'Free' : formatPrice(tier.price, tier.currency)}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedTier && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {selectedTier.description}
              </Typography>
              {selectedTier.benefits && selectedTier.benefits.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Benefits:
                  </Typography>
                  <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                    {selectedTier.benefits.map((benefit, index) => (
                      <li key={index}>
                        <Typography variant="caption" color="text.secondary">
                          {benefit}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
            </Box>
          )}

          {requiresPayment && paymentMethods.length > 0 && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={selectedPaymentMethodId}
                onChange={(e) => setSelectedPaymentMethodId(e.target.value)}
                label="Payment Method"
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method.id} value={method.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Typography>{method.type.name}</Typography>
                      <Typography color="text.secondary">
                        {method.details.cardNumber ? `****${method.details.cardNumber.slice(-4)}` : method.details.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {requiresPayment && paymentMethods.length === 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              You need to add a payment method to subscribe to paid tiers.
              <Button
                size="small"
                href="/app/account"
                sx={{ ml: 1 }}
              >
                Add Payment Method
              </Button>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSubscribe}
            variant="contained"
            disabled={loading || !selectedTierId || (requiresPayment && !selectedPaymentMethodId)}
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubscribeButton; 