import React, { useEffect, useState } from 'react';
import { 
  Box,
  Typography,
  Grid,
  Skeleton,
  useTheme
} from '@mui/material';
import { News } from '@/types/index';
import { useApiContext } from '@/contexts/ApiContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import { EmptyState } from '@/components/common/EmptyState';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileContext';
import { PATHS } from '@/constants/paths';
import { useApiCall } from '@/hooks/useApiCall';
import StudioNewsCard from '@/components/studio/news/StudioNewsCard';
import { alpha } from '@mui/material/styles';

const ListNewsStudio: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const { api } = useApiContext();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { execute } = useApiCall();
  const theme = useTheme();

  const fetchMoreData = () => {
    getNews(page + 1);
  };

  const getNews = async (_page: number = page) => {
    if (!profile) return;
    
    const result = await execute(
      () => api?.app.news.getCreatorNews(profile.id, { page: _page, limit: 12 }),
      { showErrorToast: true }
    );
    
    if (result) {
      setNews(prev => _page === 1 
        ? result?.items ?? [] 
        : [...prev, ...(result?.items ?? [])]
      );
      
      setPage(result?.metadata.currentPage ?? 1);
      setHasMore(result?.metadata.hasNext === true);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    if (profile) {
      getNews(1);
    }
  }, [profile]);

  const NewsSkeleton = () => (
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
        height: { xs: 280, sm: 320 },
        transition: theme.transitions.create(['background-color', 'height'])
      }}
    >
      <Skeleton 
        variant="rectangular" 
        sx={{ 
          borderRadius: 1,
          height: { xs: 120, sm: 140 },
          mb: 2
        }} 
      />
      <Box sx={{ p: 1 }}>
        <Skeleton width="90%" height={24} sx={{ mb: 1 }} />
        <Skeleton width="60%" height={16} sx={{ mb: 1 }} />
        <Skeleton width="95%" height={20} sx={{ mb: 1 }} />
        <Skeleton width="80%" height={20} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton width="25%" height={24} />
          <Skeleton width="30%" height={24} />
          <Skeleton width="20%" height={24} />
        </Box>
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
          {isLoading ? <Skeleton width={150} /> : 'My News'}
        </Typography>
      </Box>

      {isLoading ? (
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <NewsSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : news.length === 0 ? (
        <EmptyState
          title="No News Yet"
          description="Start creating your first news article to share with your subscribers."
          icon={<PostAddIcon sx={{ fontSize: { xs: 40, sm: 48 } }} />}
          action={{
            label: "Create News",
            onClick: () => navigate(PATHS.STUDIO_NEWS_CREATE)
          }}
        />
      ) : (
        <InfiniteScroll
          dataLength={news.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              {[1, 2, 3].map((index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <NewsSkeleton />
                </Grid>
              ))}
            </Grid>
          }
        >
          <Grid container spacing={2}>
            {news.map((newsItem) => (
              <Grid item xs={12} sm={6} md={4} key={newsItem.id}>
                <StudioNewsCard 
                  news={newsItem}
                  onRefresh={() => getNews(1)}
                />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      )}
    </Box>
  );
};

export default ListNewsStudio;