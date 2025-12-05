import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
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
  Stack,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Tooltip,
  Popover,
  Button
} from '@mui/material';
import {
  Article as ArticleIcon,
  Tv as ChannelIcon,
  Person as PersonIcon,
  Poll as PollIcon,
  Tag as TagIcon,
  FilterList as FilterListIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PATHS } from '@/constants/paths';
import type { SearchFilters } from '@/hooks/useSearch';
import type { SearchResult } from '@/APIs/app/SearchAPI';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';
import { StringToSearchType, StringToSearchSort } from '@/enums/SearchEnums';


// Styled components
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
  
  const [page, setPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    sortBy: 'relevance'
  });
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { api } = useApiContext();
  const { execute } = useApiCall();

  const limit = 20;

  // Extract query from URL params on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    const type = params.get('type') as SearchFilters['type'];
    
    if (query) {
      setCurrentQuery(query);
      const initialFilters = { ...filters };
      if (type && type !== 'all') {
        initialFilters.type = type;
        setFilters(initialFilters);
      }
      handleNewSearch(query, initialFilters);
    }
  }, [location.search]);

  useEffect(() => {
    if (currentQuery) {
      setPage(1);
      performSearch(1);
    }
  }, [filters]); // Refetch when filters change

  const fetchMoreData = () => {
    performSearch(page + 1);
  };

  const performSearch = async (_page: number = page) => {
    if (!currentQuery) return;

    setLoading(true);
    setError(null);

    try {
      const apiFilters: any = {};
      
      // Convert frontend string filters to backend number filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'type' && typeof value === 'string') {
            const numericType = StringToSearchType[value];
            if (numericType !== undefined) {
              apiFilters.type = numericType;
            }
          } else if (key === 'sortBy' && typeof value === 'string') {
            const numericSort = StringToSearchSort[value];
            if (numericSort !== undefined) {
              apiFilters.sortBy = numericSort;
            }
          } else {
            apiFilters[key] = value;
          }
        }
      });

      const result = await execute(
        () => api?.app.search.search(
          currentQuery,
          apiFilters,
          {
            page: _page,
            limit
          }
        ),
        { showErrorToast: true }
      );

      if (result) {
        if (_page === 1) {
          setAllResults(result.items ?? []);
        } else {
          setAllResults(prev => [...prev, ...(result.items ?? [])]);
        }
        
        setPage(result.metadata.currentPage ?? 1);
        setHasMore(result.metadata.hasNext === true);
        setSearchResults(result);
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Reset and start new search
  const handleNewSearch = async (query: string, searchFilters?: SearchFilters) => {
    const updatedFilters = searchFilters || filters;
    setFilters(updatedFilters);
    setCurrentQuery(query);
    setPage(1);
    setAllResults([]);
    setHasMore(true);
    
    // Use setTimeout to ensure state updates are processed
    setTimeout(() => {
      performSearch(1);
    }, 0);
  };



  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    
    // Close the filter popup
    setFilterAnchorEl(null);
    
    // Re-search with new filters if we have a current query
    if (currentQuery) {
      handleNewSearch(currentQuery, updatedFilters);
    }
  };

  // Handle tag click - navigate to relevant list page with tag filter
  const handleTagClick = (tag: string, resultType: string) => {
    const tagParam = encodeURIComponent(tag);
    
    switch (resultType) {
      case 'news':
        navigate(`${PATHS.APP_NEWS}?tags=${tagParam}`);
        break;
      case 'channel':
        navigate(`${PATHS.APP_CHANNELS}?tags=${tagParam}`);
        break;
      case 'poll':
        navigate(`${PATHS.APP_POLLS}?tags=${tagParam}`);
        break;
      default:
        // For general tags or unknown types, go to news by default
        navigate(`${PATHS.APP_NEWS}?tags=${tagParam}`);
        break;
    }
  };

  // Render search result card
  const renderResultCard = (result: SearchResult) => {
    const getTypeIcon = () => {
      switch (result.type) {
        case 'news': return <ArticleIcon color="primary" />;
        case 'channel': return <ChannelIcon color="secondary" />;
        case 'user': return <PersonIcon color="action" />;
        case 'poll': return <PollIcon color="info" />;
        case 'tag': return <TagIcon color="success" />;
        default: return <ArticleIcon color="primary" />;
      }
    };

    const getTypeColor = () => {
      switch (result.type) {
        case 'news': return 'primary';
        case 'channel': return 'secondary';
        case 'user': return 'default';
        case 'poll': return 'info';
        case 'tag': return 'success';
        default: return 'default';
      }
    };

    const handleResultClick = () => {
      switch (result.type) {
        case 'news':
          navigate(PATHS.APP_NEWS_VIEW.replace(':id', result.id));
          break;
        case 'channel':
          navigate(PATHS.APP_CHANNEL_VIEW.replace(':channelId', result.id));
          break;
        case 'poll':
          navigate(PATHS.APP_POLL_VIEW.replace(':id', result.id));
          break;
        case 'tag':
          // For tags, navigate to search with tag query
          navigate(`${PATHS.APP_SEARCH}?q=${encodeURIComponent(result.title)}`);
          break;
        case 'user':
          // Users don't have individual view pages in the current routes
          // Could be handled differently based on requirements
          break;
        default:
          break;
      }
    };

    return (
      <ResultCard key={result.id} onClick={handleResultClick}>
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
                      {result?.channel?.name?.charAt(0)}
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

                {result.startDate && (
                  <Typography variant="caption" color="text.secondary">
                    Start: {new Date(result.startDate).toLocaleDateString()}
                  </Typography>
                )}

                {result.endDate && (
                  <Typography variant="caption" color="text.secondary">
                    End: {new Date(result.endDate).toLocaleDateString()}
                  </Typography>
                )}

                {result.voteCount !== undefined && (
                  <StatsChip 
                    label={`${result.voteCount} votes`}
                    size="small"
                    variant="outlined"
                    color="info"
                  />
                )}

                {result.usageCount !== undefined && (
                  <StatsChip 
                    label={`${result.usageCount} uses`}
                    size="small"
                    variant="outlined"
                    color="success"
                  />
                )}
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
                        handleTagClick(tag, result.type);
                      }}
                      sx={{ 
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'primary.main',
                          color: 'primary.contrastText'
                        }
                      }}
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



  const openFilters = Boolean(filterAnchorEl);
  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Results Header with Filter Button */}
      {(allResults.length > 0 || loading) && currentQuery && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Search Results
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Found {(searchResults?.metadata?.total || 0).toLocaleString()} results for "{currentQuery}"
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

          {/* Filter Button */}
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
            sx={{ minWidth: 120 }}
          >
            Filters
          </Button>
        </Box>
      )}

      {/* Filter Popup */}
      <Popover
        open={openFilters}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ p: 3, minWidth: 280 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Filters
            </Typography>
            <IconButton size="small" onClick={handleFilterClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

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
              <MenuItem value="polls">Polls</MenuItem>
              <MenuItem value="tags">Tags</MenuItem>
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
        </Paper>
      </Popover>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State - Only show skeletons when no results and loading */}
      {loading && allResults.length === 0 && renderSkeletons()}

      {/* Results */}
      {allResults.length === 0 && !loading && currentQuery ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No results found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search terms or filters
          </Typography>
        </Paper>
      ) : allResults.length > 0 ? (
        <InfiniteScroll
          dataLength={allResults.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <Box sx={{ mt: 2 }}>
              {renderSkeletons()}
            </Box>
          }
          endMessage={
            <Box sx={{ 
              textAlign: 'center', 
              mt: 4, 
              color: 'text.secondary',
              fontSize: '0.875rem'
            }}>
              No more results to display
            </Box>
          }
        >
          {allResults.map(renderResultCard)}
        </InfiniteScroll>
      ) : null}

      {/* Empty State */}
      {!loading && !searchResults && !error && (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            Start your search
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Search for articles, channels, journalists, polls, or tags to get started
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default SearchPage; 