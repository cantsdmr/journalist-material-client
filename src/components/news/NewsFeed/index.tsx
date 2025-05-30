import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Skeleton,
  Box,
  Typography
} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { News } from '@/APIs/NewsAPI';
import { useApiContext } from '@/contexts/ApiContext';
import NewsEntry from '@/components/news/NewsEntry';
import { useApiCall } from '@/hooks/useApiCall';

interface NewsFeedProps {
  selectedTag: string;
  isSubscribed?: boolean;
}

const NewsFeed: React.FC<NewsFeedProps> = ({ selectedTag, isSubscribed = false }) => {
  const [allNews, setAllNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { api } = useApiContext();
  const { execute } = useApiCall();

  const fetchMoreData = () => {
    getNews(page + 1);
  };

  const getNews = async (_page: number = page) => {
    let newsResult;
    
    if (isSubscribed) {
      newsResult = await execute(
        () => api?.newsApi.getFollowed({ page: _page, limit: limit }),
        { showErrorToast: true }
      );
    } else {
      newsResult = await execute(
        () => api?.newsApi.getTrending({ page: _page, limit: limit }),
        { showErrorToast: true }
      );
    }
    
    if (newsResult) {
      if (_page === 1) {
        setAllNews(newsResult?.items ?? []);
      } else {
        setAllNews(prev => [...prev, ...(newsResult?.items ?? [])]);
      }
      
      setPage(newsResult?.metadata.currentPage ?? 1);
      setLimit(newsResult?.metadata.limit ?? 10);
      setHasMore(newsResult?.metadata.hasNext === true);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    getNews(1);
  }, [api?.newsApi, selectedTag]);

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[...Array(12)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card>
              <Skeleton variant="rectangular" height={140} />
              <CardContent>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <InfiniteScroll
      dataLength={allNews.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={
        <Grid container spacing={3}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`loading-${index}`}>
              <Card>
                <Skeleton variant="rectangular" height={140} />
                <CardContent>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      }
      endMessage={
        <Box sx={{ textAlign: 'center', mt: 2, mb: 2 }}>
          <Typography color="text.secondary">
            No more news to display
          </Typography>
        </Box>
      }
    >
      <Grid container spacing={2}>
        {allNews.map((news) => (
          <NewsEntry key={news.id} news={news} />
        ))}
      </Grid>
    </InfiniteScroll>
  );
};

export default NewsFeed;