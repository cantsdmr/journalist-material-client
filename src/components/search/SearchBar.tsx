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

// Styled components for AppBar usage
const SearchContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  maxWidth: 600,
  margin: '0 auto',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400,
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: 280,
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
  onSearch: (query: string, filters?: SearchFilters) => void;
  onSuggestionSelect: (suggestion: SearchSuggestion) => void;
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
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { getSuggestions } = useSearch();

  // Debounced API call for suggestions using useSearch hook
  const fetchSuggestions = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      
      try {
        const suggestionStrings = await getSuggestions(searchQuery);
        
        // Transform API response to suggestions format
        const transformedSuggestions: SearchSuggestion[] = suggestionStrings
          .filter((suggestion: string) => suggestion && suggestion.trim()) // Filter out empty suggestions
          .map((suggestion: string, index: number) => ({
            id: `suggestion-${index}`,
            text: suggestion.trim(),
            type: 'tag' as const, // Default type, could be enhanced
          }));
    
        setSuggestions(transformedSuggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [getSuggestions]
  );

  useEffect(() => {
    fetchSuggestions(query);
  }, [query, fetchSuggestions]);

  const handleSearch = () => {
    if (query.trim()) {
      setIsOpen(false);
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
    <SearchContainer 
      className={className}
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
            const optionText = typeof option === 'string' ? option : option.text;
            const valueText = typeof value === 'string' ? value : value.text;
            return optionText === valueText;
          }}
          renderOption={(props, option) => {
            return renderSuggestionOption(props, option);
          }}
          noOptionsText={isLoading ? "Loading..." : "No suggestions found"}
          open={isOpen}
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
          ListboxProps={{
            style: { maxHeight: 400 } // Ensure enough height for all options
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder={placeholder}
              onKeyPress={handleKeyPress}
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
              onSuggestionSelect(value);
            }
          }}
        />
      </SearchInput>
    </SearchContainer>
  );
};

export default SearchBar; 