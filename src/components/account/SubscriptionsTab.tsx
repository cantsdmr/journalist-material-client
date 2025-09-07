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
  Grid,
  IconButton,
  Divider,
  Paper,
  CardActions,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Cancel, 
  Subscriptions as SubscriptionsIcon, 
  Launch,
  MonetizationOn,
  Schedule,
  TrendingUp,
  MoreVert
} from '@mui/icons-material';
import { useApiContext } from '@/contexts/ApiContext';
import { Subscription } from '@/types/index';
import { getSubscriptionStatusColor, getSubscriptionStatusLabel, canCancelSubscription as canCancelSubscriptionHelper, SUBSCRIPTION_STATUS } from '@/enums/SubscriptionEnums';
import { useApiCall } from '@/hooks/useApiCall';
import { PATHS } from '@/constants/paths';

const SubscriptionsTab: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [canceling, setCanceling] = useState(false);
  
  const { api } = useApiContext();
  const { execute } = useApiCall();
  const theme = useTheme();

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError(null);
    
    const result = await execute(
      () => api.accountApi.getSubscriptions(),
      { showErrorToast: true }
    );
    
    if (result) {
      setSubscriptions(result.items ?? []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleCancelSubscription = async () => {
    if (!selectedSubscription) return;
    
    setCanceling(true);
    setError(null);
    
    const result = await execute(
      () => api.accountApi.cancelSubscription(selectedSubscription.id),
      {
        showSuccessMessage: true,
        successMessage: 'Subscription canceled successfully'
      }
    );
    
    if (result) {
      await fetchSubscriptions();
      setCancelDialogOpen(false);
      setSelectedSubscription(null);
    }
    
    setCanceling(false);
  };

  const openCancelDialog = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setCancelDialogOpen(true);
  };

  const closeCancelDialog = () => {
    setCancelDialogOpen(false);
    setSelectedSubscription(null);
  };

  const getStatusColor = (statusId: number) => {
    return getSubscriptionStatusColor(statusId);
  };

  const getStatusLabel = (statusId: number) => {
    return getSubscriptionStatusLabel(statusId);
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
    return canCancelSubscriptionHelper(subscription.statusId);
  };

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Stack spacing={3}>
          <Box>
            <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '200px', mb: 1 }} />
            <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '150px' }} />
          </Box>
          <Grid container spacing={3}>
            {[...Array(3)].map((_, index) => (
              <Grid item xs={12} lg={6} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={3}>
                      <Skeleton variant="circular" width={64} height={64} />
                      <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '70%', mb: 1 }} />
                        <Skeleton variant="text" sx={{ width: '50%', mb: 2 }} />
                        <Stack direction="row" spacing={1} mb={2}>
                          <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
                        </Stack>
                        <Stack spacing={1}>
                          <Skeleton variant="text" sx={{ width: '60%' }} />
                          <Skeleton variant="text" sx={{ width: '40%' }} />
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ px: 3, pb: 3 }}>
                    <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1, ml: 1 }} />
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Box>
    );
  }

  const activeSubscriptions = subscriptions.filter(s => s.statusId === SUBSCRIPTION_STATUS.ACTIVE);
  const totalRevenue = subscriptions.reduce((sum, sub) => sum + (sub.tier.price / 100), 0);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Stack spacing={4}>
        {error && (
          <Alert 
            severity="error" 
            onClose={() => setError(null)}
            sx={{ borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert 
            severity="success" 
            onClose={() => setSuccess(null)}
            sx={{ borderRadius: 2 }}
          >
            {success}
          </Alert>
        )}
        
        {/* Header Section */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            My Subscriptions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your channel subscriptions and contributions
          </Typography>
        </Box>

        {/* Stats Cards */}
        {subscriptions.length > 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: 'white'
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {activeSubscriptions.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Active
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                  color: 'white'
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                      ${totalRevenue.toFixed(0)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Monthly Value
                    </Typography>
                  </Box>
                  <MonetizationOn sx={{ fontSize: 40, opacity: 0.8 }} />
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                      {subscriptions.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                  </Box>
                  <SubscriptionsIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                      {subscriptions.filter(s => s.autoContribute).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Auto-contribute
                    </Typography>
                  </Box>
                  <Schedule sx={{ fontSize: 40, color: 'text.secondary' }} />
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}

        {subscriptions.length === 0 ? (
          <Paper 
            sx={{ 
              textAlign: 'center', 
              py: 8, 
              px: 4,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}
          >
            <Box sx={{ maxWidth: 400, mx: 'auto' }}>
              <SubscriptionsIcon 
                sx={{ 
                  fontSize: 80, 
                  color: 'primary.main', 
                  opacity: 0.6,
                  mb: 3 
                }} 
              />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                No Subscriptions Yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                Discover amazing channels and support creators by subscribing to their content. 
                Your subscriptions will appear here.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                href="/app/channels"
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  px: 4,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                Explore Channels
              </Button>
            </Box>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {subscriptions.map((subscription) => (
              <Grid item xs={12} lg={6} key={subscription.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={3}>
                      <Avatar
                        sx={{ 
                          width: 64, 
                          height: 64,
                          border: `2px solid ${theme.palette.divider}`,
                          fontSize: '1.5rem',
                          fontWeight: 600
                        }}
                        src={`https://via.placeholder.com/64x64?text=${subscription.channel.name.charAt(0)}`}
                      >
                        {subscription.channel.name.charAt(0)}
                      </Avatar>
                      
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={1}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {subscription.channel.name}
                          </Typography>
                          <IconButton size="small" sx={{ ml: 1 }}>
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </Stack>
                        
                        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                          <Typography variant="body2" color="text.secondary">
                            {subscription.tier.name}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600,
                              color: 'primary.main'
                            }}
                          >
                            {formatPrice(subscription.tier.price, subscription.tier.currency)}/month
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                          <Chip 
                            label={getStatusLabel(subscription.statusId)}
                            color={getStatusColor(subscription.statusId) as any}
                            size="small"
                            sx={{ borderRadius: 1 }}
                          />
                          {subscription.autoContribute && (
                            <Chip 
                              label="Auto-contribute"
                              variant="outlined"
                              size="small"
                              sx={{ borderRadius: 1 }}
                            />
                          )}
                        </Stack>

                        <Stack spacing={0.5}>
                          <Typography variant="caption" color="text.secondary">
                            Started: {formatDate(subscription.subscribedAt)}
                          </Typography>
                          {subscription.expiresAt && (
                            <Typography variant="caption" color="text.secondary">
                              Expires: {formatDate(subscription.expiresAt)}
                            </Typography>
                          )}
                          {subscription.totalContributions > 0 && (
                            <Typography variant="caption" color="success.main">
                              Total contributed: {formatPrice(subscription.totalContributions, subscription.tier.currency)}
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions sx={{ p: 3, pt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      href={`${PATHS.APP_CHANNEL_VIEW}`.replace(':id', subscription.channel.id)}
                      endIcon={<Launch />}
                      sx={{ 
                        borderRadius: 1.5,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      View Channel
                    </Button>
                    {canCancelSubscription(subscription) && (
                      <Button
                        variant="text"
                        color="error"
                        size="small"
                        startIcon={<Cancel />}
                        onClick={() => openCancelDialog(subscription)}
                        sx={{ 
                          borderRadius: 1.5,
                          textTransform: 'none',
                          fontWeight: 500,
                          ml: 'auto'
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </CardActions>
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
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 1
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Cancel Subscription
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pb: 2 }}>
            <Stack spacing={2}>
              <Typography variant="body1">
                Are you sure you want to cancel your subscription to{' '}
                <Typography component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {selectedSubscription?.channel.name}
                </Typography>?
              </Typography>
              
              <Paper 
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.warning.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  You will continue to have access until your current billing period ends
                  {selectedSubscription?.expiresAt && (
                    <Typography component="span" sx={{ fontWeight: 500 }}>
                      {' '}on {formatDate(selectedSubscription.expiresAt)}
                    </Typography>
                  )}.
                </Typography>
              </Paper>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={closeCancelDialog} 
              disabled={canceling}
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                px: 3
              }}
            >
              Keep Subscription
            </Button>
            <Button
              onClick={handleCancelSubscription}
              color="error"
              variant="contained"
              disabled={canceling}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                px: 3
              }}
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