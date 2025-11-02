import React, { useEffect, useState } from 'react';
import { Stack, Box, alpha, Grid, IconButton, Typography, Chip, useTheme } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { News, NewsFilters } from '@/types/index';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';
import NewsEntry from '@/components/news/NewsEntry';
import { EmptyState } from '@/components/common/EmptyState';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VerifiedIcon from '@mui/icons-material/Verified';

interface NewsListProps {
  filters?: NewsFilters;
  emptyTitle?: string;
  emptyDescription?: string;
  itemsPerPage?: number;
  mode?: 'grid' | 'scroll'; // grid: traditional grid layout, scroll: TikTok-style vertical scroll
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
  itemsPerPage = 12,
  mode = 'scroll' // default to TikTok-style scroll
}) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { api } = useApiContext();
  const { execute } = useApiCall();
  const theme = useTheme();

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

  // Grid mode - traditional grid layout
  if (mode === 'grid') {
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
                py: 4,
                color: 'text.secondary',
                fontSize: '0.875rem'
              }}>
                No more news to display
              </Box>
            }
          >
            <Grid container spacing={3}>
              {news.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <NewsEntry news={item} mode="grid" />
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
        )}
      </Box>
    );
  }

  // Scroll mode - TikTok-style vertical scroll (default)
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        px: { xs: 2, sm: 0 }
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 480 }}>
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
                py: 4,
                color: 'text.secondary',
                fontSize: '0.875rem',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                No more news to display
              </Box>
            }
            style={{ overflow: 'visible', paddingBottom: '64px' }}
          >
            {news.map((item) => (
              <Box
                key={item.id}
                sx={{
                  position: 'relative',
                  scrollSnapAlign: 'start',
                  scrollSnapStop: 'always',
                  height: 'calc(100vh - 64px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <NewsEntry news={item} />

                {/* Right Side Action Bar - Outside the card on desktop, inside on mobile */}
                <Box
                  sx={{
                    position: 'absolute',
                    right: { xs: 8, sm: -60 },
                    bottom: '5vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2.5,
                    zIndex: 10
                  }}
                >
                  {/* Quality Score Badge */}
                  {item.qualityMetrics?.overallQualityScore && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Chip
                        icon={<VerifiedIcon sx={{ fontSize: '0.875rem' }} />}
                        label={item.qualityMetrics.overallQualityScore.toFixed(1)}
                        size="small"
                        sx={{
                          height: 28,
                          bgcolor: alpha(theme.palette.success.main, 0.9),
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                        }}
                      />
                    </Box>
                  )}

                  {/* Favorite Button */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <IconButton
                      className="action-button"
                      size="medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle like
                      }}
                      sx={{
                        bgcolor: theme.palette.mode === 'dark'
                          ? alpha('#fff', 0.2)
                          : alpha('#000', 0.6),
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 2px 8px rgba(0,0,0,0.3)'
                          : '0 2px 8px rgba(0,0,0,0.5)',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.error.main, 0.8),
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease',
                        width: 48,
                        height: 48
                      }}
                    >
                      <FavoriteIcon sx={{ fontSize: '1.5rem' }} />
                    </IconButton>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        mt: 0.5,
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                      }}
                    >
                      {/* Like count would go here */}
                    </Typography>
                  </Box>

                  {/* Share Button */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <IconButton
                      className="action-button"
                      size="medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle share
                      }}
                      sx={{
                        bgcolor: theme.palette.mode === 'dark'
                          ? alpha('#fff', 0.2)
                          : alpha('#000', 0.6),
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 2px 8px rgba(0,0,0,0.3)'
                          : '0 2px 8px rgba(0,0,0,0.5)',
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark'
                            ? alpha('#fff', 0.3)
                            : alpha('#000', 0.7),
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease',
                        width: 48,
                        height: 48
                      }}
                    >
                      <ShareIcon sx={{ fontSize: '1.5rem' }} />
                    </IconButton>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        mt: 0.5,
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                      }}
                    >
                      {/* Share count would go here */}
                    </Typography>
                  </Box>

                  {/* View Count */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box
                      sx={{
                        bgcolor: theme.palette.mode === 'dark'
                          ? alpha('#fff', 0.2)
                          : alpha('#000', 0.6),
                        backdropFilter: 'blur(10px)',
                        borderRadius: '50%',
                        width: 48,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 2px 8px rgba(0,0,0,0.3)'
                          : '0 2px 8px rgba(0,0,0,0.5)'
                      }}
                    >
                      <VisibilityIcon
                        sx={{
                          fontSize: '1.5rem',
                          color: 'white',
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
                        }}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        mt: 0.5,
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                      }}
                    >
                      12K
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </InfiniteScroll>
        )}
      </Box>
    </Box>
  );
};

export default NewsList;
