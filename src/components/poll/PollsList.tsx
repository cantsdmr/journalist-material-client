import React, { useEffect, useState } from 'react';
import { Stack, Box, alpha } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Poll } from '@/types/index';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';
import PollCard from '@/components/poll/PollCard';
import { EmptyState } from '@/components/common/EmptyState';
import { PATHS } from '@/constants/paths';

interface PollsListProps {
  filters?: any;
  emptyTitle?: string;
  emptyDescription?: string;
  itemsPerPage?: number;
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
  itemsPerPage = 10
}) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { api } = useApiContext();
  const { execute } = useApiCall();

  const fetchPolls = async (_page: number = page) => {
    try {
      setLoading(true);

      const response = await execute(
        () => api?.pollApi.getPolls(filters, { page: _page, limit: itemsPerPage }),
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
      }
    } finally {
      setLoading(false);
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

  return (
    <Box sx={{ width: '100%' }}>
      {loading && polls.length === 0 ? (
        <PollSkeleton />
      ) : (
        <InfiniteScroll
          dataLength={polls.length}
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
              No more polls to display
            </Box>
          }
        >
          <Stack spacing={2.5}>
            {polls.map((poll) => (
              <Box
                key={poll.id}
                component={RouterLink}
                to={PATHS.APP_POLL_VIEW.replace(':id', poll.id)}
                sx={{ textDecoration: 'none' }}
              >
                <PollCard poll={poll} />
              </Box>
            ))}
          </Stack>
        </InfiniteScroll>
      )}
    </Box>
  );
};

export default PollsList;
