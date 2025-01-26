import React, { useEffect, useState } from 'react';
import { 
  Box,
  Container,
  Typography,
  Grid,
  Skeleton
} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useApiContext } from '@/contexts/ApiContext';
import { alpha } from '@mui/material/styles';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constants/paths';
import StudioChannelCard from '@/components/studio/channel/StudioChannelCard';
import { useUserInfo } from '@/hooks/useUserInfo';
import { ChannelUser } from '@/APIs/UserAPI';
import { EmptyState } from '@/components/common/EmptyState';

const ListChannelsStudio: React.FC = () => {
  const [userChannels, setUserChannels] = useState<ChannelUser[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const { api } = useApiContext();
  const { userInfo } = useUserInfo();
  const navigate = useNavigate();


  const fetchMoreData = () => {
    getChannels(page + 1);
  };

  const getChannels = async (_page: number = page) => {
    try {
      if (!userInfo?.id) {
        return;
      }

      const result = await api?.userApi.getUserChannels(userInfo.id);
      
      if (_page === 1) {
        setUserChannels(result?.items ?? []);
      } else {
        setUserChannels(prev => [...prev, ...(result?.items ?? [])]);
      }
      
      setPage(result?.metadata.currentPage ?? 1);
      setLimit(result?.metadata.limit ?? 10);
      setHasMore(result?.metadata.hasNext === true);
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getChannels(page);
  }, []);

  const ChannelSkeleton = () => (
    <Box 
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: theme =>
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.05)
            : alpha(theme.palette.common.black, 0.03),
        height: 200
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
        <Box sx={{ width: '100%' }}>
          <Skeleton width="60%" height={24} />
          <Skeleton width="40%" height={20} />
        </Box>
      </Box>
      <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
      <Box sx={{ mt: 2 }}>
        <Skeleton width="30%" height={24} />
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {isLoading ? <Skeleton width={200} /> : 'My Channels'}
        </Typography>
      </Box>

      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((index) => (
            <Grid item xs={12} md={6} key={index}>
              <ChannelSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : userChannels.length === 0 ? (
        <EmptyState
          title="No Channels Yet"
          description="Create your first channel to start publishing news and connecting with subscribers."
          icon={<AddToQueueIcon sx={{ fontSize: 48 }} />}
          action={{
            label: "Create Channel",
            onClick: () => navigate(PATHS.STUDIO_CHANNEL_CREATE)
          }}
        />
      ) : (
        <InfiniteScroll
          dataLength={userChannels.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {[...Array(2)].map((_, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <ChannelSkeleton />
                </Grid>
              ))}
            </Grid>
          }
        >
          <Grid container spacing={3}>
            {userChannels.map((userChannel) => (
              <Grid item xs={12} md={6} key={userChannel.id}>
                <StudioChannelCard 
                  channel={userChannel.channel}
                  onRefresh={() => getChannels(1)}
                />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      )}
    </Container>
  );
};

export default ListChannelsStudio;
