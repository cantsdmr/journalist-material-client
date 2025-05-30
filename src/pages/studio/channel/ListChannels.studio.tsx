import React, { useEffect, useState } from 'react';
import { 
  Box,
  Typography,
  Grid,
  Skeleton,
  useTheme
} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useApiContext } from '@/contexts/ApiContext';
import { alpha } from '@mui/material/styles';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constants/paths';
import StudioChannelCard from '@/components/studio/channel/StudioChannelCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Channel } from '@/APIs/ChannelAPI';
import { useApiCall } from '@/hooks/useApiCall';

const ListChannelsStudio: React.FC = () => {
  const [userChannels, setUserChannels] = useState<Channel[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const { api } = useApiContext();
  const navigate = useNavigate();
  const theme = useTheme();
  const { execute } = useApiCall();

  const fetchMoreData = () => {
    getChannels(page + 1);
  };

  const getChannels = async (_page: number = page) => {
    const result = await execute(
      () => api?.accountApi.getUserChannels(),
      { showErrorToast: true }
    );
    
    if (result) {
      setUserChannels(prev => _page === 1 
        ? result?.items ?? [] 
        : [...prev, ...(result?.items ?? [])]
      );
      
      setPage(result?.metadata.currentPage ?? 1);
      setHasMore(result?.metadata.hasNext === true);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    getChannels(1);
  }, []);

  const ChannelSkeleton = () => (
    <Box 
      sx={{
        p: 2,
        borderRadius: 1,
        bgcolor: theme => alpha(
          theme.palette.mode === 'dark' 
            ? theme.palette.common.white 
            : theme.palette.common.black,
          theme.palette.mode === 'dark' ? 0.05 : 0.03
        ),
        height: { xs: 180, sm: 200 },
        transition: theme.transitions.create(['background-color', 'height'])
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1.5 }} />
        <Box sx={{ width: '100%' }}>
          <Skeleton width="60%" height={20} />
          <Skeleton width="40%" height={16} />
        </Box>
      </Box>
      <Skeleton 
        variant="rectangular" 
        sx={{ 
          borderRadius: 1,
          height: { xs: 70, sm: 80 }
        }} 
      />
      <Box sx={{ mt: 1.5 }}>
        <Skeleton width="30%" height={20} />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      px: { xs: 2, sm: 3, md: 4 },
      py: { xs: 2, sm: 3 },
      maxWidth: 'lg',
      mx: 'auto',
      width: '100%'
    }}>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}
        >
          {isLoading ? <Skeleton width={150} /> : 'My Channels'}
        </Typography>
      </Box>

      {isLoading ? (
        <Grid container spacing={2}>
          {[1, 2].map((index) => (
            <Grid item xs={12} sm={6} key={index}>
              <ChannelSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : userChannels.length === 0 ? (
        <EmptyState
          title="No Channels Yet"
          description="Create your first channel to start publishing news and connecting with subscribers."
          icon={<AddToQueueIcon sx={{ fontSize: { xs: 40, sm: 48 } }} />}
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
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {[1, 2].map((index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <ChannelSkeleton />
                </Grid>
              ))}
            </Grid>
          }
        >
          <Grid container spacing={2}>
            {userChannels.map((userChannel) => (
              <Grid item xs={12} sm={6} key={userChannel.id}>
                <StudioChannelCard 
                  channel={userChannel}
                  onRefresh={() => getChannels(1)}
                />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      )}
    </Box>
  );
};

export default ListChannelsStudio;
