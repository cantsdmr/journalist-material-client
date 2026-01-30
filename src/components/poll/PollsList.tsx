import React, { useEffect, useState } from 'react';
import { Stack, Box, alpha, Grid, IconButton, Typography, Chip, useTheme, CircularProgress } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Poll } from '@/types/index';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';
import PollCard from '@/components/poll/PollCard';
import { EmptyState } from '@/components/common/EmptyState';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useNotification } from '@/contexts/NotificationContext';

interface PollsListProps {
  filters?: any;
  emptyTitle?: string;
  emptyDescription?: string;
  itemsPerPage?: number;
  mode?: 'grid' | 'scroll';
}

const PollSkeleton = ({ count = 2 }: { count?: number }) => (
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
        <Box sx={{ height: 24, width: '40%', mb: 2, borderRadius: 0.5, bgcolor: 'grey.300' }} />
        <Stack spacing={2}>
          {[...Array(4)].map((_, i) => (
            <Box
              key={i}
              sx={{
                height: 40,
                borderRadius: 1,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.common.white, 0.1)
                    : alpha(theme.palette.common.black, 0.1)
              }}
            />
          ))}
        </Stack>
      </Box>
    ))}
  </Stack>
);

const PollsList: React.FC<PollsListProps> = ({
  filters = {},
  emptyTitle = 'No polls found',
  emptyDescription = 'No polls available at the moment',
  itemsPerPage = 10,
  mode = 'scroll'
}) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [bookmarkStates, setBookmarkStates] = useState<Record<string, boolean>>({});
  const [bookmarkLoading, setBookmarkLoading] = useState<Record<string, boolean>>({});
  const { api } = useApiContext();
  const { execute } = useApiCall();
  const { execute: executeBookmark } = useApiCall();
  const { showNotification } = useNotification();
  const theme = useTheme();

  const fetchPolls = async (_page: number = page) => {
    try {
      setLoading(true);

      const response = await execute(
        () => api?.app.poll.getPolls(filters, { page: _page, limit: itemsPerPage }),
        { showErrorToast: true }
      );

      if (response) {
        if (_page === 1) {
          setPolls(response.items);
        } else {
          setPolls(prev => [...prev, ...response.items]);
        }
        setPage(response.metadata.currentPage);
        setHasMore(response.metadata.hasNext === true);

        // Initialize bookmark states from poll data
        const newBookmarkStates: Record<string, boolean> = {};
        response.items.forEach(poll => {
          newBookmarkStates[String(poll.id)] = poll.isBookmarked || false;
        });
        setBookmarkStates(prev => ({ ...prev, ...newBookmarkStates }));
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = async (pollId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (bookmarkLoading[pollId]) return;

    const previousState = bookmarkStates[pollId] || false;
    setBookmarkStates(prev => ({ ...prev, [pollId]: !previousState }));
    setBookmarkLoading(prev => ({ ...prev, [pollId]: true }));

    try {
      if (previousState) {
        await executeBookmark(
          () => api.app.bookmark.unbookmarkPoll(pollId),
          { showErrorToast: true }
        );
        showNotification('Bookmark removed', 'success');
      } else {
        await executeBookmark(
          () => api.app.bookmark.bookmarkPoll(pollId),
          { showErrorToast: true }
        );
        showNotification('Poll bookmarked', 'success');
      }
    } catch (error) {
      setBookmarkStates(prev => ({ ...prev, [pollId]: previousState }));
      showNotification('Failed to update bookmark', 'error');
    } finally {
      setBookmarkLoading(prev => ({ ...prev, [pollId]: false }));
    }
  };

  useEffect(() => {
    setPolls([]); // Clear polls when filters change
    setPage(1);
    fetchPolls(1);
  }, [JSON.stringify(filters)]); // Watch for filter changes

  const fetchMoreData = () => {
    if (!loading && hasMore) {
      fetchPolls(page + 1);
    }
  };

  if (polls.length === 0 && !loading) {
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
        <InfiniteScroll
          dataLength={polls.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<Box />}
        >
          <Grid container spacing={3}>
            {polls.map((poll) => (
              <Grid item xs={12} sm={6} md={4} key={poll.id}>
                <PollCard poll={poll} showAsPreview={true} mode="grid" />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      </Box>
    );
  }

  // Scroll mode - single column centered layout like news
  return (
    <Box
      id="polls-scroll-container"
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
        {loading && polls.length === 0 ? (
          <PollSkeleton />
        ) : (
          <InfiniteScroll
            dataLength={polls.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<Box />}
            scrollableTarget="polls-scroll-container"
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
                No more polls to display
              </Box>
            }
            style={{ overflow: 'visible', paddingBottom: '64px' }}
          >
            {polls.map((poll) => {
              const totalVotes = poll.stats?.totalVotes || 0;

              return (
                <Box
                  key={poll.id}
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
                  <PollCard poll={poll} showAsPreview={true} mode="scroll" />

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
                    {/* Trending Badge */}
                    {poll.isTrending && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Chip
                          icon={<TrendingUpIcon sx={{ fontSize: '0.875rem' }} />}
                          label="Trending"
                          size="small"
                          sx={{
                            height: 28,
                            bgcolor: alpha(theme.palette.error.main, 0.9),
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                          }}
                        />
                      </Box>
                    )}

                    {/* Vote Button */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <IconButton
                        className="action-button"
                        size="medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle vote
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
                            bgcolor: alpha(theme.palette.primary.main, 0.8),
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease',
                          width: 48,
                          height: 48
                        }}
                      >
                        <ThumbUpIcon sx={{ fontSize: '1.5rem' }} />
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
                        {totalVotes > 999 ? `${(totalVotes / 1000).toFixed(1)}K` : totalVotes}
                      </Typography>
                    </Box>

                    {/* Bookmark Button */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <IconButton
                        className="action-button"
                        size="medium"
                        onClick={(e) => handleBookmarkToggle(String(poll.id), e)}
                        disabled={bookmarkLoading[String(poll.id)]}
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
                            bgcolor: alpha(theme.palette.primary.main, 0.8),
                            transform: 'scale(1.1)'
                          },
                          '&:disabled': {
                            bgcolor: theme.palette.mode === 'dark'
                              ? alpha('#fff', 0.1)
                              : alpha('#000', 0.4)
                          },
                          transition: 'all 0.2s ease',
                          width: 48,
                          height: 48
                        }}
                      >
                        {bookmarkLoading[String(poll.id)] ? (
                          <CircularProgress size={20} sx={{ color: 'white' }} />
                        ) : bookmarkStates[String(poll.id)] ? (
                          <BookmarkIcon sx={{ fontSize: '1.5rem', color: theme.palette.primary.light }} />
                        ) : (
                          <BookmarkBorderIcon sx={{ fontSize: '1.5rem' }} />
                        )}
                      </IconButton>
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
                        {poll.stats?.viewCount > 999
                          ? `${(poll.stats.viewCount / 1000).toFixed(1)}K`
                          : poll.stats?.viewCount || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </InfiniteScroll>
        )}
      </Box>
    </Box>
  );
};

export default PollsList;
