import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Stack,
  Box,
} from '@mui/material';
import { News, NewsFilters } from '@/types/index';
import { useApiContext } from '@/contexts/ApiContext';
import NewsEntry from '@/components/news/NewsEntry';
import InfiniteScroll from 'react-infinite-scroll-component';
import { EmptyState } from '@/components/common/EmptyState';
import { alpha } from '@mui/material/styles';
import { useApiCall } from '@/hooks/useApiCall';
import TagFilter from '@/components/filters/TagFilter';
import { useLocation, useNavigate } from 'react-router-dom';

interface ListNewsProps {
  filters?: NewsFilters;
  title?: string;
  description?: string;
  emptyTitle?: string;
  emptyDescription?: string;
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

// Helper function to generate default content based on filters
const getDefaultContent = (filters: NewsFilters = {}) => {
  if (filters.feed) {
    return {
      title: 'Your Feed',
      description: 'Latest news from your personalized feed',
      emptyTitle: 'Your feed is empty',
      emptyDescription: 'Follow some journalists to see their latest news here'
    };
  }
  
  if (filters.trending) {
    return {
      title: 'Trending News',
      description: 'Discover the most popular news from our community',
      emptyTitle: 'No trending news',
      emptyDescription: 'There are no trending news articles at the moment'
    };
  }
  
  if (filters.subscribed) {
    return {
      title: 'Subscribed Channels',
      description: 'Latest news from your subscribed channels',
      emptyTitle: 'No news from subscriptions',
      emptyDescription: 'Subscribe to channels to see their latest news here'
    };
  }
  
  if (filters.premium) {
    return {
      title: 'Premium News',
      description: 'Exclusive premium content',
      emptyTitle: 'No premium news',
      emptyDescription: 'No premium news articles available at the moment'
    };
  }
  
  if (filters.channel) {
    return {
      title: 'Channel News',
      description: 'News from this channel',
      emptyTitle: 'No news in this channel',
      emptyDescription: 'This channel has not published any news yet'
    };
  }
  
  if (filters.creator) {
    return {
      title: 'Creator News',
      description: 'News from this creator',
      emptyTitle: 'No news from this creator',
      emptyDescription: 'This creator has not published any news yet'
    };
  }
  
  if (filters.tags && filters.tags.length > 0) {
    const tagText = filters.tags.length === 1 ? 'tag' : 'tags';
    return {
      title: `News by ${tagText.charAt(0).toUpperCase() + tagText.slice(1)}`,
      description: `News tagged with: ${filters.tags.join(', ')}`,
      emptyTitle: `No news with these ${tagText}`,
      emptyDescription: `No news articles found with the selected ${tagText}`
    };
  }
  
  // Default fallback
  return {
    title: 'All News',
    description: 'Latest news from our community',
    emptyTitle: 'No news found',
    emptyDescription: 'No news articles available at the moment'
  };
};

const ListNews: React.FC<ListNewsProps> = ({ 
  filters = {}, 
  title: customTitle,
  description: customDescription,
  emptyTitle: customEmptyTitle,
  emptyDescription: customEmptyDescription
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
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
    } else if (filters.tags) {
      setSelectedTags(filters.tags);
    }
  }, [location.search, filters.tags]);

  const ITEMS_PER_PAGE = 12;
  
  // Get default content based on filters, but allow custom overrides
  const defaultContent = getDefaultContent(filters);
  const displayTitle = customTitle || defaultContent.title;
  const displayDescription = customDescription || defaultContent.description;
  const displayEmptyTitle = customEmptyTitle || defaultContent.emptyTitle;
  const displayEmptyDescription = customEmptyDescription || defaultContent.emptyDescription;

  // Combine filters with selected tags
  const effectiveFilters = {
    ...filters,
    tags: selectedTags.length > 0 ? selectedTags : filters.tags
  };

  const fetchNews = async (_page: number = page) => {
    setLoading(true);
    
    const response = await execute(
      () => api?.newsApi.getNews(
        effectiveFilters,
        { 
          page: _page,
          limit: ITEMS_PER_PAGE
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
    
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    fetchNews(1);
  }, [JSON.stringify(effectiveFilters)]); // Watch for filter changes including tags

  const fetchMoreData = () => {
    if (!loading && hasMore) {
      fetchNews(page + 1);
    }
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {displayTitle}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {displayDescription}
        </Typography>
      </Box>

      {/* Tag Filter Component */}
      <Box sx={{ mb: 4 }}>
        <TagFilter
          selectedTags={selectedTags}
          onTagsChange={handleTagsChange}
          contentType="news"
          maxTags={5}
          showCounts={true}
        />
      </Box>

      {news.length === 0 && !loading ? (
        <EmptyState
          title={displayEmptyTitle}
          description={displayEmptyDescription}
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