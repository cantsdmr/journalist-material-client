import React, { useEffect, useState } from 'react';
import { Stack, Box, alpha, Grid } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Channel } from '@/types/index';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';
import ChannelItem from '@/components/channel/ChannelItem/index';
import { EmptyState } from '@/components/common/EmptyState';

interface ChannelsListProps {
  filters?: any;
  emptyTitle?: string;
  emptyDescription?: string;
  itemsPerPage?: number;
  hasSubscription?: (channelId: string) => boolean;
  getSubscriptionTier?: (channelId: string) => any;
  onJoin?: (channelId: string, tierId?: string) => void;
  onCancel?: (channelId: string) => void;
}

const ChannelSkeleton = ({ count = 2 }: { count?: number }) => (
  <Stack spacing={2} sx={{ mt: 2 }}>
    {[...Array(count)].map((_, index) => (
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
);

const ChannelsList: React.FC<ChannelsListProps> = ({
  filters = {},
  emptyTitle = 'No channels found',
  emptyDescription = 'No channels available at the moment',
  itemsPerPage = 10,
  hasSubscription,
  getSubscriptionTier,
  onJoin,
  onCancel
}) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { api } = useApiContext();
  const { execute } = useApiCall();

  const fetchChannels = async (_page: number = page) => {
    try {
      setLoading(true);

      const response = await execute(
        () => api?.app.channel.getChannels(filters, { page: _page, limit: itemsPerPage }),
        { showErrorToast: true }
      );

      if (response) {
        if (_page === 1) {
          setChannels(response.items ?? []);
        } else {
          setChannels(prev => [...prev, ...(response.items ?? [])]);
        }
        setPage(response.metadata.currentPage ?? 1);
        setHasMore(response.metadata.hasNext === true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setChannels([]); // Clear channels when filters change
    setPage(1);
    fetchChannels(1);
  }, [JSON.stringify(filters)]); // Watch for filter changes

  const fetchMoreData = () => {
    if (!loading && hasMore) {
      fetchChannels(page + 1);
    }
  };

  if (channels.length === 0 && !loading) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {loading && channels.length === 0 ? (
        <ChannelSkeleton />
      ) : (
        <InfiniteScroll
          dataLength={channels.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<Box />}
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
          <Grid container spacing={3}>
            {channels.map((channel) => (
              <Grid item xs={12} sm={6} md={4} key={channel.id}>
                <ChannelItem
                  channel={channel}
                  hasSubscription={hasSubscription?.(channel.id) ?? false}
                  subscriptionTier={getSubscriptionTier?.(channel.id)}
                  onJoin={onJoin}
                  onCancel={onCancel}
                />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      )}
    </Box>
  );
};

export default ChannelsList;
