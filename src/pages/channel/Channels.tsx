import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Stack,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Channel } from '../../APIs/ChannelAPI';
import { useApiContext } from '../../contexts/ApiContext';
import ChannelItem from '../../components/ChannelItem';

const Channels: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { api } = useApiContext();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const fetchMoreData = () => {
    getChannels(page + 1);
  };

  const getChannels = async (_page: number = page) => {
    try {
      const result = await api?.channelApi.list('', {
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
    getChannels(1);
  }, [api?.channelApi]);

  const handleFollow = async (channelId: string) => {
    try {
      await api?.channelApi.follow(channelId);
      setChannels(prev => prev.map(channel => 
        channel.id === channelId 
          ? { ...channel, followers: [{ userId: 'current-user' }] }
          : channel
      ));
    } catch (error) {
      console.error('Failed to follow channel:', error);
    }
  };

  const handleUnfollow = async (channelId: string) => {
    try {
      await api?.channelApi.unfollow(channelId);
      setChannels(prev => prev.map(channel => 
        channel.id === channelId 
          ? { ...channel, followers: [] }
          : channel
      ));
    } catch (error) {
      console.error('Failed to unfollow channel:', error);
    }
  };

  return (
    <Container 
      maxWidth={isDesktop ? "lg" : "sm"} 
      sx={{ 
        mt: 3,
        px: { xs: 2, sm: 3 }
      }}
    >
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          mb: 5,
          fontSize: { xs: '1.5rem', sm: '2rem' }
        }}
      >
        Popular Channels
      </Typography>
      <InfiniteScroll
        dataLength={channels.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <Stack spacing={3} sx={{ mt: 4 }}>
            {[...Array(2)].map((_, index) => (
              <Box 
                key={`loading-${index}`}
                sx={{
                  height: 200,
                  backgroundColor: 'grey.100',
                  borderRadius: 2
                }}
              />
            ))}
          </Stack>
        }
        endMessage={
          <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
            <Typography color="text.secondary">
              No more channels to display
            </Typography>
          </Box>
        }
      >
        <Stack spacing={4}>
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

export default Channels;
