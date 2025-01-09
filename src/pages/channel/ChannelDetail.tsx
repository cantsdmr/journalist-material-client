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
  Divider
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { Channel, SubscriptionTier } from '../../APIs/ChannelAPI';
import { useApiContext } from '../../contexts/ApiContext';

const ChannelDetail: React.FC = () => {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const { channelId } = useParams();
  const { api } = useApiContext();

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        if (channelId) {
          const result = await api?.channelApi.get(channelId);
          setChannel(result ?? null);
        }
      } catch (error) {
        console.error('Failed to fetch channel:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [channelId, api?.channelApi]);

  const handleFollow = async () => {
    try {
      if (!channel) return;
      await api?.channelApi.follow(channel.id);
      setChannel(prev => prev ? { ...prev, isFollowing: true } : null);
    } catch (error) {
      console.error('Failed to follow channel:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      if (!channel) return;
      await api?.channelApi.unfollow(channel.id);
      setChannel(prev => prev ? { ...prev, isFollowing: false } : null);
    } catch (error) {
      console.error('Failed to unfollow channel:', error);
    }
  };

  const handleJoin = async (tierId: string) => {
    try {
      if (!channel) return;
      await api?.channelApi.join(channel.id, tierId);
      setChannel(prev => prev ? { ...prev, isSubscribed: true } : null);
    } catch (error) {
      console.error('Failed to join channel:', error);
    }
  };

  const handleLeave = async () => {
    try {
      if (!channel) return;
      await api?.channelApi.leave(channel.id);
      setChannel(prev => prev ? { ...prev, isSubscribed: false } : null);
    } catch (error) {
      console.error('Failed to leave channel:', error);
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
      <Box sx={{ textAlign: 'center', mb: 4 }}>
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
          {channel.followers?.length.toLocaleString()} followers
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {channel.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
          <Button 
            variant={channel.isFollowing ? "outlined" : "contained"}
            onClick={channel.isFollowing ? handleUnfollow : handleFollow}
          >
            {channel.isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
          {channel.isSubscribed && (
            <Button 
              variant="outlined"
              color="secondary"
              onClick={handleLeave}
            >
              Leave Channel
            </Button>
          )}
        </Box>
        <Divider sx={{ mb: 4 }} />
      </Box>

      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Subscription Tiers
      </Typography>
      <Grid container spacing={3}>
        {channel.tiers?.map((tier) => (
          <Grid item xs={12} md={4} key={tier.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {tier.name}
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  ${tier.price}
                  <Typography variant="caption" component="span">/month</Typography>
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {tier.description}
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => handleJoin(tier.id)}
                  disabled={channel.isSubscribed}
                >
                  {channel.isSubscribed ? 'Current Tier' : 'Join'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ChannelDetail; 