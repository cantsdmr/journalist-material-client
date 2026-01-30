# Type System Guide

This guide explains the TypeScript type system architecture in the frontend application.

## Quick Reference

| Type Category | Location | Purpose | Example |
|---------------|----------|---------|---------|
| **Entities** | `/src/types/entities/` | Data models from API | `News`, `User`, `Poll` |
| **Requests** | `/src/types/requests/` | API request payloads | `CreateNewsData`, `UpdateUserData` |
| **Responses** | `/src/types/responses/` | API response structures | `NewsResponse`, `UserListResponse` |
| **Shared API** | `/src/types/ApiTypes.ts` | Pagination, common structures | `PaginatedResponse<T>`, `CursorPaginatedResponse<T>` |
| **Enums** | `/src/enums/` | String enum types | `NewsStatus`, `UserRole` |

## Critical Rules

1. **Always import from central export** (`@/types`) - NEVER from subfolders
2. **Entity types must match backend DTOs exactly** - Check backend service DTOs
3. **Use string enum types** - Never numeric values
4. **Property names are camelCase** - Matches backend @Expose decorators

## Directory Structure

```
src/types/
├── index.ts              # Central export point (import from here!)
├── ApiTypes.ts           # Shared API structures
├── entities/             # Data models
│   ├── Account.ts
│   ├── Channel.ts
│   ├── News.ts
│   ├── Poll.ts
│   ├── User.ts
│   ├── Notification.ts
│   ├── Subscription.ts
│   ├── Tag.ts
│   └── ...
├── requests/             # API request payloads
│   ├── NewsRequests.ts
│   ├── UserRequests.ts
│   ├── PollRequests.ts
│   ├── NotificationRequests.ts
│   └── ...
└── responses/            # API response structures
    ├── NewsResponses.ts
    ├── UserResponses.ts
    ├── PollResponses.ts
    └── ...
```

## Part 1: Entity Types

Entity types represent data models returned from the API. They match backend Service DTOs exactly.

### Basic Entity Example

**File:** `/src/types/entities/News.ts`

```typescript
import { NewsStatus } from '@/enums/NewsEnums';
import { Channel } from './Channel';
import { UserBase } from './User';
import { Tag } from './Tag';
import { NewsMedia } from './NewsMedia';

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  status: NewsStatus; // String enum: "DRAFT" | "PUBLISHED" | ...

  // Relations
  channel: Channel;
  creator: UserBase;
  tags: Tag[];
  media: NewsMedia[];

  // Metadata
  viewCount: number;
  likeCount: number;
  commentCount: number;

  // Computed fields
  isBookmarked?: boolean; // From user-specific JOIN

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface NewsBase {
  id: string;
  title: string;
  excerpt?: string;
  status: NewsStatus;
  channel: Channel;
  creator: UserBase;
  createdAt: Date;
}
```

**Key Points:**
- Property names are **camelCase** (matches backend `@Expose` decorators)
- Enum fields use **string literal union types** (`NewsStatus`)
- Relations are typed with other entity interfaces
- Optional fields use `?` (nullable in backend)
- Computed fields like `isBookmarked` come from backend JOINs

### Entity with Nested Relations

**File:** `/src/types/entities/Poll.ts`

```typescript
import { PollStatus } from '@/enums/PollEnums';
import { Channel } from './Channel';
import { UserBase } from './User';
import { Tag } from './Tag';
import { PollOption } from './PollOption';
import { PollGoal } from './PollGoal';

export interface Poll {
  id: string;
  title: string;
  description?: string;
  status: PollStatus;

  // Poll-specific fields
  startDate: Date;
  endDate: Date;
  voteCount: number;

  // Relations (nested entities)
  channel: Channel;
  creator: UserBase;
  tags: Tag[];
  options: PollOption[];
  goals: PollGoal[];

  // Computed
  isBookmarked?: boolean;
  hasVoted?: boolean; // User-specific

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
  pollId: string;
}

export interface PollGoal {
  id: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  pollId: string;
}
```

### User Entity Hierarchy

**File:** `/src/types/entities/User.ts`

```typescript
import { UserRole, UserStatus } from '@/enums/UserEnums';

// Base user info (minimal)
export interface UserBase {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: UserRole; // "USER" | "JOURNALIST" | "ADMIN" | "SUPER_ADMIN"
  status: UserStatus; // "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BANNED"
}

// Full user profile
export interface User extends UserBase {
  bio?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;

  // Staff channels (if journalist)
  staffChannels?: ChannelStaff[];

  // Subscription info
  subscriptions?: ChannelSubscription[];

  // Settings
  emailVerified: boolean;
  twoFactorEnabled: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// Channel staff relationship
export interface ChannelStaff {
  id: string;
  userId: string;
  channelId: string;
  role: string; // "OWNER" | "EDITOR" | "CONTRIBUTOR"
  channel: Channel; // Nested relation
  joinedAt: Date;
}
```

### Matching Backend DTOs

**CRITICAL:** Frontend entity types must match backend Service DTOs exactly!

**Backend DTO:**
```typescript
// journalist-api/src/services/news/dto/NewsBaseDto.ts
export class NewsBaseDto {
  @Expose({ name: 'id' })
  id!: string;

  @Expose({ name: 'title' })
  title!: string;

  @EnumField(Enums.NewsStatus, { name: 'status' })
  status!: keyof typeof Enums.NewsStatus; // Returns "PUBLISHED"

  @Expose({ name: 'created_at' })
  createdAt!: Date;
}
```

**Frontend Entity:**
```typescript
// journalist-material-client/src/types/entities/News.ts
export interface News {
  id: string;           // ✅ Matches backend 'id'
  title: string;        // ✅ Matches backend 'title'
  status: NewsStatus;   // ✅ Matches backend 'status' (string enum)
  createdAt: Date;      // ✅ Matches backend 'createdAt' (camelCase!)
}
```

## Part 2: Request Types

Request types define the shape of data sent TO the API.

**File:** `/src/types/requests/NewsRequests.ts`

```typescript
import { NewsStatus } from '@/enums/NewsEnums';

// Create news request
export interface CreateNewsData {
  title: string;
  content: string;
  excerpt?: string;
  status?: NewsStatus; // Optional, defaults to DRAFT on backend
  channelId: string;
  tagIds?: string[];
  mediaIds?: string[];
}

// Update news request
export interface UpdateNewsData {
  title?: string;
  content?: string;
  excerpt?: string;
  status?: NewsStatus;
  tagIds?: string[];
  mediaIds?: string[];
}

// Get news list request (query params)
export interface GetNewsListParams {
  page?: number;
  limit?: number;
  status?: NewsStatus;
  channelId?: string;
  tagIds?: string[];
}
```

**Usage in API calls:**
```typescript
import { CreateNewsData } from '@/types';

const createNews = async (data: CreateNewsData) => {
  return api.app.news.createNews(data);
  // Request body: { "title": "...", "status": "DRAFT", ... }
};
```

## Part 3: Response Types

Response types define the shape of data received FROM the API.

**File:** `/src/types/responses/NewsResponses.ts`

```typescript
import { News, NewsBase } from '@/types/entities/News';
import { PaginatedResponse, ListResponse } from '@/types/ApiTypes';

// Single news response
export interface NewsResponse {
  news: News;
}

// Paginated news list
export interface NewsListResponse extends PaginatedResponse<NewsBase> {
  // Inherits: items: NewsBase[], metadata: PaginationMetadata
}

// Simple news list (no pagination)
export interface NewsArrayResponse extends ListResponse<NewsBase> {
  // Inherits: items: NewsBase[]
}
```

**Usage:**
```typescript
const response: NewsResponse = await api.app.news.getNewsById('123');
const news: News = response.news;

const listResponse: NewsListResponse = await api.app.news.getNewsList({ page: 1 });
const newsList: NewsBase[] = listResponse.items;
const total: number = listResponse.metadata.total;
```

## Part 4: Shared API Types

**File:** `/src/types/ApiTypes.ts`

### Offset-Based Pagination

```typescript
export interface PaginatedResponse<T> {
  items: T[];
  metadata: PaginationMetadata;
}

export interface PaginationMetadata {
  offset: number;      // Starting index
  limit: number;       // Items per page
  total: number;       // Total items
  pageCount: number;   // Total pages
  currentPage: number; // Current page (1-indexed)
  hasNext: boolean;    // Has next page
  hasPrev: boolean;    // Has previous page
}

export interface PaginationQuery {
  page?: number;       // Page number (1-indexed for API)
  limit?: number;      // Items per page
}
```

**Usage with MUI TablePagination:**
```typescript
import { useState } from 'react';
import { PaginatedResponse, News } from '@/types';

function NewsTable() {
  const [page, setPage] = useState(0); // MUI: 0-indexed
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [data, setData] = useState<PaginatedResponse<News>>();

  useEffect(() => {
    const fetchNews = async () => {
      const response = await api.app.news.getNewsList({
        page: page + 1, // Convert to 1-indexed for API
        limit: rowsPerPage
      });
      setData(response);
    };
    fetchNews();
  }, [page, rowsPerPage]);

  return (
    <TablePagination
      count={data?.metadata.total ?? 0}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={(_, newPage) => setPage(newPage)}
    />
  );
}
```

### Cursor-Based Pagination

```typescript
export interface CursorPaginatedResponse<T> {
  items: T[];
  metadata: CursorPaginationMetadata;
}

export interface CursorPaginationMetadata {
  limit: number;           // Items per page
  hasMore: boolean;        // Has more items
  nextCursor?: string;     // Next page cursor (only if hasMore is true)
  prevCursor?: string;     // Previous page cursor
}

export interface CursorPaginationQuery {
  after?: string;  // Cursor for next page
  before?: string; // Cursor for previous page
  limit?: number;  // Items per page
}
```

**Usage with Infinite Scroll:**
```typescript
import { useCursorPagination } from '@/hooks/useCursorPagination';
import { News } from '@/types';

function NewsFeed() {
  const {
    items,
    loading,
    hasMore,
    loadMore
  } = useCursorPagination<News>(
    async (cursor, limit) => {
      return await api.app.news.getNewsFeed({
        after: cursor,
        limit
      });
    },
    { initialLimit: 20 }
  );

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<CircularProgress />}
    >
      {items.map(news => <NewsCard key={news.id} news={news} />)}
    </InfiniteScroll>
  );
}
```

### Simple List Response

```typescript
export interface ListResponse<T> {
  items: T[];
}
```

**Usage:**
```typescript
const response: ListResponse<Tag> = await api.app.tags.getAllTags();
const tags: Tag[] = response.items;
```

## Part 5: Central Export

**File:** `/src/types/index.ts`

```typescript
// ✅ CRITICAL: This is the ONLY file you should import from!

// Entities
export type { News, NewsBase } from './entities/News';
export type { Poll, PollOption, PollGoal } from './entities/Poll';
export type { User, UserBase, ChannelStaff } from './entities/User';
export type { Channel } from './entities/Channel';
export type { Tag } from './entities/Tag';
export type { Notification } from './entities/Notification';
export type { Subscription } from './entities/Subscription';
// ... all other entities

// Requests
export type { CreateNewsData, UpdateNewsData, GetNewsListParams } from './requests/NewsRequests';
export type { CreateUserData, UpdateUserData } from './requests/UserRequests';
// ... all other requests

// Responses
export type { NewsResponse, NewsListResponse } from './responses/NewsResponses';
export type { UserResponse, UserListResponse } from './responses/UserResponses';
// ... all other responses

// Shared API types
export type {
  PaginatedResponse,
  PaginationMetadata,
  PaginationQuery,
  CursorPaginatedResponse,
  CursorPaginationMetadata,
  CursorPaginationQuery,
  ListResponse
} from './ApiTypes';

// Enums (re-export from enums folder)
export type { NewsStatus } from '@/enums/NewsEnums';
export type { UserRole, UserStatus } from '@/enums/UserEnums';
export type { PollStatus } from '@/enums/PollEnums';
// ... all other enum types
```

**Usage everywhere:**
```typescript
// ✅ CORRECT - Import from central export
import { News, CreateNewsData, NewsResponse, NewsStatus } from '@/types';

// ❌ WRONG - Don't import from subfolders!
import { News } from '@/types/entities/News';
import { CreateNewsData } from '@/types/requests/NewsRequests';
```

## Common Patterns

### Pattern 1: Generic Component with Entity Type

```typescript
import { News, Poll } from '@/types';

interface CardProps<T extends News | Poll> {
  item: T;
  onSelect: (item: T) => void;
}

function Card<T extends News | Poll>({ item, onSelect }: CardProps<T>) {
  return (
    <div onClick={() => onSelect(item)}>
      <h3>{item.title}</h3>
      <Chip label={item.status} />
    </div>
  );
}
```

### Pattern 2: Type-Safe API Calls

```typescript
import { News, CreateNewsData, NewsResponse } from '@/types';

class NewsAPI extends BaseAPI {
  async getNewsById(id: string): Promise<News> {
    const response = await this._get<NewsResponse>(`/news/${id}`);
    return response.news;
  }

  async createNews(data: CreateNewsData): Promise<News> {
    const response = await this._post<NewsResponse>('/news', data);
    return response.news;
  }

  async getNewsList(params: GetNewsListParams): Promise<NewsListResponse> {
    return this._list<NewsBase>('/news', params);
  }
}
```

### Pattern 3: Form with Request Type

```typescript
import { useForm } from 'react-hook-form';
import { CreateNewsData } from '@/types';
import { NEWS_STATUS } from '@/enums/NewsEnums';

function CreateNewsForm() {
  const { control, handleSubmit } = useForm<CreateNewsData>({
    defaultValues: {
      title: '',
      content: '',
      status: NEWS_STATUS.DRAFT,
      channelId: ''
    }
  });

  const onSubmit = async (data: CreateNewsData) => {
    await api.app.news.createNews(data);
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

### Pattern 4: State with Paginated Response

```typescript
import { useState, useEffect } from 'react';
import { NewsListResponse, News } from '@/types';

function NewsPage() {
  const [response, setResponse] = useState<NewsListResponse>();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchNews = async () => {
      const data = await api.app.news.getNewsList({ page, limit: 20 });
      setResponse(data);
    };
    fetchNews();
  }, [page]);

  const newsList: News[] = response?.items ?? [];
  const total: number = response?.metadata.total ?? 0;

  return <div>...</div>;
}
```

## Best Practices

### ✅ DO

1. **Always import from central export**
   ```typescript
   import { News, CreateNewsData } from '@/types';
   ```

2. **Match backend DTO property names exactly**
   ```typescript
   // Backend: @Expose({ name: 'created_at' }) createdAt!: Date;
   // Frontend: createdAt: Date; ✅
   ```

3. **Use string enum types**
   ```typescript
   status: NewsStatus; // "DRAFT" | "PUBLISHED" | ...
   ```

4. **Mark optional fields correctly**
   ```typescript
   bio?: string;        // Optional in backend
   avatarUrl?: string;  // Nullable in backend
   ```

5. **Type API responses properly**
   ```typescript
   const response: NewsResponse = await api.app.news.getNewsById('123');
   ```

### ❌ DON'T

1. **Don't import from subfolders**
   ```typescript
   // ❌ WRONG
   import { News } from '@/types/entities/News';
   ```

2. **Don't use numeric enum types**
   ```typescript
   // ❌ WRONG
   status: number; // Should be NewsStatus
   ```

3. **Don't mismatch backend property names**
   ```typescript
   // ❌ WRONG - Backend sends 'createdAt', not 'created_at'
   created_at: Date;
   ```

4. **Don't create duplicate types**
   ```typescript
   // ❌ WRONG - Use existing News type
   interface MyNews { id: string; title: string; }
   ```

## Type Guards

**File:** `/src/utils/typeGuards.ts`

```typescript
import { News, Poll } from '@/types';
import { NEWS_STATUS, POLL_STATUS } from '@/enums';

export function isNews(item: News | Poll): item is News {
  return 'content' in item; // News has content, Poll doesn't
}

export function isPoll(item: News | Poll): item is Poll {
  return 'options' in item; // Poll has options, News doesn't
}

export function isPublishedNews(news: News): news is News & { status: typeof NEWS_STATUS.PUBLISHED } {
  return news.status === NEWS_STATUS.PUBLISHED;
}
```

**Usage:**
```typescript
function handleItem(item: News | Poll) {
  if (isNews(item)) {
    // TypeScript knows item is News
    console.log(item.content);
  } else {
    // TypeScript knows item is Poll
    console.log(item.options);
  }
}
```

## Troubleshooting

### Problem: Type error "Property does not exist on type"

**Cause:** Importing from subfolder instead of central export

**Solution:**
```typescript
// ❌ WRONG
import { News } from '@/types/entities/News';

// ✅ CORRECT
import { News } from '@/types';
```

### Problem: API response property mismatch

**Cause:** Frontend type doesn't match backend DTO

**Solution:** Check backend Service DTO file:
```typescript
// Backend: journalist-api/src/services/news/dto/NewsBaseDto.ts
@Expose({ name: 'created_at' })
createdAt!: Date; // Backend sends 'createdAt' in camelCase

// Frontend must match:
createdAt: Date; // ✅ Matches backend
```

### Problem: Enum type error

**Cause:** Using number instead of string enum type

**Solution:**
```typescript
// ❌ WRONG
status: number;

// ✅ CORRECT
import { NewsStatus } from '@/types';
status: NewsStatus; // "DRAFT" | "PUBLISHED" | ...
```

## See Also

- [Quick Start Guide](/docs/QUICK_START.md) - Overview of frontend patterns
- [Enum Guide](/src/enums/README.md) - String enum patterns
- [API Guide](/src/APIs/README.md) - API client implementation
- [Hooks Guide](/src/hooks/README.md) - Custom hooks for data fetching
