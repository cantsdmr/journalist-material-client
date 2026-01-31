import React, { useState, useEffect, useCallback } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  InputAdornment,
  Paper,
  IconButton
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
import { useSearch } from '@/hooks/useSearch';
import { SearchSuggestion, SearchFilters } from '@/enums/SearchEnums';
import { StructuredSearchSuggestion } from '@/types/index';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/constants/paths';

// Styled components for AppBar usage
const SearchContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isFocused',
})<{ isFocused?: boolean }>(({ theme, isFocused }) => ({
  position: 'relative',
  width: isFocused ? '600px' : '480px',
  maxWidth: isFocused ? '600px' : '480px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  [theme.breakpoints.down('lg')]: {
    width: isFocused ? '560px' : '460px',
    maxWidth: isFocused ? '560px' : '460px',
  },
  [theme.breakpoints.down('md')]: {
    width: isFocused ? '400px' : '360px',
    maxWidth: isFocused ? '400px' : '360px',
  },
  [theme.breakpoints.down('sm')]: {
    width: isFocused ? '320px' : '280px',
    maxWidth: isFocused ? '320px' : '280px',
  },
}));

const SearchInput = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.15)' 
    : 'rgba(0, 0, 0, 0.04)',
  border: 'none',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.08)',
  },
  '&:focus-within': {
    backgroundColor: theme.palette.background.paper,
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

interface SearchBarProps {
  onSearch?: (query: string, filters?: SearchFilters) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  className?: string;
  fullWidth?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onSuggestionSelect,
  placeholder = "Search articles, channels, or journalists...",
  className,
  fullWidth = false
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<StructuredSearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { getStructuredSuggestions } = useSearch();
  const navigate = useNavigate();

  // Debounced API call for suggestions using useSearch hook
  const fetchSuggestions = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      
      try {
        const structuredSuggestions = await getStructuredSuggestions(searchQuery);
        setSuggestions(structuredSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [] // Dependencies managed by getStructuredSuggestions hook internally
  );

  useEffect(() => {
    fetchSuggestions(query);
  }, [query, fetchSuggestions]);

  const handleSearch = () => {
    if (query.trim()) {
      setIsOpen(false);
      if (onSearch) {
        onSearch(query);
      } else {
        // Default behavior: navigate to search page
        navigate(`${PATHS.APP_SEARCH}?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleSuggestionClick = (suggestion: StructuredSearchSuggestion) => {
    setIsOpen(false);
    setQuery(''); // Clear the input

    if (onSuggestionSelect) {
      // Convert StructuredSearchSuggestion to SearchSuggestion for backward compatibility
      const legacySuggestion: SearchSuggestion = {
        id: suggestion.id,
        text: suggestion.text,
        type: suggestion.type as any,
        metadata: suggestion.metadata
      };
      onSuggestionSelect(legacySuggestion);
      return;
    }

    // Default behavior: navigate directly to the content
    switch (suggestion.type) {
      case 'news':
        navigate(PATHS.APP_NEWS_VIEW.replace(':id', suggestion.id));
        break;
      case 'channel':
        navigate(PATHS.APP_CHANNEL_VIEW.replace(':channelId', suggestion.id));
        break;
      case 'poll':
        navigate(PATHS.APP_POLL_VIEW.replace(':id', suggestion.id));
        break;
      case 'user':
        // Users don't have individual view pages, so search for them
        navigate(`${PATHS.APP_SEARCH}?q=${encodeURIComponent(suggestion.text)}&type=users`);
        break;
      case 'tag':
        // For tags, search for content with that tag
        navigate(`${PATHS.APP_SEARCH}?q=${encodeURIComponent(suggestion.text)}&type=tags`);
        break;
      default:
        // Fallback: search for the text
        navigate(`${PATHS.APP_SEARCH}?q=${encodeURIComponent(suggestion.text)}`);
        break;
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

  const renderSuggestionOption = (props: any, suggestion: StructuredSearchSuggestion) => (
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
            {suggestion.metadata.voteCount && `${suggestion.metadata.voteCount} votes`}
            {suggestion.metadata.usageCount && `${suggestion.metadata.usageCount} uses`}
            {suggestion.metadata.publishedAt && `${new Date(suggestion.metadata.publishedAt).toLocaleDateString()}`}
          </Typography>
        )}
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
        {suggestion.type}
      </Typography>
    </SuggestionItem>
  );

  return (
    <SearchContainer
      className={className}
      isFocused={isFocused}
      sx={{
        width: fullWidth ? '100%' : undefined
      }}
    >
      <SearchInput elevation={0}>
        <Autocomplete
          freeSolo
          options={suggestions}
          loading={isLoading}
          inputValue={query}
          onInputChange={(_, newValue) => {
            setQuery(newValue);
            // Open dropdown when user types 2+ characters, close when empty
            setIsOpen(newValue.length >= 2);
          }}
          getOptionLabel={(option) => {
            return typeof option === 'string' ? option : option.text;
          }}
          filterOptions={(options) => {
            return options;
          }}
          isOptionEqualToValue={(option, value) => {
            if (typeof option === 'string' || typeof value === 'string') {
              const optionText = typeof option === 'string' ? option : option.text;
              const valueText = typeof value === 'string' ? value : value.text;
              return optionText === valueText;
            }
            return option.id === value.id;
          }}
          renderOption={(props, option) => {
            return renderSuggestionOption(props, option);
          }}
          noOptionsText={isLoading ? "Loading..." : "No suggestions found"}
          open={isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={() => {
            setIsOpen(false);
            setIsFocused(false);
          }}
          ListboxProps={{
            style: { maxHeight: 400 } // Ensure enough height for all options
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder={isFocused ? placeholder : "Search..."}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                // Delay to allow clicking suggestions
                setTimeout(() => {
                  if (!isOpen) {
                    setIsFocused(false);
                  }
                }, 200);
              }}
              size="medium"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton onClick={handleSearch} size="small" sx={{ color: 'inherit' }}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {isLoading && <Typography variant="caption" sx={{ mr: 1 }}>Loading...</Typography>}
                    {query && (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setQuery('')} size="small" sx={{ color: 'inherit' }}>
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )}
                  </>
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
                  '& .MuiInputBase-input': {
                    padding: '12px 8px',
                    fontSize: '1rem',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'inherit',
                    opacity: 0.7,
                  }
                }
              }}
            />
          )}
          PaperComponent={({ children, ...props }) => (
            <Paper
              {...props}
              sx={{
                mt: 0.5,
                boxShadow: 3,
                maxHeight: 400,
                overflow: 'auto',
                position: 'absolute',
                width: '100%',
                zIndex: 1300,
                borderRadius: 3,
              }}
            >
              {children}
            </Paper>
          )}
          onChange={(_, value) => {
            if (value && typeof value === 'object') {
              handleSuggestionClick(value);
            }
          }}
        />
      </SearchInput>
    </SearchContainer>
  );
};

export default SearchBar; 