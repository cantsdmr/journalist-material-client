import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { NewsFilters } from '@/types/index';
import TagFilter from '@/components/filters/TagFilter';
import { useLocation, useNavigate } from 'react-router-dom';
import NewsList from '@/components/news/NewsList';

interface ListNewsProps {
  filters?: NewsFilters;
  title?: string;
  description?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  showSearch?: boolean;
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
  title: customTitle,
  description: customDescription,
  emptyTitle: customEmptyTitle,
  emptyDescription: customEmptyDescription,
  showSearch = false
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Extract tags and query from URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tagsParam = searchParams.get('tags');
    const queryParam = searchParams.get('q');

    if (tagsParam) {
      const urlTags = tagsParam.split(',').map(tag => decodeURIComponent(tag.trim()));
      setSelectedTags(urlTags);
    } else if (filters.tags) {
      setSelectedTags(filters.tags);
    }

    if (queryParam) {
      const decodedQuery = decodeURIComponent(queryParam);
      setSearchQuery(decodedQuery);
      setSearchInput(decodedQuery);
    }
  }, [location.search, filters.tags]);

  // Get default content based on filters, but allow custom overrides
  const defaultContent = getDefaultContent(filters);
  const displayTitle = customTitle || defaultContent.title;
  const displayDescription = customDescription || defaultContent.description;
  const displayEmptyTitle = customEmptyTitle || defaultContent.emptyTitle;
  const displayEmptyDescription = customEmptyDescription || defaultContent.emptyDescription;

  // Combine filters with selected tags and search query
  const effectiveFilters = {
    ...filters,
    tags: selectedTags.length > 0 ? selectedTags : filters.tags,
    query: searchQuery || undefined
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
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          {displayTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {displayDescription}
        </Typography>
      </Box>

      {/* Search Bar - Only show if enabled */}
      {showSearch && (
        <Box sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}>
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

      {/* Tag Filter Component */}
      <Box sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}>
        <TagFilter
          selectedTags={selectedTags}
          onTagsChange={handleTagsChange}
          contentType="news"
          maxTags={5}
          showCounts={false}
        />
      </Box>

      {/* News List */}
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <NewsList
          filters={effectiveFilters}
          emptyTitle={displayEmptyTitle}
          emptyDescription={displayEmptyDescription}
        />
      </Box>
    </Box>
  );
};

export default ListNews;