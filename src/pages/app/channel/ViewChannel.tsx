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
    LinearProgress,
    Chip,
    Paper,
    alpha,
    Tabs,
    Tab,
    IconButton,
    // Link
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Channel } from '@/types/index';
import { useApiContext } from '@/contexts/ApiContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useApiCall } from '@/hooks/useApiCall';
import PeopleIcon from '@mui/icons-material/People';
import LayersIcon from '@mui/icons-material/Layers';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import InfoIcon from '@mui/icons-material/Info';
import ArticleIcon from '@mui/icons-material/Article';
import PollIcon from '@mui/icons-material/Poll';
// import TwitterIcon from '@mui/icons-material/Twitter';
// import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import ListNews from '@/pages/app/news/ListNews';
import PollCard from '@/components/poll/PollCard';
import { Poll } from '@/types/index';
import InfiniteScroll from 'react-infinite-scroll-component';
import { EmptyState } from '@/components/common/EmptyState';
import { Link as RouterLink } from 'react-router-dom';
import { PATHS } from '@/constants/paths';
import TagFilter from '@/components/filters/TagFilter';

const ViewChannel: React.FC = () => {
    const [channel, setChannel] = useState<Nullable<Channel>>(null);
    const [loading, setLoading] = useState(true);
    const [subscriptionLoading, setSubscriptionLoading] = useState(false);
    const [polls, setPolls] = useState<Poll[]>([]);
    const [pollsLoading, setPollsLoading] = useState(false);
    const [pollPage, setPollPage] = useState(1);
    const [pollHasMore, setPollHasMore] = useState(true);
    const [selectedPollTags, setSelectedPollTags] = useState<string[]>([]);
    const [pendingSubscription, setPendingSubscription] = useState<{
        subscriptionId: string;
        approvalUrl: string;
        tierName: string;
        tierId: string;
    } | null>(null);
    const [planStatus, setPlanStatus] = useState<'checking' | 'creating' | 'ready'>('ready');
    const [activeTab, setActiveTab] = useState(0);
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

    // Fetch polls when on Polls tab
    const fetchPolls = useCallback(async (_page: number = pollPage) => {
        if (!channel?.id) return;

        setPollsLoading(true);

        const filters: any = { channel: channel.id };
        if (selectedPollTags.length > 0) {
            filters.tags = selectedPollTags;
        }

        const response = await execute(
            () => api?.pollApi.getPolls(filters, { page: _page, limit: 10 }),
            { showErrorToast: true }
        );

        if (response) {
            if (_page === 1) {
                setPolls(response.items);
            } else {
                setPolls(prev => [...prev, ...response.items]);
            }
            setPollPage(response.metadata.currentPage);
            setPollHasMore(response.metadata.hasNext === true);
        }

        setPollsLoading(false);
    }, [channel?.id, selectedPollTags, pollPage, execute, api?.pollApi]);

    useEffect(() => {
        if (activeTab === 1 && channel?.id) {
            setPollPage(1);
            fetchPolls(1);
        }
    }, [activeTab, channel?.id, selectedPollTags, fetchPolls]);

    const fetchMorePolls = () => {
        if (!pollsLoading && pollHasMore) {
            fetchPolls(pollPage + 1);
        }
    };

    const handlePollTagsChange = (tags: string[]) => {
        setSelectedPollTags(tags);
    };

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
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
                <Container maxWidth="lg">
                    {/* Banner and Avatar Skeleton */}
                    <Box sx={{ position: 'relative', mb: 8 }}>
                        <Skeleton
                            variant="rectangular"
                            sx={{
                                height: { xs: 150, md: 200 },
                                borderRadius: 3
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -50,
                                left: '50%',
                                transform: 'translateX(-50%)',
                            }}
                        >
                            <Skeleton
                                variant="circular"
                                sx={{
                                    width: { xs: 100, md: 128 },
                                    height: { xs: 100, md: 128 },
                                    border: '4px solid',
                                    borderColor: 'background.paper',
                                }}
                            />
                        </Box>
                    </Box>

                    <Paper elevation={0} sx={{ mb: 4, p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ textAlign: 'center', pt: 3 }}>
                            <Skeleton variant="text" width="40%" sx={{ mx: 'auto', mb: 2, fontSize: '2.5rem' }} />
                            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                                <Skeleton variant="rounded" width={150} height={32} />
                                <Skeleton variant="rounded" width={100} height={32} />
                            </Stack>
                            <Skeleton variant="text" width="70%" sx={{ mx: 'auto', mb: 1 }} />
                            <Skeleton variant="text" width="60%" sx={{ mx: 'auto', mb: 4 }} />
                            <Skeleton variant="rounded" width={180} height={48} sx={{ mx: 'auto', borderRadius: 50 }} />
                        </Box>
                    </Paper>

                    {/* Tiers Skeleton */}
                    <Box sx={{ mb: 6 }}>
                        <Skeleton variant="text" width="40%" sx={{ mx: 'auto', mb: 4, fontSize: '2rem' }} />
                        <Grid container spacing={3}>
                            {[...Array(3)].map((_, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <Card elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                                        <Skeleton variant="rectangular" height={120} />
                                        <CardContent sx={{ p: 3 }}>
                                            <Skeleton variant="text" width="60%" sx={{ mx: 'auto', mb: 2, fontSize: '2rem' }} />
                                            <Skeleton variant="text" width="80%" sx={{ mb: 1 }} />
                                            <Skeleton variant="text" width="70%" sx={{ mb: 1 }} />
                                            <Skeleton variant="text" width="75%" sx={{ mb: 3 }} />
                                            <Skeleton variant="rounded" height={48} sx={{ borderRadius: 50 }} />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>
            </Box>
        );
    }

    if (!channel) {
        return (
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Container maxWidth="sm">
                    <Paper elevation={3} sx={{ p: 6, borderRadius: 3, textAlign: 'center' }}>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
                            Channel not found
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            The channel you're looking for doesn't exist or has been removed.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/app')}
                            sx={{
                                borderRadius: 50,
                                px: 4,
                                py: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                            }}
                        >
                            Go Home
                        </Button>
                    </Paper>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            <Container maxWidth="lg">
                {/* Banner and Avatar Section */}
                <Box sx={{ position: 'relative', mb: 8 }}>
                    {/* Banner */}
                    <Box
                        sx={{
                            height: { xs: 150, md: 200 },
                            backgroundImage: channel?.bannerUrl
                                ? `url(${channel.bannerUrl})`
                                : undefined,
                            background: channel?.bannerUrl
                                ? undefined
                                : (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: 3,
                            position: 'relative',
                        }}
                    />

                    {/* Avatar positioned at bottom of banner */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: -50,
                            left: '50%',
                            transform: 'translateX(-50%)',
                        }}
                    >
                        <Avatar
                            src={channel.logoUrl}
                            sx={{
                                width: { xs: 100, md: 128 },
                                height: { xs: 100, md: 128 },
                                border: '4px solid',
                                borderColor: 'background.paper',
                                boxShadow: 3,
                            }}
                        />
                    </Box>
                </Box>

                {/* Channel Info Card */}
                <Paper
                    elevation={0}
                    sx={{
                        mb: 4,
                        p: { xs: 3, md: 4 },
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box sx={{ textAlign: 'center', pt: 3 }}>

                        {/* Channel Name */}
                        <Typography
                            variant="h3"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                fontSize: { xs: '2rem', md: '2.5rem' },
                                color: 'text.primary',
                                mb: 1,
                            }}
                        >
                            {channel.name}
                        </Typography>

                        {/* Stats Badges */}
                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                            sx={{ mb: 3 }}
                        >
                            <Chip
                                icon={<PeopleIcon />}
                                label={`${channel.stats?.activeSubscriptionCount?.toLocaleString('en-US', {
                                    notation: 'compact',
                                    maximumFractionDigits: 1
                                })} subscribers`}
                                sx={{
                                    fontWeight: 600,
                                    bgcolor: alpha('#0b6cff', 0.1),
                                    color: '#0b6cff',
                                    '& .MuiChip-icon': { color: '#0b6cff' }
                                }}
                            />
                            <Chip
                                icon={<LayersIcon />}
                                label={`${channel.tiers?.length || 0} tiers`}
                                sx={{
                                    fontWeight: 600,
                                    bgcolor: alpha('#589aff', 0.1),
                                    color: '#589aff',
                                    '& .MuiChip-icon': { color: '#589aff' }
                                }}
                            />
                        </Stack>

                        {/* Description */}
                        <Typography
                            variant="body1"
                            sx={{
                                mb: 4,
                                maxWidth: 800,
                                mx: 'auto',
                                color: 'text.secondary',
                                lineHeight: 1.8,
                                fontSize: '1.1rem',
                            }}
                        >
                            {channel.description}
                        </Typography>

                        {/* Action Button */}
                        <Button
                            variant={isMember ? "outlined" : "contained"}
                            size="large"
                            onClick={() => isMember ? handleCancelMembership() : handleJoin(channel?.tiers?.find(t => t.isDefault)?.id)}
                            disabled={subscriptionLoading}
                            startIcon={subscriptionLoading && <CircularProgress size={20} color="inherit" />}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 50,
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: isMember ? 'none' : '0 4px 14px 0 rgba(11, 108, 255, 0.39)',
                                '&:hover': {
                                    boxShadow: isMember ? 'none' : '0 6px 20px rgba(11, 108, 255, 0.5)',
                                }
                            }}
                        >
                            {subscriptionLoading ? 'Processing...' : (isMember ? 'Cancel Membership' : 'Join Channel')}
                        </Button>
                    </Box>

                    {/* Plan creation status */}
                    {planStatus === 'creating' && (
                        <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
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
                            sx={{ mt: 3, borderRadius: 2 }}
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
                </Paper>

                {/* Navigation Tabs */}
                <Paper
                    elevation={0}
                    sx={{
                        mb: 4,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden'
                    }}
                >
                    <Tabs
                        value={activeTab}
                        onChange={(_, newValue) => setActiveTab(newValue)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                minHeight: 64,
                            }
                        }}
                    >
                        <Tab
                            icon={<ArticleIcon />}
                            iconPosition="start"
                            label="News"
                        />
                        <Tab
                            icon={<PollIcon />}
                            iconPosition="start"
                            label="Polls"
                        />
                        <Tab
                            icon={<VolunteerActivismIcon />}
                            iconPosition="start"
                            label="Contribute"
                        />
                        <Tab
                            icon={<ConnectWithoutContactIcon />}
                            iconPosition="start"
                            label="Connect"
                        />
                        <Tab
                            icon={<AccountBalanceWalletIcon />}
                            iconPosition="start"
                            label="Budget"
                        />
                        <Tab
                            icon={<InfoIcon />}
                            iconPosition="start"
                            label="About"
                        />
                    </Tabs>

                    {/* Tab Panels */}
                    <Box sx={{ p: 4 }}>
                        {/* News Tab */}
                        {activeTab === 0 && (
                            <Box>
                                <ListNews
                                    filters={{ channel: channel?.id }}
                                    title="Channel News"
                                    description="Latest news from this channel"
                                    emptyTitle="No news published yet"
                                    emptyDescription="This channel hasn't published any news articles yet"
                                    showSearch={true}
                                />
                            </Box>
                        )}

                        {/* Polls Tab */}
                        {activeTab === 1 && (
                            <Box>
                                <Box sx={{ maxWidth: 800, mx: 'auto', mb: 3 }}>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                                        Channel Polls
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Vote on polls from this channel
                                    </Typography>

                                    {/* Tag Filter */}
                                    <TagFilter
                                        selectedTags={selectedPollTags}
                                        onTagsChange={handlePollTagsChange}
                                        contentType="polls"
                                        maxTags={4}
                                        showCounts={false}
                                    />
                                </Box>

                                {pollsLoading && polls.length === 0 ? (
                                    <Stack spacing={2} sx={{ mt: 2, maxWidth: 800, mx: 'auto' }}>
                                        {[...Array(2)].map((_, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    bgcolor: (theme) =>
                                                        theme.palette.mode === 'dark'
                                                            ? alpha(theme.palette.common.white, 0.05)
                                                            : alpha(theme.palette.common.black, 0.03)
                                                }}
                                            >
                                                <Box sx={{ height: 24, width: '40%', mb: 2, borderRadius: 0.5, bgcolor: 'grey.300' }} />
                                                <Stack spacing={2}>
                                                    {[...Array(4)].map((_, i) => (
                                                        <Box
                                                            key={i}
                                                            sx={{
                                                                height: 40,
                                                                borderRadius: 1,
                                                                bgcolor: (theme) =>
                                                                    theme.palette.mode === 'dark'
                                                                        ? alpha(theme.palette.common.white, 0.1)
                                                                        : alpha(theme.palette.common.black, 0.1)
                                                            }}
                                                        />
                                                    ))}
                                                </Stack>
                                            </Box>
                                        ))}
                                    </Stack>
                                ) : polls.length === 0 ? (
                                    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                                        <EmptyState
                                            title="No polls found"
                                            description="This channel hasn't created any polls yet"
                                        />
                                    </Box>
                                ) : (
                                    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                                        <InfiniteScroll
                                            dataLength={polls.length}
                                            next={fetchMorePolls}
                                            hasMore={pollHasMore}
                                            loader={
                                                <Stack spacing={2} sx={{ mt: 2 }}>
                                                    {[...Array(2)].map((_, index) => (
                                                        <Box
                                                            key={index}
                                                            sx={{
                                                                p: 2,
                                                                borderRadius: 2,
                                                                bgcolor: (theme) =>
                                                                    theme.palette.mode === 'dark'
                                                                        ? alpha(theme.palette.common.white, 0.05)
                                                                        : alpha(theme.palette.common.black, 0.03)
                                                            }}
                                                        >
                                                            <Box sx={{ height: 24, width: '40%', mb: 2, borderRadius: 0.5, bgcolor: 'grey.300' }} />
                                                            <Stack spacing={2}>
                                                                {[...Array(4)].map((_, i) => (
                                                                    <Box
                                                                        key={i}
                                                                        sx={{
                                                                            height: 40,
                                                                            borderRadius: 1,
                                                                            bgcolor: (theme) =>
                                                                                theme.palette.mode === 'dark'
                                                                                    ? alpha(theme.palette.common.white, 0.1)
                                                                                    : alpha(theme.palette.common.black, 0.1)
                                                                        }}
                                                                    />
                                                                ))}
                                                            </Stack>
                                                        </Box>
                                                    ))}
                                                </Stack>
                                            }
                                            endMessage={
                                                <Box sx={{
                                                    textAlign: 'center',
                                                    mt: 4,
                                                    color: 'text.secondary',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    No more polls to display
                                                </Box>
                                            }
                                        >
                                            <Stack spacing={2.5}>
                                                {polls.map((poll) => (
                                                    <Box
                                                        key={poll.id}
                                                        component={RouterLink}
                                                        to={PATHS.APP_POLL_VIEW.replace(':id', poll.id)}
                                                        sx={{ textDecoration: 'none' }}
                                                    >
                                                        <PollCard poll={poll} />
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </InfiniteScroll>
                                    </Box>
                                )}
                            </Box>
                        )}

                        {/* Contribute Tab */}
                        {activeTab === 2 && (
                            <Box>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                    Become a financial contributor
                                </Typography>
                            </Box>
                        )}

                        {/* Connect Tab */}
                        {activeTab === 3 && (
                            <Box>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                    Connect with us
                                </Typography>
                                <Stack spacing={2}>
                                    {/* {channel.websiteUrl && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <IconButton color="primary" size="small">
                                                <LanguageIcon />
                                            </IconButton>
                                            <Link
                                                href={channel.websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ textDecoration: 'none' }}
                                            >
                                                {channel.websiteUrl}
                                            </Link>
                                        </Box>
                                    )}
                                    {channel.twitterHandle && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <IconButton color="primary" size="small">
                                                <TwitterIcon />
                                            </IconButton>
                                            <Link
                                                href={`https://twitter.com/${channel.twitterHandle}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ textDecoration: 'none' }}
                                            >
                                                @{channel.twitterHandle}
                                            </Link>
                                        </Box>
                                    )} */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <IconButton color="primary" size="small">
                                            <EmailIcon />
                                        </IconButton>
                                        <Typography>Contact via membership</Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        )}

                        {/* Budget Tab */}
                        {activeTab === 4 && (
                            <Box>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                    Budget
                                </Typography>
                                <Typography color="text.secondary">
                                    Financial information will be displayed here
                                </Typography>
                            </Box>
                        )}

                        {/* About Tab */}
                        {activeTab === 5 && (
                            <Box>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                    About
                                </Typography>
                                <Stack spacing={3}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            DESCRIPTION
                                        </Typography>
                                        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                                            {channel.description}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            STATISTICS
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6} md={3}>
                                                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                                    <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                                                        {channel.stats?.activeSubscriptionCount || 0}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Subscribers
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                                    <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                                                        {channel.tiers?.length || 0}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Tiers
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Stack>
                            </Box>
                        )}
                    </Box>
                </Paper>

                {/* Membership Tiers Section - Only show in Contribute tab */}
                {activeTab === 2 && (
                    <Box sx={{ mb: 6 }}>
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                fontSize: { xs: '1.75rem', md: '2rem' },
                                fontWeight: 700,
                                mb: 4,
                                textAlign: 'center',
                            }}
                        >
                            Membership Tiers
                        </Typography>

                        <Grid container spacing={3}>
                            {channel.tiers?.map((tier) => (
                                <Grid item xs={12} md={4} key={tier.id}>
                                    <Card
                                        elevation={currentTierId === tier.id ? 8 : 2}
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                            transition: 'all 0.3s ease',
                                            border: currentTierId === tier.id ? '2px solid #0b6cff' : '1px solid #e0e0e0',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                                            }
                                        }}
                                    >
                                        {/* Tier Header with Gradient */}
                                        <Box
                                            sx={{
                                                height: 120,
                                                background: currentTierId === tier.id
                                                    ? 'linear-gradient(135deg, #0b6cff 0%, #589aff 100%)'
                                                    : 'linear-gradient(135deg, #589aff 0%, #7bb0ff 100%)',
                                                position: 'relative',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                p: 3,
                                            }}
                                        >
                                            {currentTierId === tier.id && (
                                                <Chip
                                                    label="CURRENT PLAN"
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 12,
                                                        right: 12,
                                                        bgcolor: 'white',
                                                        color: '#0b6cff',
                                                        fontWeight: 700,
                                                        fontSize: '0.7rem',
                                                    }}
                                                />
                                            )}
                                            {!currentTierId && tier.isDefault && (
                                                <Chip
                                                    label="POPULAR"
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 12,
                                                        right: 12,
                                                        bgcolor: 'white',
                                                        color: '#589aff',
                                                        fontWeight: 700,
                                                        fontSize: '0.7rem',
                                                    }}
                                                />
                                            )}
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    color: 'white',
                                                    fontWeight: 700,
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {tier.name}
                                            </Typography>
                                        </Box>

                                        <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                                            {/* Price */}
                                            <Box sx={{ mb: 3, textAlign: 'center' }}>
                                                <Typography
                                                    variant="h3"
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: 'text.primary',
                                                        display: 'flex',
                                                        alignItems: 'baseline',
                                                        justifyContent: 'center',
                                                        gap: 0.5,
                                                    }}
                                                >
                                                    <Typography component="span" sx={{ fontSize: '1.5rem', fontWeight: 500 }}>
                                                        $
                                                    </Typography>
                                                    {tier.price}
                                                    <Typography
                                                        component="span"
                                                        sx={{
                                                            fontSize: '1rem',
                                                            fontWeight: 400,
                                                            color: 'text.secondary',
                                                        }}
                                                    >
                                                        /month
                                                    </Typography>
                                                </Typography>
                                            </Box>

                                            <Divider sx={{ mb: 3 }} />

                                            {/* Description */}
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    mb: 3,
                                                    color: 'text.secondary',
                                                    minHeight: 60,
                                                    lineHeight: 1.7,
                                                    flexGrow: 1,
                                                }}
                                            >
                                                {tier.description}
                                            </Typography>

                                            {/* Action Button */}
                                            <Button
                                                variant={currentTierId === tier.id ? "outlined" : "contained"}
                                                fullWidth
                                                size="large"
                                                onClick={() => isMember ? handleUpdateMembership(tier.id) : handleJoin(tier.id)}
                                                disabled={currentTierId === tier.id || subscriptionLoading}
                                                sx={{
                                                    py: 1.5,
                                                    borderRadius: 50,
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    fontSize: '1rem',
                                                    boxShadow: currentTierId === tier.id ? 'none' : '0 4px 12px rgba(11, 108, 255, 0.3)',
                                                    '&:hover': {
                                                        boxShadow: currentTierId === tier.id ? 'none' : '0 6px 16px rgba(11, 108, 255, 0.4)',
                                                    }
                                                }}
                                                startIcon={subscriptionLoading && <CircularProgress size={20} color="inherit" />}
                                            >
                                                {subscriptionLoading ? 'Processing...' :
                                                    currentTierId === tier.id ? 'Current Plan' :
                                                        isMember ? 'Switch to This Plan' : 'Contribute'}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default ViewChannel; 