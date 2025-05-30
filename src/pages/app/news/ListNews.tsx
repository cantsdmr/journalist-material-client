import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Stack,
  Box,
} from '@mui/material';
import { News } from '@/APIs/NewsAPI';
import { useApiContext } from '@/contexts/ApiContext';
import NewsEntry from '@/components/news/NewsEntry';
import InfiniteScroll from 'react-infinite-scroll-component';
import { EmptyState } from '@/components/common/EmptyState';
import { alpha } from '@mui/material/styles';
import { useApiCall } from '@/hooks/useApiCall';

interface ListNewsProps {
  isSubscribed: boolean;
  isCreator?: boolean;
}

const ListNewsSkeleton = () => (
  <Stack spacing={2} sx={{ mt: 2 }}>
    {[...Array(2)].map((_, index) => (
      <Box
        key={index}
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.white, 0.05)
              : alpha(theme.palette.common.black, 0.03)
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box 
            sx={{ 
              width: 32, 
              height: 32, 
              borderRadius: 1,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.1)
                  : alpha(theme.palette.common.black, 0.1),
              mr: 1
            }} 
          />
          <Box sx={{ height: 20, width: '30%', borderRadius: 0.5, bgcolor: 'grey.300' }} />
        </Box>
        <Box sx={{ height: 24, width: '60%', mb: 2, borderRadius: 0.5, bgcolor: 'grey.300' }} />
        <Box sx={{ height: 100, width: '100%', borderRadius: 1, bgcolor: 'grey.200', mb: 2 }} />
        <Box sx={{ height: 16, width: '40%', borderRadius: 0.5, bgcolor: 'grey.200' }} />
      </Box>
    ))}
  </Stack>
);

const ListNews: React.FC<ListNewsProps> = ({ isSubscribed }) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { api } = useApiContext();
  const { execute } = useApiCall();

  const fetchNews = async (_page: number = page) => {
    setLoading(true);
    
    const response = isSubscribed 
      ? await execute(
          () => api?.newsApi.getFollowed({ page: _page, limit: 12 }),
          { showErrorToast: true }
        )
      : await execute(
          () => api?.newsApi.getTrending({ page: _page, limit: 12 }),
          { showErrorToast: true }
        );

    if (response) {
      if (_page === 1) {
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
    setPage(1);
    fetchNews(1);
  }, [isSubscribed]);

  const fetchMoreData = () => {
    if (!loading && hasMore) {
      fetchNews(page + 1);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isSubscribed ? 'Your Feed' : 'Trending News'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isSubscribed 
            ? 'Latest news from journalists you follow'
            : 'Discover the most popular news from our community'
          }
        </Typography>
      </Box>

      {news.length === 0 && !loading ? (
        <EmptyState
          title={isSubscribed ? "Your feed is empty" : "No news found"}
          description={isSubscribed 
            ? "Follow some journalists to see their latest news here"
            : "There are no trending news articles at the moment"
          }
        />
      ) : (
        <InfiniteScroll
          dataLength={news.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<ListNewsSkeleton />}
          endMessage={
            <Box sx={{ 
              textAlign: 'center', 
              mt: 4, 
              color: 'text.secondary',
              fontSize: '0.875rem'
            }}>
              No more news to display
            </Box>
          }
        >
          <Stack spacing={4}>
            {news.map((item) => (
              <NewsEntry 
                key={item.id} 
                news={item}
              />
            ))}
          </Stack>
        </InfiniteScroll>
      )}
    </Container>
  );
};

export default ListNews;