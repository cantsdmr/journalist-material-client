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
  Avatar,
  Grid
} from '@mui/material';
import { Cancel, Subscriptions as SubscriptionsIcon } from '@mui/icons-material';
import { useApiContext } from '@/contexts/ApiContext';
import { Subscription } from '@/APIs/AccountAPI';
import { getMembershipStatusColor, getMembershipStatusLabel, canCancelMembership } from '@/constants/membership-status';

const SubscriptionsTab: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [canceling, setCanceling] = useState(false);
  
  const { api } = useApiContext();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const subscriptionsData = await api.accountApi.getSubscriptions();
      setSubscriptions(subscriptionsData.items ?? []);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!selectedSubscription) return;
    
    try {
      setCanceling(true);
      setError(null);
      await api.accountApi.cancelSubscription(selectedSubscription.id);
      await fetchSubscriptions();
      setCancelDialogOpen(false);
      setSelectedSubscription(null);
      setSuccess('Subscription canceled successfully');
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel subscription');
    } finally {
      setCanceling(false);
    }
  };

  const openCancelDialog = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setCancelDialogOpen(true);
  };

  const closeCancelDialog = () => {
    setCancelDialogOpen(false);
    setSelectedSubscription(null);
  };

  const getStatusColor = (status: string) => {
    return getMembershipStatusColor(status);
  };

  const getStatusLabel = (status: string) => {
    return getMembershipStatusLabel(status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(price / 100); // Convert from cents to dollars
  };

  const canCancelSubscription = (subscription: Subscription) => {
    return canCancelMembership(subscription.status);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Stack spacing={2}>
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Skeleton variant="circular" width={60} height={60} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="30%" />
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
        {error && (
          <Alert 
            severity="error" 
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert 
            severity="success" 
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">My Subscriptions</Typography>
          <Typography variant="body2" color="text.secondary">
            {subscriptions.filter(s => s.status === 'active').length} active subscription{subscriptions.filter(s => s.status === 'active').length !== 1 ? 's' : ''}
          </Typography>
        </Box>

        {subscriptions.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <SubscriptionsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Subscriptions Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                You haven't subscribed to any channels yet. Explore channels to find content you love!
              </Typography>
              <Button variant="contained" href="/app/channels">
                Browse Channels
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {subscriptions.map((subscription) => (
              <Grid item xs={12} key={subscription.id}>
                <Card>
                  <CardContent>
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Avatar
                        sx={{ width: 60, height: 60 }}
                        src={`https://via.placeholder.com/60x60?text=${subscription.channel_name.charAt(0)}`}
                      >
                        {subscription.channel_name.charAt(0)}
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {subscription.channel_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {subscription.tier_name} • {formatPrice(subscription.tier_price, subscription.currency)}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          <Chip 
                            label={getStatusLabel(subscription.status)}
                            color={getStatusColor(subscription.status) as any}
                            size="small"
                          />
                          <Typography variant="caption" color="text.secondary">
                            Started: {formatDate(subscription.started_at)}
                          </Typography>
                          {subscription.expires_at && (
                            <Typography variant="caption" color="text.secondary">
                              • Expires: {formatDate(subscription.expires_at)}
                            </Typography>
                          )}
                          {subscription.canceled_at && (
                            <Typography variant="caption" color="text.secondary">
                              • Canceled: {formatDate(subscription.canceled_at)}
                            </Typography>
                          )}
                        </Stack>
                      </Box>

                      <Stack spacing={1} alignItems="flex-end">
                        {canCancelSubscription(subscription) && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Cancel />}
                            onClick={() => openCancelDialog(subscription)}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          variant="text"
                          size="small"
                          href={`/app/channels/${subscription.channel_id}`}
                        >
                          View Channel
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Cancel Subscription Dialog */}
        <Dialog
          open={cancelDialogOpen}
          onClose={closeCancelDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Cancel Subscription</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to cancel your subscription to{' '}
              <strong>{selectedSubscription?.channel_name}</strong>?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You will continue to have access until your current billing period ends
              {selectedSubscription?.expires_at && (
                <> on {formatDate(selectedSubscription.expires_at)}</>
              )}.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeCancelDialog} disabled={canceling}>
              Keep Subscription
            </Button>
            <Button
              onClick={handleCancelSubscription}
              color="error"
              variant="contained"
              disabled={canceling}
            >
              {canceling ? 'Canceling...' : 'Cancel Subscription'}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
};

export default SubscriptionsTab; 