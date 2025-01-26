import React, { useEffect, useState } from 'react';
import { 
  Stack,
  Box,
  Container,
} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Channel } from '../../../APIs/ChannelAPI';
import { useApiContext } from '../../../contexts/ApiContext';
import ChannelItem from '@/components/channel/ChannelItem/index';
import { alpha } from '@mui/material/styles';
import { useUserInfo } from '@/hooks/useUserInfo';

const ListChannels: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { api } = useApiContext();
  const { refreshUserInfo } = useUserInfo();

  const fetchMoreData = () => {
    getChannels(page + 1);
  };

  const getChannels = async (_page: number = page) => {
    try {
      const result = await api?.channelApi.getChannels({
        page: _page,
        limit
      });
      
      if (_page === 1) {
        setChannels(result?.items ?? []);
      } else {
        setChannels(prev => [...prev, ...(result?.items ?? [])]);
      }
      
      setPage(result?.metadata.currentPage ?? 1);
      setLimit(result?.metadata.limit ?? 10);
      setHasMore(result?.metadata.hasNext === true);
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    }
  };

  useEffect(() => {
    getChannels(page); 
  }, []);

  const handleFollow = async (channelId: string) => {
    try {
      await api?.channelApi.follow(channelId);
      await refreshUserInfo();
    } catch (error) {
      console.error('Failed to follow channel:', error);
    }
  };

  const handleUnfollow = async (channelId: string) => {
    try {
      await api?.channelApi.unfollow(channelId);
      await refreshUserInfo();
    } catch (error) {
      console.error('Failed to unfollow channel:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
                <Box sx={{ flex: 1 }}>
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
        <Stack spacing={1}>
          {channels.map((channel) => (
            <ChannelItem 
              key={channel.id}
              channel={channel}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
            />
          ))}
        </Stack>
      </InfiniteScroll>
    </Container>
  );
};

export default ListChannels;
