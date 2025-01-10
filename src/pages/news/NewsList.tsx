import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Stack,
  Box,
  Skeleton,
  Card,
  CardContent
} from '@mui/material';
import { News } from '../../APIs/NewsAPI';
import { useApiContext } from '../../contexts/ApiContext';
import NewsEntry from '../../components/news/NewsEntry';
import InfiniteScroll from 'react-infinite-scroll-component';

interface NewsListProps {
  isSubscribed: boolean;
}

const NewsListSkeleton = () => (
  <Card sx={{ display: 'flex', alignItems: 'flex-start', p: 2 }}>
    <Skeleton 
      variant="rectangular" 
      width={150} 
      height={150} 
      sx={{ mr: 2 }} 
    />
    <Box sx={{ flex: 1 }}>
      <CardContent>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="85%" />
        <Skeleton variant="text" width="80%" />
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rounded" width={60} height={24} />
            <Skeleton variant="rounded" width={80} height={24} />
            <Skeleton variant="rounded" width={70} height={24} />
          </Stack>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Stack spacing={1}>
            <Skeleton variant="rounded" height={8} width="100%" />
            <Skeleton variant="rounded" height={8} width="90%" />
            <Skeleton variant="rounded" height={8} width="85%" />
          </Stack>
        </Box>
      </CardContent>
    </Box>
  </Card>
);

const NewsList: React.FC<NewsListProps> = ({ isSubscribed }) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { api } = useApiContext();

  const fetchNews = async (pageNum: number = page) => {
    try {
      setLoading(true);
      const response = isSubscribed 
        ? await api?.newsApi.getFollowed(pageNum)
        : await api?.newsApi.getMostPopular(pageNum);

      if (response) {
        if (pageNum === 1) {
          setNews(response.items);
        } else {
          setNews(prev => [...prev, ...response.items]);
        }
        setHasMore(response.metadata.hasNext);
        setPage(response.metadata.currentPage);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setNews([]);
    fetchNews(1);
  }, [isSubscribed, api?.newsApi]);

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
            <NewsListSkeleton key={index} />
          ))}
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        {isSubscribed ? 'Subscribed News' : 'Public News'}
      </Typography>
      
      <InfiniteScroll
        dataLength={news.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <Stack spacing={3} sx={{ my: 2 }}>
            {[1, 2].map((index) => (
              <NewsListSkeleton key={`loading-${index}`} />
            ))}
          </Stack>
        }
        endMessage={
          <Typography 
            textAlign="center" 
            color="text.secondary"
            sx={{ my: 2 }}
          >
            No more news to load
          </Typography>
        }
      >
        <Stack spacing={3}>
          {news.map((item) => (
            <NewsEntry 
              key={item.id} 
              news={item}
            />
          ))}
        </Stack>
      </InfiniteScroll>
    </Container>
  );
};

export default NewsList;