# Custom Hooks Guide

This guide explains the custom React hooks available in the application for data fetching, state management, and UI interactions.

## Quick Reference

| Hook | Purpose | Returns | When to Use |
|------|---------|---------|-------------|
| **useApiCall** | API error handling | `{ execute, loading, error }` | All API mutations |
| **useCursorPagination** | Infinite scroll | `{ items, loading, hasMore, loadMore }` | News feeds, notification feeds |
| **useSearch** | Search functionality | `{ results, loading, search, filters }` | Search pages |
| **useDebounce** | Debounce values | `debouncedValue` | Search inputs, autocomplete |
| **useIntersectionObserver** | Element visibility | `{ ref, isIntersecting }` | Lazy loading, infinite scroll |
| **useLocalStorage** | Persistent state | `[value, setValue]` | User preferences |

## Directory Structure

```
src/hooks/
├── useApiCall.ts              # API error handling
├── useCursorPagination.ts     # Infinite scroll pagination
├── useSearch.ts               # Search functionality
├── useDebounce.ts             # Debounced values
├── useIntersectionObserver.ts # Element visibility detection
├── useLocalStorage.ts         # localStorage state
└── index.ts                   # Barrel export
```

## Part 1: useApiCall

**Purpose:** Centralized API error handling and loading states

**File:** `/src/hooks/useApiCall.ts`

### Basic Implementation

```typescript
import { useState } from 'react';
import { useSnackbar } from 'notistack';

interface UseApiCallOptions {
  showSuccessMessage?: boolean;
  successMessage?: string;
  showErrorToast?: boolean;
  errorMessage?: string;
}

export function useApiCall<T = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const execute = async (
    apiCall: () => Promise<T>,
    options: UseApiCallOptions = {}
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiCall();

      // Show success message if requested
      if (options.showSuccessMessage) {
        enqueueSnackbar(
          options.successMessage || 'Operation successful',
          { variant: 'success' }
        );
      }

      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);

      // Show error toast if requested
      if (options.showErrorToast !== false) {
        enqueueSnackbar(
          options.errorMessage || error.message || 'Operation failed',
          { variant: 'error' }
        );
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}
```

### Usage Examples

#### Create News

```typescript
import { useApiCall } from '@/hooks/useApiCall';
import { useApiContext } from '@/contexts/ApiContext';
import { useNavigate } from 'react-router-dom';

function CreateNewsForm() {
  const { api } = useApiContext();
  const navigate = useNavigate();
  const { execute, loading } = useApiCall();

  const handleSubmit = async (data: CreateNewsData) => {
    const result = await execute(
      () => api.app.news.createNews(data),
      {
        showSuccessMessage: true,
        successMessage: 'News created successfully!'
      }
    );

    if (result) {
      navigate(`/news/${result.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create'}
      </Button>
    </form>
  );
}
```

#### Update User Profile

```typescript
function UpdateProfileForm() {
  const { api } = useApiContext();
  const { refetch } = useProfile();
  const { execute, loading } = useApiCall();

  const handleSubmit = async (data: UpdateUserData) => {
    const result = await execute(
      () => api.app.user.updateProfile(data),
      {
        showSuccessMessage: true,
        successMessage: 'Profile updated successfully!'
      }
    );

    if (result) {
      // Refetch profile to update context
      await refetch();
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

#### Delete with Confirmation

```typescript
function DeleteNewsButton({ newsId }: { newsId: string }) {
  const { api } = useApiContext();
  const { execute, loading } = useApiCall();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this news?');
    if (!confirmed) return;

    const result = await execute(
      () => api.app.news.deleteNews(newsId),
      {
        showSuccessMessage: true,
        successMessage: 'News deleted successfully!',
        showErrorToast: true
      }
    );

    if (result !== null) {
      navigate('/news');
    }
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={loading}
      color="error"
    >
      {loading ? 'Deleting...' : 'Delete'}
    </Button>
  );
}
```

#### Custom Error Handling

```typescript
function LoginForm() {
  const { execute, loading, error } = useApiCall();
  const { login } = useAuth();

  const handleSubmit = async (data: LoginData) => {
    const result = await execute(
      () => login(data.email, data.password),
      {
        showSuccessMessage: true,
        showErrorToast: false // Custom error handling
      }
    );

    if (result) {
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Show custom error message */}
      {error && (
        <Alert severity="error">
          Invalid email or password. Please try again.
        </Alert>
      )}

      <TextField name="email" />
      <TextField name="password" type="password" />
      <Button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
```

## Part 2: useCursorPagination

**Purpose:** Infinite scroll with cursor-based pagination

**File:** `/src/hooks/useCursorPagination.ts`

### Basic Implementation

```typescript
import { useState, useCallback, useRef } from 'react';
import { CursorPaginatedResponse } from '@/types';

interface UseCursorPaginationOptions {
  initialLimit?: number;
}

export function useCursorPagination<T>(
  fetcher: (cursor: string | undefined, limit: number) => Promise<CursorPaginatedResponse<T>>,
  options: UseCursorPaginationOptions = {}
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>();

  // Use refs to prevent function recreation on state changes
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  loadingRef.current = loading;
  hasMoreRef.current = hasMore;

  const loadMore = useCallback(async () => {
    // Prevent duplicate loads
    if (loadingRef.current || !hasMoreRef.current) return;

    try {
      setLoading(true);

      const response = await fetcher(
        nextCursor,
        options.initialLimit || 20
      );

      // Append new items
      setItems(prev => [...prev, ...response.items]);

      // Update pagination state
      setHasMore(response.metadata.hasMore);
      setNextCursor(response.metadata.nextCursor);
    } catch (error) {
      console.error('Failed to load more items:', error);
    } finally {
      setLoading(false);
    }
  }, [nextCursor, fetcher, options.initialLimit]);

  const refresh = useCallback(async () => {
    setItems([]);
    setNextCursor(undefined);
    setHasMore(true);

    try {
      setLoading(true);

      const response = await fetcher(
        undefined,
        options.initialLimit || 20
      );

      setItems(response.items);
      setHasMore(response.metadata.hasMore);
      setNextCursor(response.metadata.nextCursor);
    } catch (error) {
      console.error('Failed to refresh items:', error);
    } finally {
      setLoading(false);
    }
  }, [fetcher, options.initialLimit]);

  // Load initial data
  useEffect(() => {
    loadMore();
  }, []);

  return {
    items,
    loading,
    hasMore,
    loadMore,
    refresh
  };
}
```

### Usage Examples

#### News Feed

```typescript
import { useCursorPagination } from '@/hooks/useCursorPagination';
import { useApiContext } from '@/contexts/ApiContext';
import InfiniteScroll from 'react-infinite-scroll-component';

function NewsFeed() {
  const { api } = useApiContext();

  const {
    items: news,
    loading,
    hasMore,
    loadMore,
    refresh
  } = useCursorPagination(
    async (cursor, limit) => {
      return await api.app.news.getNewsFeed({
        after: cursor,
        limit
      });
    },
    { initialLimit: 20 }
  );

  return (
    <div>
      <Button onClick={refresh}>Refresh</Button>

      <InfiniteScroll
        dataLength={news.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<CircularProgress />}
        endMessage={<Typography>No more news</Typography>}
      >
        {news.map(item => (
          <NewsCard key={item.id} news={item} />
        ))}
      </InfiniteScroll>
    </div>
  );
}
```

#### Notification Feed

```typescript
function NotificationFeed() {
  const { api } = useApiContext();

  const {
    items: notifications,
    hasMore,
    loadMore
  } = useCursorPagination(
    async (cursor, limit) => {
      return await api.app.notification.getNotificationFeed({
        after: cursor,
        limit
      });
    },
    { initialLimit: 30 }
  );

  return (
    <InfiniteScroll
      dataLength={notifications.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<CircularProgress />}
    >
      {notifications.map(notification => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </InfiniteScroll>
  );
}
```

#### With Filters

```typescript
function FilteredNewsFeed() {
  const { api } = useApiContext();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const {
    items: news,
    hasMore,
    loadMore,
    refresh
  } = useCursorPagination(
    async (cursor, limit) => {
      return await api.app.news.getNewsFeed({
        after: cursor,
        limit,
        tagIds: selectedTag ? [selectedTag] : undefined
      });
    },
    { initialLimit: 20 }
  );

  // Refresh when filter changes
  useEffect(() => {
    refresh();
  }, [selectedTag, refresh]);

  return (
    <div>
      <TagFilter
        selectedTags={selectedTag ? [selectedTag] : []}
        onTagChange={(tags) => setSelectedTag(tags[0] || null)}
      />

      <InfiniteScroll
        dataLength={news.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<CircularProgress />}
      >
        {news.map(item => <NewsCard key={item.id} news={item} />)}
      </InfiniteScroll>
    </div>
  );
}
```

## Part 3: useSearch

**Purpose:** Search functionality with filters

**File:** `/src/hooks/useSearch.ts`

### Basic Implementation

```typescript
import { useState, useCallback } from 'react';
import { useApiContext } from '@/contexts/ApiContext';
import { SearchType, SearchSort } from '@/enums/SearchEnums';
import { SearchResult } from '@/types';

export interface SearchFilters {
  type?: SearchType;
  sortBy?: SearchSort;
  tagIds?: string[];
}

export function useSearch() {
  const { api } = useApiContext();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    type: SearchType.ALL,
    sortBy: SearchSort.RELEVANCE
  });

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);

      const response = await api.app.search.search({
        query,
        type: filters.type,
        sortBy: filters.sortBy,
        tagIds: filters.tagIds
      });

      setResults(response.results);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [api, filters]);

  return {
    results,
    loading,
    search,
    filters,
    setFilters
  };
}
```

### Usage Example

```typescript
import { useSearch } from '@/hooks/useSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { SEARCH_TYPE, SEARCH_SORT } from '@/enums/SearchEnums';

function SearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const { results, loading, search, filters, setFilters } = useSearch();

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery);
    }
  }, [debouncedQuery, search]);

  return (
    <div>
      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />

      <Select
        value={filters.type}
        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
      >
        <MenuItem value={SEARCH_TYPE.ALL}>All</MenuItem>
        <MenuItem value={SEARCH_TYPE.NEWS}>News</MenuItem>
        <MenuItem value={SEARCH_TYPE.POLL}>Polls</MenuItem>
      </Select>

      <Select
        value={filters.sortBy}
        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
      >
        <MenuItem value={SEARCH_SORT.RELEVANCE}>Relevance</MenuItem>
        <MenuItem value={SEARCH_SORT.NEWEST}>Newest</MenuItem>
        <MenuItem value={SEARCH_SORT.OLDEST}>Oldest</MenuItem>
      </Select>

      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {results.map(result => (
            <SearchResultCard key={result.id} result={result} />
          ))}
        </List>
      )}
    </div>
  );
}
```

## Part 4: useDebounce

**Purpose:** Debounce rapidly changing values

**File:** `/src/hooks/useDebounce.ts`

### Implementation

```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### Usage Examples

#### Search Input

```typescript
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      // API call only happens after 500ms of no typing
      api.app.search.search({ query: debouncedQuery });
    }
  }, [debouncedQuery]);

  return (
    <TextField
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

#### Autocomplete

```typescript
function UserAutocomplete() {
  const [inputValue, setInputValue] = useState('');
  const debouncedInput = useDebounce(inputValue, 300);
  const [suggestions, setSuggestions] = useState<User[]>([]);

  useEffect(() => {
    if (debouncedInput.length >= 2) {
      api.app.user.searchUsers({ query: debouncedInput })
        .then(results => setSuggestions(results));
    }
  }, [debouncedInput]);

  return (
    <Autocomplete
      inputValue={inputValue}
      onInputChange={(_, value) => setInputValue(value)}
      options={suggestions}
      getOptionLabel={(user) => user.email}
      renderInput={(params) => <TextField {...params} />}
    />
  );
}
```

## Part 5: useLocalStorage

**Purpose:** Sync state with localStorage

**File:** `/src/hooks/useLocalStorage.ts`

### Implementation

```typescript
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Get initial value from localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
```

### Usage Examples

```typescript
function UserPreferences() {
  const [theme, setTheme] = useLocalStorage('theme_preference', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'en');

  return (
    <div>
      <Select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <MenuItem value="light">Light</MenuItem>
        <MenuItem value="dark">Dark</MenuItem>
      </Select>

      <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="tr">Turkish</MenuItem>
      </Select>
    </div>
  );
}
```

## Best Practices

### ✅ DO

1. **Use useApiCall for all mutations**
   ```typescript
   const { execute, loading } = useApiCall();
   await execute(() => api.app.news.createNews(data));
   ```

2. **Debounce search inputs**
   ```typescript
   const debouncedQuery = useDebounce(query, 500);
   ```

3. **Use cursor pagination for feeds**
   ```typescript
   const { items, loadMore, hasMore } = useCursorPagination(fetcher);
   ```

4. **Handle loading states**
   ```typescript
   if (loading) return <CircularProgress />;
   ```

5. **Refresh on filter changes**
   ```typescript
   useEffect(() => {
     refresh();
   }, [selectedTag, refresh]);
   ```

### ❌ DON'T

1. **Don't skip error handling**
   ```typescript
   // ❌ WRONG
   await api.app.news.createNews(data);

   // ✅ CORRECT
   const result = await execute(() => api.app.news.createNews(data));
   ```

2. **Don't forget debounce for search**
   ```typescript
   // ❌ WRONG - API call on every keystroke
   onChange={(e) => search(e.target.value)}

   // ✅ CORRECT - Debounce first
   const debouncedQuery = useDebounce(query, 500);
   useEffect(() => search(debouncedQuery), [debouncedQuery]);
   ```

3. **Don't use offset pagination for feeds**
   ```typescript
   // ❌ WRONG - Use cursor pagination
   const [page, setPage] = useState(1);

   // ✅ CORRECT
   const { items, loadMore } = useCursorPagination(fetcher);
   ```

## See Also

- [Quick Start Guide](/docs/QUICK_START.md) - Overview of frontend patterns
- [Context Guide](/src/contexts/README.md) - Context providers
- [API Guide](/src/APIs/README.md) - API client
- [Type System Guide](/src/types/README.md) - TypeScript types
