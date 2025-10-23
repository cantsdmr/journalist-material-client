import React, { useEffect, useState } from 'react';
import { Stack, Box, alpha } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { News, NewsFilters } from '@/types/index';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';
import NewsEntry from '@/components/news/NewsEntry';
import { EmptyState } from '@/components/common/EmptyState';

interface NewsListProps {
  filters?: NewsFilters;
  emptyTitle?: string;
  emptyDescription?: string;
  itemsPerPage?: number;
}

const NewsSkeleton = ({ count = 2 }: { count?: number }) => (
  <Stack spacing={2} sx={{ mt: 2 }}>
    {[...Array(count)].map((_, index) => (
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

const NewsList: React.FC<NewsListProps> = ({
  filters = {},
  emptyTitle = 'No news found',
  emptyDescription = 'No news articles available at the moment',
  itemsPerPage = 12
}) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { api } = useApiContext();
  const { execute } = useApiCall();

  const fetchNews = async (_page: number = page) => {
    try {
      setLoading(true);

      const response = await execute(
        () => api?.newsApi.getNews(
          filters,
          {
            page: _page,
            limit: itemsPerPage
          }
        ),
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setNews([]); // Clear news when filters change
    setPage(1);
    fetchNews(1);
  }, [JSON.stringify(filters)]); // Watch for filter changes

  const fetchMoreData = () => {
    if (!loading && hasMore) {
      fetchNews(page + 1);
    }
  };

  if (news.length === 0 && !loading) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {loading && news.length === 0 ? (
        <NewsSkeleton />
      ) : (
        <InfiniteScroll
          dataLength={news.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<Box />}
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
          <Stack spacing={2.5}>
            {news.map((item) => (
              <NewsEntry
                key={item.id}
                news={item}
              />
            ))}
          </Stack>
        </InfiniteScroll>
      )}
    </Box>
  );
};

export default NewsList;
