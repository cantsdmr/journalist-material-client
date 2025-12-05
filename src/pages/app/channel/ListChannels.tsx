import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useProfile } from '@/contexts/ProfileContext';
import TagFilter from '@/components/filters/TagFilter';
import { useLocation, useNavigate } from 'react-router-dom';
import ChannelsList from '@/components/channel/ChannelsList';
import { useApiContext } from '@/contexts/ApiContext';

const ListChannels: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { actions, channelRelations } = useProfile();
  const { api } = useApiContext();
  
  // Extract tags from URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tagsParam = searchParams.get('tags');

    if (tagsParam) {
      const urlTags = tagsParam.split(',').map(tag => decodeURIComponent(tag.trim()));
      setSelectedTags(urlTags);
    }
  }, [location.search]);

  const handleJoin = async (channelId: string, tierId?: string) => {
    if (!tierId) return;

    try {
      // Use direct subscription API for all tiers
      const result = await api?.app.subscription?.createDirectSubscription(channelId, {
        tierId,
        notificationLevel: 1,
        paymentMethodId: 'paypal_default' // Will be used for paid subscriptions
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
    try {
      await api?.app.channel.unsubscribeFromChannel(channelId);
      await actions.refreshProfile();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Discover Channels
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Find and subscribe to channels from your favorite journalists
        </Typography>
      </Box>

      {/* Tag Filter Component */}
      <Box sx={{ mb: 3 }}>
        <TagFilter
          selectedTags={selectedTags}
          onTagsChange={handleTagsChange}
          contentType="channels"
          maxTags={3}
          showCounts={false}
          horizontal={true}
        />
      </Box>

      {/* Channels List */}
      <Box>
        <ChannelsList
          filters={selectedTags.length > 0 ? { tags: selectedTags } : {}}
          emptyTitle="No channels found"
          emptyDescription="No channels available at the moment"
          hasSubscription={channelRelations.hasSubscription}
          getSubscriptionTier={channelRelations.getSubscriptionTier}
          onJoin={handleJoin}
          onCancel={handleCancel}
        />
      </Box>
    </Box>
  );
};

export default ListChannels;
