import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Stack,
  Box,
  Skeleton,
  Card,
} from '@mui/material';
import { News } from '@/APIs/NewsAPI';
import { useApiContext } from '@/contexts/ApiContext';
import NewsEntry from '@/components/news/NewsEntry';
import InfiniteScroll from 'react-infinite-scroll-component';
import { EmptyState } from '@/components/common/EmptyState';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileContext';
import { PATHS } from '@/constants/paths';
import { useApiCall } from '@/hooks/useApiCall';

interface ListNewsProps {
  isSubscribed: boolean;
  isCreator?: boolean;
}

const ListNewsSkeleton = () => (
  <Box sx={{ mb: 4 }}>
    {[1, 2, 3].map((index) => (
      <Box key={index} sx={{ mb: 10 }}>
        {/* Channel info skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, px: 0.5 }}>
          <Skeleton 
            variant="rounded" 
            width={28} 
            height={28} 
            sx={{ borderRadius: 1.5, mr: 1.5 }} 
          />
          <Skeleton width={120} height={20} />
        </Box>

        {/* News card skeleton */}
        <Card sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          <Skeleton 
            variant="rectangular" 
            sx={{ 
              width: { xs: '100%', sm: '360px' },
              minWidth: { sm: '360px' },
              height: { xs: '220px', sm: '200px' }
            }} 
          />
          <Box sx={{ p: 3, flex: 1 }}>
            <Skeleton width="90%" height={24} sx={{ mb: 2 }} />
            <Skeleton width="80%" height={24} sx={{ mb: 2 }} />
            <Skeleton width="95%" height={20} sx={{ mb: 1 }} />
            <Skeleton width="90%" height={20} sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Skeleton width={100} height={20} />
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    ))}
  </Box>
);

const ListNewsStudio: React.FC<ListNewsProps> = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { api } = useApiContext();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { execute } = useApiCall();

  const fetchNews = async (pageNum: number = page) => {
    if (!profile) return;
    
    setLoading(true);
    
    const response = await execute(
      () => api?.newsApi.getCreatorNews(profile.id, { page: pageNum, limit: 12 }),
      { showErrorToast: true }
    );

    if (response) {
      if (pageNum === 1) {
        setNews(response.items);
      } else {
        setNews(prev => [...prev, ...response.items]);
      }
      setHasMore(response.metadata.hasNext);
      setPage(response.metadata.currentPage);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchNews(page);
  }, []);

  const fetchMoreData = () => {
    if (!loading && hasMore) {
      fetchNews(page + 1);
    }
  };

  if (loading && news.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          <Skeleton width={200} />
        </Typography>
        <Stack spacing={3}>
          {[1, 2, 3].map((index) => (
            <ListNewsSkeleton key={index} />
          ))}
        </Stack>
      </Container>
    );
  }

  if (!loading && news.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <EmptyState
          title="No News Yet"
          description="Start creating your first news article to share with your subscribers."
          icon={<PostAddIcon sx={{ fontSize: 48 }} />}
          action={{
            label: "Create News",
            onClick: () => navigate(PATHS.STUDIO_NEWS_CREATE)
          }}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>      
      <InfiniteScroll
        dataLength={news.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<ListNewsSkeleton />}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            px: 1,
            mt: 6
          }}
        >
          {news.map((item) => (
            <NewsEntry 
              key={item.id} 
              news={item}
            />
          ))}
        </Box>
      </InfiniteScroll>
    </Container>
  );
};

export default ListNewsStudio;