import React, { useState, useEffect, useCallback } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Chip,
  InputAdornment,
  Paper,
  IconButton,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Article as ArticleIcon,
  Tv as ChannelIcon,
  Person as PersonIcon,
  TrendingUp as TrendingIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { debounce } from 'lodash';

// Styled components
const SearchContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.spacing(3),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  border: `1px solid ${theme.palette.divider}`,
  '&:focus-within': {
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    border: `1px solid ${theme.palette.primary.main}`,
  }
}));

const SuggestionItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  }
}));

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'news' | 'channel' | 'user' | 'tag';
  metadata?: {
    channelName?: string;
    handle?: string;
    articleCount?: number;
  };
}

interface SearchBarProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  onSuggestionSelect: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  popularSearches?: string[];
  className?: string;
}

interface SearchFilters {
  type?: 'news' | 'channels' | 'users' | 'all';
  tags?: string[];
  dateRange?: 'day' | 'week' | 'month' | 'year';
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onSuggestionSelect,
  placeholder = "Search articles, channels, or journalists...",
  popularSearches = [],
  className
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced API call for suggestions
  const fetchSuggestions = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        
        // Backend returns { query, suggestions } directly
        if (data.suggestions) {
          // Transform API response to suggestions format
          const transformedSuggestions: SearchSuggestion[] = data.suggestions.map((suggestion: string, index: number) => ({
            id: `suggestion-${index}`,
            text: suggestion,
            type: 'tag' as const, // Default type, could be enhanced
          }));
          setSuggestions(transformedSuggestions);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchSuggestions(query);
  }, [query, fetchSuggestions]);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return <ArticleIcon fontSize="small" color="primary" />;
      case 'channel': return <ChannelIcon fontSize="small" color="secondary" />;
      case 'user': return <PersonIcon fontSize="small" color="action" />;
      default: return <TrendingIcon fontSize="small" color="disabled" />;
    }
  };

  const renderSuggestionOption = (props: any, suggestion: SearchSuggestion) => (
    <SuggestionItem {...props} key={suggestion.id}>
      <Box sx={{ mr: 2 }}>
        {getTypeIcon(suggestion.type)}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" fontWeight="medium">
          {suggestion.text}
        </Typography>
        {suggestion.metadata && (
          <Typography variant="caption" color="text.secondary">
            {suggestion.metadata.channelName && `in ${suggestion.metadata.channelName}`}
            {suggestion.metadata.handle && `@${suggestion.metadata.handle}`}
            {suggestion.metadata.articleCount && `${suggestion.metadata.articleCount} articles`}
          </Typography>
        )}
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
        {suggestion.type}
      </Typography>
    </SuggestionItem>
  );

  return (
    <Box className={className}>
      <SearchContainer>
        <Autocomplete
          freeSolo
          options={suggestions}
          loading={isLoading}
          inputValue={query}
          onInputChange={(_, newValue) => setQuery(newValue)}
          getOptionLabel={(option) => typeof option === 'string' ? option : option.text}
          renderOption={renderSuggestionOption}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder={placeholder}
              onKeyPress={handleKeyPress}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton onClick={handleSearch} size="small">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: query && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setQuery('')} size="small">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }
              }}
            />
          )}
          PaperComponent={({ children, ...props }) => (
            <Paper {...props} sx={{ mt: 1, boxShadow: 3 }}>
              {children}
              {popularSearches.length > 0 && query.length === 0 && (
                <>
                  <Divider />
                  <Box sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Popular searches
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {popularSearches.map((search, index) => (
                        <Chip
                          key={index}
                          label={search}
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setQuery(search);
                            onSearch(search);
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </>
              )}
            </Paper>
          )}
          onOpen={() => {
            if (query.length === 0 && popularSearches.length > 0) {
              // Show popular searches when opening with empty query
            }
          }}
          onChange={(_, value) => {
            if (value && typeof value === 'object') {
              onSuggestionSelect(value);
            }
          }}
        />
      </SearchContainer>
    </Box>
  );
};

export default SearchBar; 