# API Client Guide

This guide explains the API client architecture and how to make API calls in the frontend.

## Quick Reference

| Method | Purpose | Returns | Use For |
|--------|---------|---------|---------|
| `_get<T>()` | GET single resource | `Promise<T>` | Fetch single entity |
| `_list<T>()` | GET list with pagination | `Promise<PaginatedResponse<T>>` | Paginated lists (admin tables) |
| `_listWithCursor<T>()` | GET with cursor pagination | `Promise<CursorPaginatedResponse<T>>` | Infinite scroll feeds |
| `_post<T>()` | POST create resource | `Promise<T>` | Create entities |
| `_put<T>()` | PUT update resource | `Promise<T>` | Update entities |
| `_delete<T>()` | DELETE resource | `Promise<T>` | Delete entities |

## Directory Structure

```
src/APIs/
├── index.ts              # Main API class
├── BaseAPI.ts            # Base HTTP client
├── NewsAPI.ts            # News endpoints
├── PollAPI.ts            # Poll endpoints
├── UserAPI.ts            # User endpoints
├── ChannelAPI.ts         # Channel endpoints
├── NotificationAPI.ts    # Notification endpoints
└── ...                   # Other API clients
```

## Part 1: API Architecture

### Main API Class

**File:** `/src/APIs/index.ts`

```typescript
import { BaseAPI } from './BaseAPI';
import { NewsAPI } from './NewsAPI';
import { PollAPI } from './PollAPI';
import { UserAPI } from './UserAPI';
// ... other imports

export class API {
  public app: {
    news: NewsAPI;
    poll: PollAPI;
    user: UserAPI;
    channel: ChannelAPI;
    notification: NotificationAPI;
    subscription: SubscriptionAPI;
    tag: TagAPI;
    expenseOrder: ExpenseOrderAPI;
    // ... other APIs
  };

  constructor(config: { baseURL: string; timeout?: number }) {
    // Initialize all API clients
    this.app = {
      news: new NewsAPI(config),
      poll: new PollAPI(config),
      user: new UserAPI(config),
      // ... other APIs
    };
  }
}
```

### BaseAPI Class

**File:** `/src/APIs/BaseAPI.ts`

```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { PaginatedResponse, CursorPaginatedResponse } from '@/types';

export class BaseAPI {
  protected client: AxiosInstance;

  constructor(config: { baseURL: string; timeout?: number }) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Request interceptor - add auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // GET single resource
  protected async _get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  // GET list with offset pagination
  protected async _list<T>(
    url: string,
    params?: Record<string, any>
  ): Promise<PaginatedResponse<T>> {
    const response = await this.client.get<PaginatedResponse<T>>(url, { params });
    return response.data;
  }

  // GET list with cursor pagination (CRITICAL for feeds!)
  protected async _listWithCursor<T>(
    url: string,
    params?: Record<string, any>
  ): Promise<CursorPaginatedResponse<T>> {
    const response = await this.client.get<CursorPaginatedResponse<T>>(url, { params });
    return response.data;
  }

  // POST create
  protected async _post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  // PUT update
  protected async _put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  // DELETE
  protected async _delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
}
```

## Part 2: Entity API Examples

### NewsAPI

**File:** `/src/APIs/NewsAPI.ts`

```typescript
import { BaseAPI } from './BaseAPI';
import {
  News,
  NewsBase,
  CreateNewsData,
  UpdateNewsData,
  NewsListResponse,
  CursorPaginatedResponse,
  PaginatedResponse
} from '@/types';

export class NewsAPI extends BaseAPI {
  // GET single news
  async getNewsById(id: string): Promise<News> {
    return this._get<News>(`/news/${id}`);
  }

  // GET paginated list (admin tables)
  async getNewsList(params: {
    page?: number;
    limit?: number;
    status?: string;
    channelId?: string;
  }): Promise<PaginatedResponse<NewsBase>> {
    return this._list<NewsBase>('/news', params);
  }

  // GET news feed with cursor pagination (CRITICAL - use _listWithCursor!)
  async getNewsFeed(params: {
    after?: string;
    limit?: number;
    tagIds?: string[];
  }): Promise<CursorPaginatedResponse<NewsBase>> {
    return this._listWithCursor<NewsBase>('/news/feed', params);
  }

  // POST create news
  async createNews(data: CreateNewsData): Promise<News> {
    return this._post<News>('/news', data);
  }

  // PUT update news
  async updateNews(id: string, data: UpdateNewsData): Promise<News> {
    return this._put<News>(`/news/${id}`, data);
  }

  // DELETE news
  async deleteNews(id: string): Promise<void> {
    return this._delete<void>(`/news/${id}`);
  }

  // POST publish news
  async publishNews(id: string): Promise<News> {
    return this._post<News>(`/news/${id}/publish`);
  }

  // GET news by tag
  async getNewsByTag(tagId: string, params: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<NewsBase>> {
    return this._list<NewsBase>(`/tags/${tagId}/news`, params);
  }
}
```

### NotificationAPI

**File:** `/src/APIs/NotificationAPI.ts`

```typescript
import { BaseAPI } from './BaseAPI';
import {
  Notification,
  CursorPaginatedResponse,
  UpdateNotificationData
} from '@/types';

export class NotificationAPI extends BaseAPI {
  // CRITICAL: Use _listWithCursor for feeds!
  async getNotificationFeed(params: {
    after?: string;
    limit?: number;
  }): Promise<CursorPaginatedResponse<Notification>> {
    return this._listWithCursor<Notification>('/notifications/feed', params);
  }

  // Mark as read
  async markAsRead(id: string): Promise<Notification> {
    return this._post<Notification>(`/notifications/${id}/read`);
  }

  // Mark all as read
  async markAllAsRead(): Promise<void> {
    return this._post<void>('/notifications/read-all');
  }

  // Delete notification
  async deleteNotification(id: string): Promise<void> {
    return this._delete<void>(`/notifications/${id}`);
  }
}
```

## Part 3: Usage Patterns

### Pattern 1: Fetch Single Entity

```typescript
import { useApiContext } from '@/contexts/ApiContext';
import { useState, useEffect } from 'react';
import { News } from '@/types';

function NewsDetail({ id }: { id: string }) {
  const { api } = useApiContext();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        // ✅ Use _get for single resource
        const data = await api.app.news.getNewsById(id);
        setNews(data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id, api]);

  if (loading) return <CircularProgress />;
  if (!news) return <Typography>News not found</Typography>;

  return <NewsCard news={news} />;
}
```

### Pattern 2: Offset Pagination (Admin Tables)

```typescript
import { useApiContext } from '@/contexts/ApiContext';
import { useState, useEffect } from 'react';
import { NewsBase, PaginatedResponse } from '@/types';
import { TablePagination } from '@mui/material';

function AdminNewsTable() {
  const { api } = useApiContext();
  const [page, setPage] = useState(0); // MUI: 0-indexed
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [data, setData] = useState<PaginatedResponse<NewsBase>>();

  useEffect(() => {
    const fetchNews = async () => {
      // ✅ Use _list for paginated data
      // CRITICAL: Convert page to 1-indexed for API
      const response = await api.app.news.getNewsList({
        page: page + 1, // API expects 1-indexed
        limit: rowsPerPage
      });
      setData(response);
    };

    fetchNews();
  }, [page, rowsPerPage, api]);

  return (
    <>
      <Table>
        <TableBody>
          {data?.items.map(news => (
            <TableRow key={news.id}>
              <TableCell>{news.title}</TableCell>
              <TableCell>{news.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        count={data?.metadata.total ?? 0}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </>
  );
}
```

### Pattern 3: Cursor Pagination (Infinite Scroll)

```typescript
import { useApiContext } from '@/contexts/ApiContext';
import { useCursorPagination } from '@/hooks/useCursorPagination';
import InfiniteScroll from 'react-infinite-scroll-component';

function NewsFeed() {
  const { api } = useApiContext();

  // ✅ Use _listWithCursor via custom hook
  const {
    items: news,
    loading,
    hasMore,
    loadMore
  } = useCursorPagination(
    async (cursor, limit) => {
      // CRITICAL: Use _listWithCursor method!
      return await api.app.news.getNewsFeed({
        after: cursor,
        limit
      });
    },
    { initialLimit: 20 }
  );

  return (
    <InfiniteScroll
      dataLength={news.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<CircularProgress />}
    >
      {news.map(item => <NewsCard key={item.id} news={item} />)}
    </InfiniteScroll>
  );
}
```

### Pattern 4: Create Entity

```typescript
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';
import { useNavigate } from 'react-router-dom';
import { CreateNewsData } from '@/types';

function CreateNewsForm() {
  const { api } = useApiContext();
  const navigate = useNavigate();
  const { execute, loading } = useApiCall();

  const handleSubmit = async (data: CreateNewsData) => {
    // ✅ Use _post via useApiCall hook
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

### Pattern 5: Update Entity

```typescript
function EditNewsForm({ newsId }: { newsId: string }) {
  const { api } = useApiContext();
  const { execute, loading } = useApiCall();

  const handleSubmit = async (data: UpdateNewsData) => {
    // ✅ Use _put via useApiCall hook
    const result = await execute(
      () => api.app.news.updateNews(newsId, data),
      {
        showSuccessMessage: true,
        successMessage: 'News updated successfully!'
      }
    );

    if (result) {
      // Handle success
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Pattern 6: Delete Entity

```typescript
function DeleteNewsButton({ newsId }: { newsId: string }) {
  const { api } = useApiContext();
  const { execute, loading } = useApiCall();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure?');
    if (!confirmed) return;

    // ✅ Use _delete via useApiCall hook
    const result = await execute(
      () => api.app.news.deleteNews(newsId),
      {
        showSuccessMessage: true,
        successMessage: 'News deleted successfully!'
      }
    );

    if (result !== null) {
      navigate('/news');
    }
  };

  return (
    <Button onClick={handleDelete} disabled={loading} color="error">
      {loading ? 'Deleting...' : 'Delete'}
    </Button>
  );
}
```

## Critical Rules

### ✅ DO

1. **Use _listWithCursor for feeds**
   ```typescript
   // ✅ CORRECT - Cursor pagination
   async getNewsFeed() {
     return this._listWithCursor<News>('/news/feed', params);
   }
   ```

2. **Convert page numbers for offset pagination**
   ```typescript
   // ✅ CORRECT - MUI page 0 → API page 1
   api.app.news.getNewsList({ page: page + 1, limit: rowsPerPage });
   ```

3. **Use typed responses**
   ```typescript
   const response: PaginatedResponse<News> = await api.app.news.getNewsList();
   ```

4. **Handle errors with useApiCall**
   ```typescript
   const { execute } = useApiCall();
   await execute(() => api.app.news.createNews(data));
   ```

### ❌ DON'T

1. **Don't use _get or _list for cursor endpoints**
   ```typescript
   // ❌ WRONG
   async getNewsFeed() {
     return this._list<News>('/news/feed'); // Missing cursor support!
   }

   // ✅ CORRECT
   async getNewsFeed() {
     return this._listWithCursor<News>('/news/feed', params);
   }
   ```

2. **Don't forget to convert page numbers**
   ```typescript
   // ❌ WRONG - Sends page 0 to API
   api.app.news.getNewsList({ page, limit });

   // ✅ CORRECT
   api.app.news.getNewsList({ page: page + 1, limit });
   ```

3. **Don't make raw axios calls**
   ```typescript
   // ❌ WRONG
   const response = await axios.get('/api/news');

   // ✅ CORRECT
   const news = await api.app.news.getNewsById(id);
   ```

## Authentication

Auth token is automatically added to all requests via interceptor:

```typescript
// In BaseAPI constructor
this.client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

Login stores token:
```typescript
async login(email: string, password: string) {
  const response = await api.app.auth.login({ email, password });
  localStorage.setItem('auth_token', response.token); // Stored for interceptor
  return response.user;
}
```

## Error Handling

401 errors automatically redirect to login:

```typescript
// In BaseAPI constructor
this.client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## See Also

- [Quick Start Guide](/docs/QUICK_START.md) - Overview of frontend patterns
- [Hooks Guide](/src/hooks/README.md) - useApiCall, useCursorPagination
- [Type System Guide](/src/types/README.md) - Request/Response types
- [Context Guide](/src/contexts/README.md) - ApiContext
