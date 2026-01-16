import React, { useEffect, useState } from 'react';
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
    Chip,
    Paper,
    alpha,
    Tabs,
    Tab,
    IconButton,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    // Link
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Channel, ChannelTier, TierPaymentConfig } from '@/types/index';
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
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
// import TwitterIcon from '@mui/icons-material/Twitter';
// import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import ListNews from '@/pages/app/news/ListNews';
import PollsList from '@/components/poll/PollsList';
import TagFilter from '@/components/filters/TagFilter';
import PayPalSubscriptionButton from '@/components/subscription/PayPalSubscriptionButton';

const ViewChannel: React.FC = () => {
    const [channel, setChannel] = useState<Nullable<Channel>>(null);
    const [loading, setLoading] = useState(true);
    const [subscriptionLoading, setSubscriptionLoading] = useState(false);
    const [selectedNewsTags, setSelectedNewsTags] = useState<string[]>([]);
    const [selectedPollTags, setSelectedPollTags] = useState<string[]>([]);
    const [pollSearchQuery, setPollSearchQuery] = useState('');
    const [pollSearchInput, setPollSearchInput] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
    const [selectedTier, setSelectedTier] = useState<ChannelTier | null>(null);
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

    // Debug logging
    console.log('ViewChannel Debug:', {
        channelId: id,
        isMember,
        currentTierId,
        subscriptions: profile?.subscriptions,
        profileLoaded: !!profile
    });

    useEffect(() => {
        const fetchChannel = async () => {
            if (!id) return;

            const result = await execute(
                () => api?.app.channel.getChannel(id),
                { showErrorToast: true }
            );

            if (result) {
                setChannel(result);
            }

            setLoading(false);
        };

        fetchChannel();
    }, [id, execute, api?.app.channel]);

    const handleNewsTagsChange = (tags: string[]) => {
        setSelectedNewsTags(tags);
    };

    const handlePollTagsChange = (tags: string[]) => {
        setSelectedPollTags(tags);
    };

    const handlePollSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPollSearchQuery(pollSearchInput.trim());
    };

    const handleClearPollSearch = () => {
        setPollSearchInput('');
        setPollSearchQuery('');
    };

    const handleJoin = async (tierId?: string) => {
        if (!channel || !tierId) return;

        const tier = channel.tiers?.find(t => t.id === tierId);
        if (!tier) return;

        // For free tiers, use direct API call
        if (tier.price === 0) {
            setSubscriptionLoading(true);
            try {
                const result = await api?.app.subscription?.createDirectSubscription(channel.id, {
                    tierId
                });

                if (result) {
                    await refreshProfile();
                }
                setSubscriptionLoading(false);
            } catch (error: any) {
                console.error('Subscription failed:', error);
                setSubscriptionLoading(false);
            }
        }
        // For paid tiers, the PayPal button component will handle the flow
    };

    const handleSubscribeClick = (tier: ChannelTier) => {
        // For free tiers, subscribe directly
        if (tier.price === 0) {
            handleJoin(tier.id);
        } else {
            // For paid tiers, open dialog
            setSelectedTier(tier);
            setSubscriptionDialogOpen(true);
        }
    };

    const handlePayPalSubscriptionSuccess = async (tierName: string, tierId: string) => {
        console.log('PayPal subscription approved:', { tierName, tierId });

        // Refresh profile immediately as subscription is already activated by backend
        await refreshProfile();
        setSubscriptionDialogOpen(false);
        setSelectedTier(null);
    };

    const handlePayPalSubscriptionError = (error: Error) => {
        console.error('PayPal subscription error:', error);
        alert(`Subscription failed: ${error.message}`);
    };

    const handlePayPalSubscriptionCancel = () => {
        console.log('PayPal subscription cancelled');
    };

    const handleUpdateMembership = async (tierId: string) => {
        if (!channel) return;

        const tier = channel.tiers?.find(t => t.id === tierId);
        if (!tier) return;

        // First cancel existing subscription if needed
        const currentSubscription = profile?.subscriptions?.find(s => s.channelId === channel.id);
        if (currentSubscription) {
            try {
                await api?.app.subscription?.cancelUserSubscription(currentSubscription.id);
            } catch (error) {
                console.error('Failed to cancel existing subscription:', error);
            }
        }

        // Then create new subscription (same logic as handleJoin)
        await handleJoin(tierId);
    };

    const handleCancelMembership = async () => {
        if (!channel) return;

        // Get the user's current subscription for this channel
        const currentSubscription = profile?.subscriptions?.find(s => s.channelId === channel.id);

        if (!currentSubscription) {
            console.error('No active subscription found for this channel');
            return;
        }

        // Use SDK-based cancellation flow via SubscriptionAPI
        // This will cancel with PayPal SDK for paid subscriptions, or directly for free ones
        const result = await execute(
            () => api?.app.subscription.cancelUserSubscription(currentSubscription.id),
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
                            <Skeleton variant="text" width="40%" sx={{ mb: 2, fontSize: '2.5rem' }} />
                            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                                <Skeleton variant="rounded" width={150} height={32} />
                                <Skeleton variant="rounded" width={100} height={32} />
                            </Stack>
                            <Skeleton variant="text" width="70%" sx={{ mb: 1 }} />
                            <Skeleton variant="text" width="60%" sx={{ mb: 4 }} />
                            <Skeleton variant="rounded" width={180} height={48} sx={{ borderRadius: 50 }} />
                        </Box>
                    </Paper>

                    {/* Tiers Skeleton */}
                    <Box sx={{ mb: 6 }}>
                        <Skeleton variant="text" width="40%" sx={{ mb: 4, fontSize: '2rem' }} />
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
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                                        Channel News
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Latest news from this channel
                                    </Typography>

                                    {/* Tag Filter */}
                                    <TagFilter
                                        selectedTags={selectedNewsTags}
                                        onTagsChange={handleNewsTagsChange}
                                        contentType="news"
                                        maxTags={5}
                                        showCounts={false}
                                        horizontal={true}
                                    />
                                </Box>

                                <ListNews
                                    filters={{
                                        channel: channel?.id,
                                        ...(selectedNewsTags.length > 0 && { tags: selectedNewsTags })
                                    }}
                                    emptyTitle="No news published yet"
                                    emptyDescription="This channel hasn't published any news articles yet"
                                    showSearch={true}
                                    mode="grid"
                                />
                            </Box>
                        )}

                        {/* Polls Tab */}
                        {activeTab === 1 && (
                            <Box>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
                                        Channel Polls
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Vote on polls from this channel
                                    </Typography>

                                    {/* Search Bar */}
                                    <Box sx={{ mb: 3 }}>
                                        <form onSubmit={handlePollSearchSubmit}>
                                            <TextField
                                                fullWidth
                                                placeholder="Search polls by question or content..."
                                                value={pollSearchInput}
                                                onChange={(e) => setPollSearchInput(e.target.value)}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <SearchIcon color="action" />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: pollSearchInput && (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                size="small"
                                                                onClick={handleClearPollSearch}
                                                                edge="end"
                                                            >
                                                                <ClearIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        bgcolor: 'background.paper',
                                                    }
                                                }}
                                            />
                                        </form>
                                    </Box>

                                    {/* Tag Filter */}
                                    <TagFilter
                                        selectedTags={selectedPollTags}
                                        onTagsChange={handlePollTagsChange}
                                        contentType="polls"
                                        maxTags={5}
                                        showCounts={false}
                                        horizontal={true}
                                    />
                                </Box>

                                <Box>
                                    <PollsList
                                        filters={{
                                            channel: channel?.id,
                                            ...(selectedPollTags.length > 0 && { tags: selectedPollTags }),
                                            ...(pollSearchQuery && { query: pollSearchQuery })
                                        }}
                                        emptyTitle="No polls found"
                                        emptyDescription="This channel hasn't created any polls yet"
                                        mode="grid"
                                    />
                                </Box>
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
                                            {currentTierId === tier.id ? (
                                                <Button
                                                    variant="outlined"
                                                    fullWidth
                                                    size="large"
                                                    disabled
                                                    sx={{
                                                        py: 1.5,
                                                        borderRadius: 50,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        fontSize: '1rem',
                                                    }}
                                                >
                                                    Current Plan
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    size="large"
                                                    onClick={() => isMember ? handleUpdateMembership(tier.id) : handleSubscribeClick(tier)}
                                                    disabled={subscriptionLoading}
                                                    sx={{
                                                        py: 1.5,
                                                        borderRadius: 50,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        fontSize: '1rem',
                                                        boxShadow: '0 4px 12px rgba(11, 108, 255, 0.3)',
                                                        '&:hover': {
                                                            boxShadow: '0 6px 16px rgba(11, 108, 255, 0.4)',
                                                        }
                                                    }}
                                                    startIcon={subscriptionLoading && <CircularProgress size={20} color="inherit" />}
                                                >
                                                    {subscriptionLoading ? 'Processing...' :
                                                        isMember ? 'Switch to This Plan' : tier.price === 0 ? 'Join Free' : 'Subscribe'}
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Container>

            {/* Subscription Dialog for Paid Tiers */}
            <Dialog
                open={subscriptionDialogOpen}
                onClose={() => setSubscriptionDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Subscribe to {selectedTier?.name}
                </DialogTitle>
                <DialogContent>
                    {selectedTier && (
                        <Box>
                            {/* Tier Info */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: selectedTier.currency.toUpperCase()
                                    }).format(selectedTier.price / 100)}
                                    <Typography component="span" variant="body2" color="text.secondary">
                                        /month
                                    </Typography>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {selectedTier.description}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Payment Provider Buttons */}
                            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                                Select Payment Method:
                            </Typography>

                            {selectedTier.paymentConfigs && selectedTier.paymentConfigs.length > 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {selectedTier.paymentConfigs.map((config: TierPaymentConfig) => {
                                        if (config.provider?.code === 'paypal' && config.isActive) {
                                            return (
                                                <Box key={config.id}>
                                                    <PayPalSubscriptionButton
                                                        planId={config.providerPlanId}
                                                        channelId={channel!.id}
                                                        tierName={selectedTier.name}
                                                        tierId={selectedTier.id}
                                                        onSuccess={handlePayPalSubscriptionSuccess}
                                                        onError={handlePayPalSubscriptionError}
                                                        onCancel={handlePayPalSubscriptionCancel}
                                                        disabled={subscriptionLoading}
                                                    />
                                                </Box>
                                            );
                                        }
                                        return null;
                                    })}
                                </Box>
                            ) : (
                                <Typography variant="body2" color="error">
                                    No payment methods configured for this tier. Please contact the channel owner.
                                </Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSubscriptionDialogOpen(false)}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ViewChannel; 