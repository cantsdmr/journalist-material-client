# Search Integration Documentation

This document outlines the complete search functionality integration for the journalist-material-client application, covering both the main app and creator studio sections.

## Overview

The search functionality has been fully integrated into both the main application (`/app`) and creator studio (`/studio`) sections, providing users with powerful search capabilities across all content types.

## Components

### Core Search Components

1. **SearchBar** (`src/components/search/SearchBar.tsx`)
   - Advanced search input with Material-UI Autocomplete
   - Real-time suggestions with 300ms debouncing
   - Popular searches dropdown
   - Keyboard navigation support
   - Responsive design for all screen sizes

2. **SearchPage** (`src/pages/SearchPage.tsx`)
   - Complete search results page
   - Advanced filtering sidebar (content type, date range, sorting)
   - Pagination for large result sets
   - URL synchronization for shareable search results
   - Loading states and error handling

3. **useSearch Hook** (`src/hooks/useSearch.ts`)
   - Custom React hook for search state management
   - API integration with backend endpoints
   - Suggestions fetching and caching
   - Error handling and loading states

## Integration Points

### 1. Navigation Layouts

#### MainLayout (`/app` section)
- **SearchBar Integration**: Centered in the top navigation bar
- **Search Handler**: Navigates to `/app/search?q={query}`
- **Suggestions**: Tailored for general content discovery
- **Popular Searches**: `['cryptocurrency', 'climate change', 'technology', 'politics']`

#### StudioLayout (`/studio` section)
- **SearchBar Integration**: Centered in the top navigation bar
- **Search Handler**: Navigates to `/studio/search?q={query}`
- **Suggestions**: Focused on creator content and analytics
- **Popular Searches**: `['performance', 'engagement', 'subscribers', 'trending']`

### 2. Sidebar Navigation

#### Main App Sidebar
- **Search Link**: Added as second item after "Trending"
- **Icon**: Search icon for easy recognition
- **Path**: `/app/search`

#### Studio Sidebar
- **Search Link**: Added in "General" section at the top
- **Icon**: Search icon for easy recognition
- **Path**: `/studio/search`

### 3. Routing Configuration

#### App.tsx Updates
```typescript
// Added SEARCH import
import { PATHS, NEWS, CHANNEL, POLL, ACCOUNT, SEARCH } from '@/constants/paths';

// Added SearchPage import
import SearchPage from '@/pages/SearchPage';

// Added search routes for both sections
<Route path={SEARCH.ROOT} element={<SearchPage />} />
```

#### Path Constants (`src/constants/paths.ts`)
```typescript
export const SEARCH = {
  ROOT: 'search'
} as const;

// Added to PATHS object
APP_SEARCH: `${ENV_BASE}${BASE.APP}/${SEARCH.ROOT}`,
STUDIO_SEARCH: `${ENV_BASE}${BASE.STUDIO}/${SEARCH.ROOT}`,
```

## Features

### Search Functionality
- **Real-time Suggestions**: Debounced API calls for performance
- **Advanced Filtering**: Content type, date range, tags, premium content
- **Sorting Options**: Relevance, date, popularity
- **Pagination**: Efficient handling of large result sets
- **URL Synchronization**: Shareable search results with query parameters

### User Experience
- **Responsive Design**: Works seamlessly on all screen sizes
- **Loading States**: Skeleton loaders during search operations
- **Error Handling**: Graceful error messages and retry options
- **Keyboard Navigation**: Full keyboard accessibility
- **Popular Searches**: Quick access to trending topics

### Context-Aware Search
- **App Section**: Focuses on content discovery for readers
  - Articles, channels, journalists
  - Public content emphasis
  - Reader-oriented suggestions

- **Studio Section**: Focuses on creator tools and analytics
  - Creator's own content
  - Performance metrics
  - Analytics-oriented suggestions

## API Integration

### Backend Endpoints
- **Search**: `GET /api/search?q={query}&type={type}&sort={sort}&page={page}`
- **Suggestions**: `GET /api/search/suggestions?q={query}`

### Request Parameters
- `q`: Search query string
- `type`: Content type filter (news, channel, user)
- `sort`: Sort order (relevance, date, popularity)
- `page`: Pagination page number
- `limit`: Results per page
- `tags`: Tag filters
- `dateFrom`/`dateTo`: Date range filters
- `premium`: Premium content filter

## Usage Examples

### Basic Search
```typescript
// Navigate to search page with query
navigate(`${PATHS.APP_SEARCH}?q=${encodeURIComponent('climate change')}`);
```

### Advanced Search with Filters
```typescript
// Search with filters
const searchParams = new URLSearchParams({
  q: 'technology',
  type: 'news',
  sort: 'date',
  page: '1'
});
navigate(`${PATHS.APP_SEARCH}?${searchParams.toString()}`);
```

### Using the Search Hook
```typescript
const {
  query,
  results,
  suggestions,
  loading,
  error,
  handleSearch,
  handleFilterChange
} = useSearch();
```

## Customization

### Styling
- Search components use Material-UI theming
- Responsive breakpoints for mobile/desktop
- Dark/light mode support
- Custom CSS classes for additional styling

### Configuration
- Popular searches can be customized per section
- Debounce timing adjustable in SearchBar
- Results per page configurable
- API endpoints configurable

## Dependencies

### Required Packages
- `@mui/material`: UI components
- `@mui/icons-material`: Icons
- `react-router-dom`: Navigation
- `lodash`: Utility functions (debouncing)

### Optional Enhancements
- `@mui/lab`: Additional experimental components
- `react-query`: Advanced API state management
- `fuse.js`: Client-side fuzzy search

## Performance Considerations

### Optimization Strategies
- **Debounced Suggestions**: 300ms delay to reduce API calls
- **Memoized Components**: React.memo for search results
- **Lazy Loading**: Pagination for large result sets
- **Caching**: Browser caching for repeated searches

### Best Practices
- Use URL parameters for search state
- Implement proper loading states
- Handle edge cases (empty results, errors)
- Provide clear user feedback

## Accessibility

### Features
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels
- **Focus Management**: Logical tab order
- **High Contrast**: Supports system preferences

### ARIA Labels
- Search input: `aria-label="Search content"`
- Results: `aria-live="polite"` for dynamic updates
- Filters: Proper form labeling

## Testing

### Test Coverage
- Unit tests for search components
- Integration tests for search flow
- E2E tests for complete user journeys
- Performance tests for large datasets

### Test Scenarios
- Basic search functionality
- Filter combinations
- Pagination behavior
- Error handling
- Mobile responsiveness

## Future Enhancements

### Planned Features
- **Search History**: Recent searches persistence
- **Saved Searches**: Bookmark frequent searches
- **Search Analytics**: Track search patterns
- **AI Suggestions**: Machine learning recommendations

### Technical Improvements
- **Elasticsearch Integration**: Advanced search capabilities
- **Real-time Updates**: WebSocket-based live results
- **Offline Search**: Service worker caching
- **Voice Search**: Speech-to-text integration

## Troubleshooting

### Common Issues
1. **Search not working**: Check API endpoint configuration
2. **Suggestions not loading**: Verify debounce timing
3. **Routing issues**: Ensure path constants are correct
4. **Styling problems**: Check Material-UI theme configuration

### Debug Tips
- Use browser dev tools to inspect network requests
- Check console for JavaScript errors
- Verify URL parameters are properly encoded
- Test with different screen sizes

## Support

For questions or issues related to search functionality:
1. Check this documentation first
2. Review the component source code
3. Test with the backend API directly
4. Contact the development team

---

*Last updated: [Current Date]*
*Version: 1.0.0* 