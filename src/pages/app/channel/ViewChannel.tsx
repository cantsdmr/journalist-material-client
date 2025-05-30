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
    CircularProgress
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { Channel } from '@/APIs/ChannelAPI';
import { useApiContext } from '@/contexts/ApiContext';
import JCard from '@/components/common/Card';
import { useProfile } from '@/contexts/ProfileContext';
import { useApiCall } from '@/hooks/useApiCall';

const ViewChannel: React.FC = () => {
    const [channel, setChannel] = useState<Nullable<Channel>>(null);
    const [loading, setLoading] = useState(true);
    const [loadingTierId, setLoadingTierId] = useState<string | null>(null);
    const { id } = useParams();
    const { api } = useApiContext();
    const {
        channelRelations: {
            hasMembership,
            getMembershipTier
        },
        actions: {
            refreshProfile
        }
    } = useProfile();
    const { execute } = useApiCall();

    // Use them in your component
    const isMember = hasMembership(id ?? '');
    const currentTierId = getMembershipTier(id ?? '')?.id;

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
    }, [id, execute]);

    const handleJoin = async (tierId?: string) => {
        if (!channel) return;
        
        const result = await execute(
            () => api?.channelApi.joinChannel(channel.id, { tierId }),
            {
                showSuccessMessage: true,
                successMessage: 'Successfully joined channel!'
            }
        );
        
        if (result) {
            await refreshProfile();
        }
    };

    const handleUpdateMembership = async (tierId: string) => {
        if (!channel) return;
        setLoadingTierId(tierId);
        
        const result = await execute(
            () => api?.channelApi.subscribeToChannel(channel.id, { tier_id: tierId }),
            {
                showSuccessMessage: true,
                successMessage: 'Membership updated successfully!'
            }
        );
        
        if (result) {
            await refreshProfile();
        }
        
        setLoadingTierId(null);
    };

    const handleCancelMembership = async () => {
        if (!channel) return;
        
        const result = await execute(
            () => api?.channelApi.cancelMembership(channel.id),
            {
                showSuccessMessage: true,
                successMessage: 'Membership cancelled successfully!'
            }
        );
        
        if (result) {
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
                        {channel.stats?.membershipCount?.toLocaleString('en-US', {
                            notation: 'compact',
                            maximumFractionDigits: 1
                        })} members • {channel.tiers?.length || 0} tiers
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
                            onClick={() => isMember ? handleCancelMembership() : handleJoin()}
                            disabled={loadingTierId !== null}
                            startIcon={loadingTierId && <CircularProgress size={20} color="inherit" />}
                        >
                            {loadingTierId ? 'Processing...' : (isMember ? 'Cancel Membership' : 'Join Channel')}
                        </Button>
                    </Stack>
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
                                disabled={currentTierId === tier.id || loadingTierId === tier.id}
                                sx={{
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontWeight: 600
                                }}
                                startIcon={loadingTierId === tier.id &&
                                    <CircularProgress size={20} color="inherit" />
                                }
                            >
                                {loadingTierId === tier.id ? 'Processing...' :
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