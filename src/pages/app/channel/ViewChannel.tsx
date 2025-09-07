import React, { useCallback, useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Avatar,
    Button,
    Grid,
    Card,
    CardContent,
    Skeleton,
    Divider,
    Stack,
    CircularProgress,
    Alert,
    LinearProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Channel } from '@/types/index';
import { useApiContext } from '@/contexts/ApiContext';
import JCard from '@/components/common/Card';
import { useProfile } from '@/contexts/ProfileContext';
import { useApiCall } from '@/hooks/useApiCall';

const ViewChannel: React.FC = () => {
    const [channel, setChannel] = useState<Nullable<Channel>>(null);
    const [loading, setLoading] = useState(true);
    const [subscriptionLoading, setSubscriptionLoading] = useState(false);
    const [pendingSubscription, setPendingSubscription] = useState<{
        subscriptionId: string;
        approvalUrl: string;
        tierName: string;
        tierId: string;
    } | null>(null);
    const [planStatus, setPlanStatus] = useState<'checking' | 'creating' | 'ready'>('ready');
    const { id } = useParams();
    const navigate = useNavigate();
    const { api } = useApiContext();
    const {
        profile,
        channelRelations: {
            hasSubscription,
            getSubscriptionTier
        },
        actions: {
            refreshProfile
        }
    } = useProfile();
    const { execute } = useApiCall();

    // Use them in your component
    const isMember = hasSubscription(id ?? '');
    const currentTierId = getSubscriptionTier(id ?? '')?.id;

    // Poll subscription status for pending subscriptions
    const pollSubscriptionStatus = useCallback(async (subscriptionId: string) => {
        try {
            const status = await api?.subscriptionApi?.getSubscriptionStatus?.(subscriptionId);
            if (status === 'active') {
                setPendingSubscription(null);
                await refreshProfile();
                return true; // Stop polling
            }
            return false; // Continue polling
        } catch (error) {
            console.error('Error polling subscription status:', error);
            return false;
        }
    }, [api, refreshProfile]);

    // Handle PayPal approval window messages
    useEffect(() => {
        const handleApprovalMessage = (event: MessageEvent) => {
            // Only accept messages from PayPal domains
            if (!event.origin.includes('paypal.com') && !event.origin.includes('sandbox.paypal.com')) {
                return;
            }

            if (event.data.type === 'payment_approval') {
                if (event.data.status === 'approved' && pendingSubscription) {
                    // Start polling for subscription activation
                    const pollInterval = setInterval(async () => {
                        const isActive = await pollSubscriptionStatus(pendingSubscription.subscriptionId);
                        if (isActive) {
                            clearInterval(pollInterval);
                        }
                    }, 2000); // Poll every 2 seconds

                    // Stop polling after 60 seconds
                    setTimeout(() => {
                        clearInterval(pollInterval);
                        setPendingSubscription(null);
                    }, 60000);
                } else if (event.data.status === 'cancelled') {
                    setPendingSubscription(null);
                    setSubscriptionLoading(false);
                }
            }
        };

        window.addEventListener('message', handleApprovalMessage);
        return () => window.removeEventListener('message', handleApprovalMessage);
    }, [pendingSubscription, pollSubscriptionStatus]);

    // Debug logging
    console.log('ViewChannel Debug:', {
        channelId: id,
        isMember,
        currentTierId,
        subscriptions: profile?.subscriptions,
        profileLoaded: !!profile,
        pendingSubscription,
        planStatus
    });

    useEffect(() => {
        const fetchChannel = async () => {
            if (!id) return;
            
            const result = await execute(
                () => api?.channelApi.getChannel(id),
                { showErrorToast: true }
            );
            
            if (result) {
                setChannel(result);
            }
            
            setLoading(false);
        };

        fetchChannel();
    }, [id, execute, api?.channelApi]);

    const handleJoin = async (tierId?: string) => {
        if (!channel || !tierId) return;
        
        const tier = channel.tiers?.find(t => t.id === tierId);
        if (!tier) return;

        setSubscriptionLoading(true);
        setPlanStatus('checking');

        try {
            // For paid tiers, show plan creation status
            if (tier.price > 0) {
                setPlanStatus('creating');
            }

            // Use direct subscription API
            const result = await api?.subscriptionApi?.createDirectSubscription(channel.id, {
                tierId,
                notificationLevel: 1,
                paymentMethodId: tier.price > 0 ? 'paypal_default' : undefined
            });

            setPlanStatus('ready');

            if (result?.approvalUrl && result?.subscription) {
                // Set pending subscription state
                setPendingSubscription({
                    subscriptionId: result.subscription.id,
                    approvalUrl: result.approvalUrl,
                    tierName: tier.name,
                    tierId: tier.id
                });

                // Open PayPal approval URL
                const paymentWindow = window.open(
                    result.approvalUrl,
                    'paypal_payment',
                    'width=600,height=700,scrollbars=yes,resizable=yes'
                );
                
                if (!paymentWindow) {
                    alert('Popup blocked! Please allow popups and try again.');
                    setPendingSubscription(null);
                    setSubscriptionLoading(false);
                    return;
                }

                // Monitor window closure (fallback if postMessage doesn't work)
                const windowWatcher = setInterval(() => {
                    if (paymentWindow.closed) {
                        clearInterval(windowWatcher);
                        // Give some time for webhook to process, then check status
                        setTimeout(async () => {
                            const isActive = await pollSubscriptionStatus(result.subscription.id);
                            if (!isActive) {
                                // If still not active, assume cancelled
                                setPendingSubscription(null);
                                setSubscriptionLoading(false);
                            }
                        }, 3000);
                    }
                }, 1000);

            } else {
                // Free subscription completed immediately
                await refreshProfile();
                setSubscriptionLoading(false);
            }
        } catch (error: any) {
            console.error('Subscription failed:', error);
            setPlanStatus('ready');
            setSubscriptionLoading(false);

            // Check if error is due to missing payment method
            const errorMessage = error?.response?.data?.message || error?.message || '';
            if (errorMessage.includes('PAYMENT_METHOD_REQUIRED') || 
                errorMessage.includes('PayPal payment method') ||
                errorMessage.includes('No PayPal payment method found')) {
                
                // Show confirmation dialog to redirect to payment method setup
                const shouldRedirect = window.confirm(
                    'You need to add a PayPal payment method to subscribe to paid tiers. Would you like to add one now?'
                );
                
                if (shouldRedirect) {
                    navigate('/app/account/payment-methods');
                }
            }
        }
    };

    const handleUpdateMembership = async (tierId: string) => {
        if (!channel) return;
        
        const tier = channel.tiers?.find(t => t.id === tierId);
        if (!tier) return;

        // First cancel existing subscription if needed
        const currentSubscription = profile?.subscriptions?.find(s => s.channelId === channel.id);
        if (currentSubscription) {
            try {
                await api?.subscriptionApi?.cancelUserSubscription(currentSubscription.id);
            } catch (error) {
                console.error('Failed to cancel existing subscription:', error);
            }
        }

        // Then create new subscription (same logic as handleJoin)
        await handleJoin(tierId);
    };

    const handleCancelMembership = async () => {
        if (!channel) return;
        
        // Always use legacy API for cancellation (for now)
        const result = await execute(
            () => api?.channelApi.unsubscribeFromChannel(channel.id),
            {
                showSuccessMessage: true,
                successMessage: 'Membership cancelled successfully!'
            }
        );
        
        if (result) {
            console.log('Cancellation successful, refreshing profile...');
            await refreshProfile();
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Skeleton variant="circular" width={100} height={100} sx={{ mx: 'auto', mb: 2 }} />
                    <Skeleton variant="text" width="60%" sx={{ mx: 'auto', mb: 1 }} />
                    <Skeleton variant="text" width="40%" sx={{ mx: 'auto', mb: 2 }} />
                    <Skeleton variant="rectangular" width={120} height={36} sx={{ mx: 'auto' }} />
                </Box>
                <Grid container spacing={3}>
                    {[...Array(3)].map((_, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card>
                                <CardContent>
                                    <Skeleton variant="text" width="80%" />
                                    <Skeleton variant="text" width="60%" />
                                    <Skeleton variant="rectangular" height={100} sx={{ my: 2 }} />
                                    <Skeleton variant="rectangular" width={100} height={36} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }

    if (!channel) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h5" align="center">Channel not found</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box 
                sx={{ 
                    position: 'relative',
                    mb: 4,
                    borderRadius: 2,
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 200,
                        backgroundImage: `url(${channel?.bannerUrl || 'https://via.placeholder.com/600x400'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.9)',
                        borderRadius: 2,
                    }
                }}
            >
                <Box 
                    sx={{ 
                        position: 'relative',
                        pt: 15,
                        pb: 4,
                        textAlign: 'center',
                    }}
                >
                    <Avatar
                        src={channel.logoUrl}
                        sx={{
                            width: 100,
                            height: 100,
                            mx: 'auto',
                            mb: 2,
                            border: '3px solid white',
                            boxShadow: 2
                        }}
                    />
                    <Typography variant="h4" gutterBottom>{channel.name}</Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {channel.stats?.activeSubscriptionCount?.toLocaleString('en-US', {
                            notation: 'compact',
                            maximumFractionDigits: 1
                        })} subscribers • {channel.tiers?.length || 0} tiers
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        {channel.description}
                    </Typography>
                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                        sx={{ mb: 4 }}
                    >
                        <Button
                            variant={isMember ? "outlined" : "contained"}
                            onClick={() => isMember ? handleCancelMembership() : handleJoin(channel?.tiers?.find(t => t.isDefault)?.id)}
                            disabled={subscriptionLoading}
                            startIcon={subscriptionLoading && <CircularProgress size={20} color="inherit" />}
                        >
                            {subscriptionLoading ? 'Processing...' : (isMember ? 'Cancel Membership' : 'Join Channel')}
                        </Button>
                    </Stack>

                    {/* Plan creation status */}
                    {planStatus === 'creating' && (
                        <Alert severity="info" sx={{ mt: 2 }}>
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
                            sx={{ mt: 2 }}
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
                    
                    {/* Debug info - remove in production */}
                    {process.env.NODE_ENV === 'development' && (
                        <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 1 }}>
                            <Typography variant="caption" display="block">
                                Debug: isMember={isMember.toString()}, currentTierId={currentTierId || 'none'}, 
                                subscriptions={profile?.subscriptions?.length || 0}
                            </Typography>
                        </Box>
                    )}
                    
                    <Divider sx={{ mb: 4 }} />
                </Box>
            </Box>

            <Typography variant="h5" gutterBottom sx={{
                fontSize: { xs: '1.125rem', sm: '1.25rem' },
                fontWeight: 600,
                mb: 3
            }}>
                Membership Tiers
            </Typography>
            <Grid container spacing={3}>
                {channel.tiers?.map((tier) => (
                    <Grid item xs={12} md={4} key={tier.id}>
                        <JCard
                            isHighlighted={currentTierId === tier.id}
                        >
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    color: currentTierId === tier.id ? 'primary.main' : 'text.primary'
                                }}>
                                    {tier.name}
                                </Typography>
                                <Typography variant="h4" sx={{
                                    fontWeight: 700,
                                    fontSize: '2rem',
                                    color: currentTierId === tier.id ? 'primary.main' : 'text.primary',
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    gap: 0.5
                                }}>
                                    ${tier.price}
                                    <Typography
                                        component="span"
                                        sx={{
                                            fontSize: '0.875rem',
                                            fontWeight: 400,
                                            color: 'text.secondary'
                                        }}
                                    >
                                        /month
                                    </Typography>
                                </Typography>
                            </Box>

                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 3,
                                    color: 'text.secondary',
                                    minHeight: 60
                                }}
                            >
                                {tier.description}
                            </Typography>

                            <Button
                                variant={currentTierId === tier.id ? "outlined" : "contained"}
                                fullWidth
                                onClick={() => isMember ? handleUpdateMembership(tier.id) : handleJoin(tier.id)}
                                disabled={currentTierId === tier.id || subscriptionLoading}
                                sx={{
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontWeight: 600
                                }}
                                startIcon={subscriptionLoading &&
                                    <CircularProgress size={20} color="inherit" />
                                }
                            >
                                {subscriptionLoading ? 'Processing...' :
                                    currentTierId === tier.id ? 'Current Plan' :
                                        isMember ? 'Switch to This Plan' : 'Join'}
                            </Button>
                        </JCard>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ViewChannel; 