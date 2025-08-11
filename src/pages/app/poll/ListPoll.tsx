import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Tabs, Tab, Stack } from '@mui/material';
import PollCard from '@/components/poll/PollCard';
import { Poll } from '@/types/index';
import LoadingScreen from '@/components/common/LoadingScreen';
import { EmptyState } from '@/components/common/EmptyState';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { alpha } from '@mui/material/styles';
import { PATHS } from '@/constants/paths';
import TagFilter from '@/components/filters/TagFilter';

enum PollTab {
  ALL = 'all',
  TRENDING = 'trending',
  FUNDED = 'funded'
}

const ListPoll: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PollTab>(PollTab.ALL);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { api } = useApiContext();
  const { execute } = useApiCall();

  // Extract tags from URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tagsParam = searchParams.get('tags');
    
    if (tagsParam) {
      const urlTags = tagsParam.split(',').map(tag => decodeURIComponent(tag.trim()));
      setSelectedTags(urlTags);
    }
  }, [location.search]);

  const fetchPolls = async (_page: number = page) => {
    const filters: any = {};
    
    // Apply tab-based filters
    switch (activeTab) {
      case PollTab.TRENDING:
        filters.trending = true;
        break;
      case PollTab.FUNDED:
        filters.funded = true;
        break;
      default:
        break; // All polls
    }
    
    // Apply tag filters
    if (selectedTags.length > 0) {
      filters.tags = selectedTags;
    }

    const response = await execute(
      () => api.pollApi.getPolls(filters, { page: _page, limit }),
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
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchPolls(1);
  }, [activeTab, selectedTags]); // Refetch when tab or tags change

  const fetchMoreData = () => {
    fetchPolls(page + 1);
  };

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
    
    // Update URL with selected tags
    const searchParams = new URLSearchParams(location.search);
    if (tags.length > 0) {
      searchParams.set('tags', tags.map(tag => encodeURIComponent(tag)).join(','));
    } else {
      searchParams.delete('tags');
    }
    
    const newPath = `${location.pathname}?${searchParams.toString()}`;
    navigate(newPath, { replace: true });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Community Polls
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Vote on polls from your favorite journalists and help shape their content
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          aria-label="poll categories"
        >
          <Tab label="All Polls" value={PollTab.ALL} />
          <Tab label="Trending" value={PollTab.TRENDING} />
          <Tab label="Funded" value={PollTab.FUNDED} />
        </Tabs>
      </Box>

      {/* Tag Filter Component */}
      <Box sx={{ mb: 4 }}>
        <TagFilter
          selectedTags={selectedTags}
          onTagsChange={handleTagsChange}
          contentType="polls"
          maxTags={4}
          showCounts={true}
        />
      </Box>

      {polls.length === 0 ? (
        <EmptyState
          title="No polls found"
          description="There are no polls available in this category at the moment."
        />
      ) : (
        <InfiniteScroll
          dataLength={polls.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
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
          }
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
          <Stack spacing={2}>
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
    </Container>
  );
};

export default ListPoll; 