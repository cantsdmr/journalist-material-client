import React, { useState, useCallback, useEffect } from 'react';
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
  Chip,
  LinearProgress
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
  const [pendingSubscription, setPendingSubscription] = useState<{
    subscriptionId: string;
    approvalUrl: string;
    tierName: string;
  } | null>(null);
  const [planStatus, setPlanStatus] = useState<'checking' | 'creating' | 'ready'>('ready');
  
  const { api } = useApiContext();
  const { execute } = useApiCall();

  const isSubscribed = currentMembership?.status === 1;
  const freeTier = tiers.find(tier => tier.price === 0);
  const defaultTier = tiers.find(tier => tier.isDefault) || freeTier || tiers[0];

  // Poll subscription status for pending subscriptions
  const pollSubscriptionStatus = useCallback(async (subscriptionId: string) => {
    try {
      const status = await api?.subscriptionApi?.getSubscriptionStatus?.(subscriptionId);
      if (status === 'active') {
        setPendingSubscription(null);
        onSubscriptionChange?.();
        setDialogOpen(false);
        return true; // Stop polling
      }
      return false; // Continue polling
    } catch (error) {
      console.error('Error polling subscription status:', error);
      return false;
    }
  }, [api, onSubscriptionChange]);

  // Handle PayPal approval window messages
  useEffect(() => {
    const handleApprovalMessage = (event: MessageEvent) => {
      if (!event.origin.includes('paypal.com') && !event.origin.includes('sandbox.paypal.com')) {
        return;
      }

      if (event.data.type === 'payment_approval') {
        if (event.data.status === 'approved' && pendingSubscription) {
          const pollInterval = setInterval(async () => {
            const isActive = await pollSubscriptionStatus(pendingSubscription.subscriptionId);
            if (isActive) {
              clearInterval(pollInterval);
            }
          }, 2000);

          setTimeout(() => {
            clearInterval(pollInterval);
            setPendingSubscription(null);
          }, 60000);
        } else if (event.data.status === 'cancelled') {
          setPendingSubscription(null);
          setLoading(false);
        }
      }
    };

    window.addEventListener('message', handleApprovalMessage);
    return () => window.removeEventListener('message', handleApprovalMessage);
  }, [pendingSubscription, pollSubscriptionStatus]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(price / 100);
  };

  const handleSubscribeClick = async () => {
    if (isSubscribed) {
      // Unsubscribe using legacy API (for now)
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
    const tier = tiers.find(t => t.id === tierId);
    if (!tier) return;

    setLoading(true);
    setError(null);
    setPlanStatus('checking');

    try {
      // For paid tiers, show plan creation status
      if (tier.price > 0) {
        setPlanStatus('creating');
      }

      // Use direct subscription API for all tiers
      let paymentMethodId = selectedPaymentMethodId;
      
      // If no payment method selected, use default PayPal
      if (!paymentMethodId && tier.price > 0) {
        paymentMethodId = 'paypal_default';
      }
      
      const result = await api?.subscriptionApi?.createDirectSubscription(channelId, {
        tierId,
        notificationLevel: 1,
        paymentMethodId
      });

      setPlanStatus('ready');

      if (result?.approvalUrl && result?.subscription) {
        // Set pending subscription state
        setPendingSubscription({
          subscriptionId: result.subscription.id,
          approvalUrl: result.approvalUrl,
          tierName: tier.name
        });

        // Open PayPal approval URL for paid subscriptions
        const paymentWindow = window.open(
          result.approvalUrl,
          'paypal_payment',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );
        
        if (!paymentWindow) {
          alert('Popup blocked! Please allow popups and try again.');
          setPendingSubscription(null);
          setLoading(false);
          return;
        }

        // Monitor window closure (fallback)
        const windowWatcher = setInterval(() => {
          if (paymentWindow.closed) {
            clearInterval(windowWatcher);
            setTimeout(async () => {
              const isActive = await pollSubscriptionStatus(result.subscription.id);
              if (!isActive) {
                setPendingSubscription(null);
                setLoading(false);
              }
            }, 3000);
          }
        }, 1000);

      } else {
        // For free subscriptions, complete immediately
        onSubscriptionChange?.();
        setDialogOpen(false);
        setLoading(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Subscription failed';
      setError(errorMessage);
      console.error('Subscription error:', error);
      setPlanStatus('ready');
      setLoading(false);
    }
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

          {/* Plan creation status */}
          {planStatus === 'creating' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2">
                  Setting up PayPal subscription plan...
                </Typography>
              </Box>
            </Alert>
          )}

          {/* Pending subscription status */}
          {pendingSubscription && (
            <Alert 
              severity="warning" 
              sx={{ mb: 2 }}
              action={
                <Button
                  size="small"
                  onClick={() => window.open(pendingSubscription.approvalUrl, '_blank')}
                >
                  Complete Payment
                </Button>
              }
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  🔄 Subscription Pending Approval
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                  {pendingSubscription.tierName} - Waiting for PayPal approval
                </Typography>
                <LinearProgress 
                  sx={{ mt: 1, borderRadius: 1 }} 
                  color="warning"
                />
              </Box>
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
            disabled={loading || !selectedTierId}
          >
            {loading ? 'Processing...' : 'Subscribe'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SubscribeButton; 