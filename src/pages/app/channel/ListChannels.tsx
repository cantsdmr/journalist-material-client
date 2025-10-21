import React, { useEffect, useState } from 'react';
import {
  Stack,
  Box,
  Typography,
} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Channel } from '@/types/index';
import { useApiContext } from '@/contexts/ApiContext';
import ChannelItem from '@/components/channel/ChannelItem/index';
import { alpha } from '@mui/material/styles';
import { useProfile } from '@/contexts/ProfileContext';
import { useApiCall } from '@/hooks/useApiCall';
import TagFilter from '@/components/filters/TagFilter';
import { useLocation, useNavigate } from 'react-router-dom';

const ListChannels: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { api } = useApiContext();
  const { actions, channelRelations } = useProfile();
  const { execute } = useApiCall();

  // Extract tags from URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tagsParam = searchParams.get('tags');

    if (tagsParam) {
      const urlTags = tagsParam.split(',').map(tag => decodeURIComponent(tag.trim()));
      setSelectedTags(urlTags);
    }
  }, [location.search]);

  const fetchMoreData = () => {
    getChannels(page + 1);
  };

  const getChannels = async (_page: number = page) => {
    const filters = selectedTags.length > 0 ? { tags: selectedTags } : {};

    const result = await execute(
      () => api?.channelApi.getChannels(
        filters, // Apply tag filters
        {
          page: _page,
          limit
        }
      ),
      { showErrorToast: true }
    );

    if (result) {
      if (_page === 1) {
        setChannels(result.items ?? []);
      } else {
        setChannels(prev => [...prev, ...(result.items ?? [])]);
      }

      setPage(result.metadata.currentPage ?? 1);
      setLimit(result.metadata.limit ?? 10);
      setHasMore(result.metadata.hasNext === true);
    }
  };

  useEffect(() => {
    setPage(1);
    getChannels(1);
  }, [selectedTags]); // Refetch when tags change

  const handleJoin = async (channelId: string, tierId?: string) => {
    if (!tierId) return;

    // Find the channel and tier to determine if it's paid
    const channel = channels.find(c => c.id === channelId);
    const tier = channel?.tiers?.find(t => t.id === tierId);

    if (!tier) return;

    try {
      // Use direct subscription API for all tiers
      const result = await api?.subscriptionApi?.createDirectSubscription(channelId, {
        tierId,
        notificationLevel: 1,
        paymentMethodId: tier.price > 0 ? 'paypal_default' : undefined
      });

      if (result?.approvalUrl) {
        // Open PayPal approval URL for paid subscriptions
        const paymentWindow = window.open(
          result.approvalUrl,
          'paypal_payment',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        if (!paymentWindow) {
          alert('Popup blocked! Please allow popups and try again.');
        }
      } else {
        // Free subscription completed immediately
        await actions.refreshProfile();
      }
    } catch (error: any) {
      console.error('Subscription failed:', error);

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

  const handleCancel = async (channelId: string) => {
    const result = await execute(
      () => api?.channelApi.unsubscribeFromChannel(channelId),
      {
        showSuccessMessage: true,
        successMessage: 'Membership cancelled successfully!'
      }
    );

    if (result) {
      await actions.refreshProfile();
    }
  };

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);

    // Update URL with selected tags
    const searchParams = new URLSearchParams(location.search);
    if (tags.length > 0) {
      searchParams.set('tags', tags.map(tag => encodeURIComponent(tag)).join(','));
    } else {
      searchParams.delete('tags');
    }

    const newPath = `${location.pathname}?${searchParams.toString()}`;
    navigate(newPath, { replace: true });
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Discover Channels
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Find and subscribe to channels from your favorite journalists
        </Typography>
      </Box>

      {/* Tag Filter Component */}
      <Box sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}>
        <TagFilter
          selectedTags={selectedTags}
          onTagsChange={handleTagsChange}
          contentType="channels"
          maxTags={3}
          showCounts={false}
        />
      </Box>

      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <InfiniteScroll
          dataLength={channels.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <Stack spacing={2} sx={{ mt: 2 }}>
              {[...Array(2)].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.white, 0.05)
                        : alpha(theme.palette.common.black, 0.03)
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? alpha(theme.palette.common.white, 0.1)
                          : alpha(theme.palette.common.black, 0.1)
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ height: 24, width: '40%', mb: 1, borderRadius: 0.5, bgcolor: 'grey.300' }} />
                    <Box sx={{ height: 16, width: '80%', mb: 1, borderRadius: 0.5, bgcolor: 'grey.200' }} />
                    <Box sx={{ height: 16, width: '30%', borderRadius: 0.5, bgcolor: 'grey.200' }} />
                  </Box>
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
              No more channels to display
            </Box>
          }
        >
          <Stack spacing={2.5}>
            {channels.map((channel) => (
              <ChannelItem
                key={channel.id}
                channel={channel}
                hasSubscription={channelRelations.hasSubscription(channel.id)}
                subscriptionTier={channelRelations.getSubscriptionTier(channel.id)}
                onJoin={handleJoin}
                onCancel={handleCancel}
              />
            ))}
          </Stack>
        </InfiniteScroll>
      </Box>
    </Box>
  );
};

export default ListChannels;
