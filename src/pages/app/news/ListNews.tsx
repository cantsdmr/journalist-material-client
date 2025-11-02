import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { NewsFilters } from '@/types/index';
import { useLocation, useNavigate } from 'react-router-dom';
import NewsList from '@/components/news/NewsList';

interface ListNewsProps {
  filters?: NewsFilters;
  title?: string;
  description?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  showSearch?: boolean;
  mode?: 'grid' | 'scroll';
}

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
  emptyTitle: customEmptyTitle,
  emptyDescription: customEmptyDescription,
  showSearch = false,
  mode = 'scroll'
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Extract query from URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get('q');

    if (queryParam) {
      const decodedQuery = decodeURIComponent(queryParam);
      setSearchQuery(decodedQuery);
      setSearchInput(decodedQuery);
    }
  }, [location.search]);

  // Get default content based on filters, but allow custom overrides
  const defaultContent = getDefaultContent(filters);
  const displayEmptyTitle = customEmptyTitle || defaultContent.emptyTitle;
  const displayEmptyDescription = customEmptyDescription || defaultContent.emptyDescription;

  // Combine filters with search query
  const effectiveFilters = {
    ...filters,
    query: searchQuery || undefined
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchInput.trim();
    setSearchQuery(trimmedQuery);

    // Update URL with search query
    const searchParams = new URLSearchParams(location.search);
    if (trimmedQuery) {
      searchParams.set('q', encodeURIComponent(trimmedQuery));
    } else {
      searchParams.delete('q');
    }

    const newPath = `${location.pathname}?${searchParams.toString()}`;
    navigate(newPath, { replace: true });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');

    // Remove query from URL
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('q');

    const newPath = `${location.pathname}?${searchParams.toString()}`;
    navigate(newPath, { replace: true });
  };

  return (
    <Box sx={{
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      ...(mode === 'scroll' && {
        position: 'fixed',
        top: 64,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
        zIndex: 1
      })
    }}>
      {/* Search Bar - Only show if enabled */}
      {showSearch && mode === 'grid' && (
        <Box sx={{ flexShrink: 0, mb: 2 }}>
          <form onSubmit={handleSearchSubmit}>
            <TextField
              fullWidth
              placeholder="Search news by title or content..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchInput && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                }
              }}
            />
          </form>
        </Box>
      )}

      {/* News List */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <NewsList
          filters={effectiveFilters}
          emptyTitle={displayEmptyTitle}
          emptyDescription={displayEmptyDescription}
          mode={mode}
        />
      </Box>
    </Box>
  );
};

export default ListNews;