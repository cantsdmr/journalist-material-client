import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Skeleton,
  Alert,
  Pagination,
  Stack,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Article as ArticleIcon,
  Tv as ChannelIcon,
  Person as PersonIcon,
  Tune as TuneIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar';
import { useSearch } from '../hooks/useSearch';
import type { SearchFilters, SearchResult } from '../hooks/useSearch';

// Styled components
const FilterPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  position: 'sticky',
  top: theme.spacing(2),
  height: 'fit-content'
}));

const ResultCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-1px)'
  }
}));

const StatsChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontSize: '0.75rem'
}));

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchResults, loading, error, performSearch } = useSearch();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    sortBy: 'relevance'
  });

  const resultsPerPage = 20;

  // Extract query from URL params on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    const type = params.get('type') as SearchFilters['type'];
    
    if (query) {
      const initialFilters = { ...filters };
      if (type && type !== 'all') {
        initialFilters.type = type;
        setFilters(initialFilters);
      }
      performSearch(query, initialFilters, 1);
    }
  }, [location.search]);

  // Handle search from search bar
  const handleSearch = (query: string, searchFilters?: SearchFilters) => {
    const updatedFilters = searchFilters || filters;
    setCurrentPage(1);
    
    // Update URL with search params
    const params = new URLSearchParams();
    params.set('q', query);
    if (updatedFilters.type && updatedFilters.type !== 'all') {
      params.set('type', updatedFilters.type);
    }
    navigate(`/search?${params.toString()}`);
    
    performSearch(query, updatedFilters, 1);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setCurrentPage(1);
    
    // Re-search with new filters if we have results
    if (searchResults) {
      performSearch(searchResults.query, updatedFilters, 1);
    }
  };

  // Handle pagination
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    handleSearch(searchResults?.query || '', filters);
  };

  // Render search result card
  const renderResultCard = (result: SearchResult) => {
    const getTypeIcon = () => {
      switch (result.type) {
        case 'news': return <ArticleIcon color="primary" />;
        case 'channel': return <ChannelIcon color="secondary" />;
        case 'user': return <PersonIcon color="action" />;
      }
    };

    const getTypeColor = () => {
      switch (result.type) {
        case 'news': return 'primary';
        case 'channel': return 'secondary';
        case 'user': return 'default';
        default: return 'default';
      }
    };

    return (
      <ResultCard key={result.id}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ mt: 0.5 }}>
              {getTypeIcon()}
            </Box>
            
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  {result.title}
                </Typography>
                <Chip 
                  label={result.type} 
                  size="small" 
                  color={getTypeColor() as any}
                  variant="outlined"
                />
              </Box>

              {result.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.6 }}>
                  {result.description}
                </Typography>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                {result.channel && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 20, height: 20 }}>
                      {result.channel.name.charAt(0)}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      in <strong>{result.channel.name}</strong> (@{result.channel.handle})
                    </Typography>
                  </Box>
                )}

                {result.handle && (
                  <Typography variant="caption" color="text.secondary">
                    @{result.handle}
                  </Typography>
                )}

                {result.publishedAt && (
                  <Typography variant="caption" color="text.secondary">
                    {new Date(result.publishedAt).toLocaleDateString()}
                  </Typography>
                )}

                <StatsChip 
                  label={`${(result.relevanceScore * 100).toFixed(0)}% match`}
                  size="small"
                  variant="outlined"
                  color="success"
                />
              </Box>

              {result.tags && result.tags.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                  {result.tags.slice(0, 5).map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSearch(`${searchResults?.query} ${tag}`);
                      }}
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                </Box>
              )}

              {/* Action buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1 }}>
                <Tooltip title="Bookmark">
                  <IconButton size="small">
                    <BookmarkIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share">
                  <IconButton size="small">
                    <ShareIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </ResultCard>
    );
  };

  // Render loading skeletons
  const renderSkeletons = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="80%" height={20} />
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Skeleton variant="rounded" width={60} height={24} />
            <Skeleton variant="rounded" width={80} height={24} />
          </Box>
        </Paper>
      ))}
    </>
  );

  const totalPages = searchResults ? Math.ceil(searchResults.total / resultsPerPage) : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <SearchBar
          onSearch={handleSearch}
          onSuggestionSelect={(suggestion) => {
            handleSearch(suggestion.text);
          }}
          popularSearches={['cryptocurrency', 'climate change', 'technology', 'politics']}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <FilterPanel>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TuneIcon fontSize="small" />
              Filters
            </Typography>

            {/* Content Type Filter */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Content Type</InputLabel>
              <Select
                value={filters.type || 'all'}
                label="Content Type"
                onChange={(e) => handleFilterChange({ type: e.target.value as any })}
              >
                <MenuItem value="all">All Content</MenuItem>
                <MenuItem value="news">Articles</MenuItem>
                <MenuItem value="channels">Channels</MenuItem>
                <MenuItem value="users">Journalists</MenuItem>
              </Select>
            </FormControl>

            {/* Sort By */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy || 'relevance'}
                label="Sort By"
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
              >
                <MenuItem value="relevance">Relevance</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="popularity">Popularity</MenuItem>
              </Select>
            </FormControl>

            {/* Date Range */}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Time Period
            </Typography>
            <ToggleButtonGroup
              value={filters.dateFrom ? 'custom' : 'all'}
              exclusive
              onChange={(_, value) => {
                if (value === 'all') {
                  handleFilterChange({ dateFrom: undefined, dateTo: undefined });
                } else if (value) {
                  const now = new Date();
                  const periods = {
                    'day': 1,
                    'week': 7,
                    'month': 30,
                    'year': 365
                  };
                  const days = periods[value as keyof typeof periods] || 0;
                  const dateFrom = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
                  handleFilterChange({ dateFrom, dateTo: now });
                }
              }}
              size="small"
              sx={{ mb: 2, width: '100%' }}
            >
              <ToggleButton value="all" sx={{ flex: 1 }}>All</ToggleButton>
              <ToggleButton value="week" sx={{ flex: 1 }}>Week</ToggleButton>
              <ToggleButton value="month" sx={{ flex: 1 }}>Month</ToggleButton>
            </ToggleButtonGroup>
          </FilterPanel>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={9}>
          {/* Results Header */}
          {searchResults && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Search Results
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Found {searchResults.total.toLocaleString()} results for "{searchResults.query}"
                {searchResults.took && ` (${searchResults.took}ms)`}
              </Typography>
              
              {/* Active Filters */}
              {(filters.type !== 'all' || filters.sortBy !== 'relevance') && (
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Active filters:
                  </Typography>
                  {filters.type !== 'all' && (
                    <Chip
                      label={`Type: ${filters.type}`}
                      size="small"
                      onDelete={() => handleFilterChange({ type: 'all' })}
                    />
                  )}
                  {filters.sortBy !== 'relevance' && (
                    <Chip
                      label={`Sort: ${filters.sortBy}`}
                      size="small"
                      onDelete={() => handleFilterChange({ sortBy: 'relevance' })}
                    />
                  )}
                </Stack>
              )}
            </Box>
          )}

          {/* Error State */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading && renderSkeletons()}

          {/* Results */}
          {!loading && searchResults && (
            <>
              {searchResults.results.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    No results found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Try adjusting your search terms or filters
                  </Typography>
                </Paper>
              ) : (
                <>
                  {searchResults.results.map(renderResultCard)}
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                      />
                    </Box>
                  )}
                </>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && !searchResults && !error && (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                Start your search
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Search for articles, channels, or journalists to get started
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default SearchPage; 