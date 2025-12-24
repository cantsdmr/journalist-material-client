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
import AddChartIcon from '@mui/icons-material/AddChart';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constants/paths';
import { useProfile } from '@/contexts/ProfileContext';
import { EmptyState } from '@/components/common/EmptyState';
import StudioPollCard from '@/components/studio/poll/StudioPollCard';
import { useApiCall } from '@/hooks/useApiCall';

const ListPollsStudio: React.FC = () => {
  const [polls, setPolls] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const { api } = useApiContext();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const theme = useTheme();
  const { execute } = useApiCall();

  const fetchMoreData = () => {
    getPolls(page + 1);
  };

  const getPolls = async (_page: number = page) => {
    if (!profile?.id) return;

    const result = await execute(
      () => api?.studio.getMyContent('polls'),
      { showErrorToast: true }
    );
    
    if (result) {
      setPolls(prev => _page === 1 
        ? result?.items ?? [] 
        : [...prev, ...(result?.items ?? [])]
      );
      
      setPage(result?.metadata.currentPage ?? 1);
      setHasMore(result?.metadata.hasNext === true);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    getPolls(1);
  }, []);

  const PollSkeleton = () => (
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
          {isLoading ? <Skeleton width={150} /> : 'My Polls'}
        </Typography>
      </Box>

      {isLoading ? (
        <Grid container spacing={2}>
          {[1, 2].map((index) => (
            <Grid item xs={12} sm={6} key={index}>
              <PollSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : polls.length === 0 ? (
        <EmptyState
          title="No Polls Yet"
          description="Create your first poll to start gathering opinions from your audience."
          icon={<AddChartIcon sx={{ fontSize: { xs: 40, sm: 48 } }} />}
          action={{
            label: "Create Poll",
            onClick: () => navigate(PATHS.STUDIO_POLL_CREATE)
          }}
        />
      ) : (
        <InfiniteScroll
          dataLength={polls.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {[1, 2].map((index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <PollSkeleton />
                </Grid>
              ))}
            </Grid>
          }
        >
          <Grid container spacing={2}>
            {polls.map((poll) => (
              <Grid item xs={12} sm={6} key={poll.id}>
                <StudioPollCard 
                  poll={poll}
                  onRefresh={() => getPolls(1)}
                />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      )}
    </Box>
  );
};

export default ListPollsStudio; 