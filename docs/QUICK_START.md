# Frontend Quick Start Guide

Welcome to the journalist-material-client frontend! This guide helps you get oriented quickly in a new session.

## Project Overview

This is a React/TypeScript frontend for a journalism platform built with:
- **Framework:** React 18 with TypeScript
- **UI Library:** Material-UI (MUI)
- **Routing:** React Router v6
- **State Management:** React Context + React Hooks
- **Forms:** React Hook Form
- **Infinite Scroll:** React Infinite Scroll Component
- **Build Tool:** Vite

## Architecture Patterns

### Design Principles
- **Mobile-first approach** - All pages designed for mobile first, then desktop
- **Component-driven** - Reusable components in `/src/components`
- **Context-based state** - ApiContext, ProfileContext for global state
- **Type-safe APIs** - All API calls typed with TypeScript interfaces

### Key Directories
```
src/
├── components/         # Reusable UI components
├── pages/             # Page components (routes)
│   ├── admin/         # Admin-only pages
│   └── studio/        # Content creator pages
├── hooks/             # Custom React hooks
├── contexts/          # React Context providers
├── APIs/              # API client layer
├── types/             # TypeScript type definitions
│   ├── entities/      # Entity types (User, News, Poll, etc.)
│   ├── requests/      # Request payload types
│   ├── responses/     # Response payload types
│   └── ApiTypes.ts    # Shared API structures
├── enums/             # Enum definitions + helpers
├── constants/         # App constants (paths, etc.)
└── utils/             # Utility functions
```

## Critical Enum Pattern ⚠️

**CRITICAL:** Frontend uses **string enum keys exclusively** - NEVER use numeric enum values!

### Frontend Implementation:
```typescript
// src/enums/NewsEnums.ts
export const NEWS_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED"
} as const;

export type NewsStatus = typeof NEWS_STATUS[keyof typeof NEWS_STATUS];

// Helper functions for UI display
export function getNewsStatusLabel(status: NewsStatus): string {
  const labels: Record<NewsStatus, string> = {
    DRAFT: "Draft",
    PUBLISHED: "Published",
    ARCHIVED: "Archived"
  };
  return labels[status] || status;
}

export function getNewsStatusColor(status: NewsStatus): string {
  const colors: Record<NewsStatus, string> = {
    DRAFT: "warning",
    PUBLISHED: "success",
    ARCHIVED: "default"
  };
  return colors[status] || "default";
}

// Dropdown options
export const ALL_NEWS_STATUSES = [
  { value: NEWS_STATUS.DRAFT, label: "Draft" },
  { value: NEWS_STATUS.PUBLISHED, label: "Published" },
  { value: NEWS_STATUS.ARCHIVED, label: "Archived" }
] as const;
```

### Usage in Components:
```typescript
import { NEWS_STATUS, getNewsStatusLabel, getNewsStatusColor } from '@/enums/NewsEnums';

// ✅ CORRECT - Use enum constants
if (news.status === NEWS_STATUS.PUBLISHED) {
  // ...
}

// ✅ CORRECT - Use helper functions for display
<Chip
  label={getNewsStatusLabel(news.status)}
  color={getNewsStatusColor(news.status)}
/>

// ❌ WRONG - Never use numeric values
if (news.status === 3) { // NEVER DO THIS!
```

## Type System Architecture

### Central Export Point
**CRITICAL:** Always import types from `@/types`, not directly from subfolders!

```typescript
// ✅ CORRECT
import { News, CreateNewsData, NewsResponse } from '@/types';

// ❌ WRONG
import { News } from '@/types/entities/News';
```

### Type Organization

#### 1. Entity Types (`/src/types/entities/`)
Represent data models returned from the API:
```typescript
// src/types/entities/News.ts
export interface News {
  id: string;
  title: string;
  content: string;
  status: NewsStatus; // String enum type
  createdAt: Date;
  channel: Channel;
  creator: UserBase;
  tags: Tag[];
}
```

#### 2. Request Types (`/src/types/requests/`)
Payload structures for API calls:
```typescript
// src/types/requests/NewsRequests.ts
export interface CreateNewsData {
  title: string;
  content: string;
  status?: NewsStatus; // Optional, defaults to DRAFT
  channelId: string;
  tagIds?: string[];
}

export interface UpdateNewsData {
  title?: string;
  content?: string;
  status?: NewsStatus;
}
```

#### 3. Response Types (`/src/types/responses/`)
API response structures:
```typescript
// src/types/responses/NewsResponses.ts
export interface NewsResponse {
  news: News;
}

export interface NewsListResponse extends PaginatedResponse<News> {
  // Inherits items, metadata from PaginatedResponse
}
```

#### 4. Shared API Types (`/src/types/ApiTypes.ts`)
Common response structures used across all endpoints:

```typescript
// Offset-based pagination (admin tables)
export interface PaginatedResponse<T> {
  items: T[];
  metadata: PaginationMetadata;
}

export interface PaginationMetadata {
  offset: number;
  limit: number;
  total: number;
  pageCount: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Cursor-based pagination (infinite scroll feeds)
export interface CursorPaginatedResponse<T> {
  items: T[];
  metadata: CursorPaginationMetadata;
}

export interface CursorPaginationMetadata {
  limit: number;
  hasMore: boolean;
  nextCursor?: string; // Only present when hasMore is true
  prevCursor?: string;
}

// Simple list without pagination
export interface ListResponse<T> {
  items: T[];
}

// Query parameters
export interface PaginationQuery {
  page?: number;
  limit?: number;
}
```

## Pagination Patterns

### Offset-Based Pagination (Admin Tables)
**Use for:** Admin pages with table controls

**Key Facts:**
- MUI TablePagination uses **0-indexed pages** (page 0 = first page)
- Backend API expects **1-indexed pages** (page 1 = first page)
- **Always convert:** send `{ page: page + 1, limit: rowsPerPage }` to API

```typescript
import { useState } from 'react';
import { TablePagination } from '@mui/material';

function AdminNewsPage() {
  const [page, setPage] = useState(0); // MUI: 0-indexed
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const fetchNews = async () => {
    // Convert: MUI page 0 → API page 1
    const response = await api.app.news.getNewsList({
      page: page + 1, // CRITICAL: Add 1 for backend
      limit: rowsPerPage
    });
    // Response: { items: [...], metadata: { currentPage: 1, ... } }
  };

  return (
    <TablePagination
      count={metadata.total}
      page={page} // 0-indexed for MUI
      rowsPerPage={rowsPerPage}
      onPageChange={(_, newPage) => setPage(newPage)}
    />
  );
}
```

### Cursor-Based Pagination (Infinite Scroll)
**Use for:** News feeds, notification feeds, any scrollable list

**Key Facts:**
- Cursors are opaque strings - don't parse or modify them!
- `nextCursor` is only present when `hasMore` is true
- Always use `_listWithCursor()` method in API clients

```typescript
import { useCursorPagination } from '@/hooks/useCursorPagination';

function NewsFeed() {
  const {
    items,
    loading,
    hasMore,
    loadMore,
    refresh
  } = useCursorPagination(
    // Fetcher function
    async (cursor, limit) => {
      return await api.app.news.getNewsFeed({
        after: cursor, // Use cursor from previous response
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

### API Client Methods
```typescript
// ❌ WRONG - Don't use _get() or _list() for cursor pagination
const response = await this._list('/news/feed', { after: cursor });

// ✅ CORRECT - Use _listWithCursor() for cursor-based endpoints
const response = await this._listWithCursor<News>(
  '/news/feed',
  { after: cursor, limit: 20 }
);
```

## API Client Layer

### ApiContext Pattern
```typescript
import { useApiContext } from '@/contexts/ApiContext';

function MyComponent() {
  const { api } = useApiContext();

  const fetchNews = async () => {
    const response = await api.app.news.getNewsById('123');
    // response is typed as News
  };
}
```

### useApiCall Hook (Error Handling)
```typescript
import { useApiCall } from '@/hooks/useApiCall';

function CreateNewsPage() {
  const { api } = useApiContext();
  const { execute, loading } = useApiCall();

  const handleSubmit = async (data: CreateNewsData) => {
    const result = await execute(
      () => api.app.news.createNews(data),
      {
        showSuccessMessage: true,
        successMessage: 'News created successfully!',
        showErrorToast: true
      }
    );

    if (result) {
      // Navigate or update state
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

## Tag Filtering Pattern

**Critical:** Frontend enforces **single tag selection** only!

```typescript
import { TagFilter } from '@/components/TagFilter';

function NewsPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagChange = (tags: string[]) => {
    // TagFilter enforces single selection
    // Clicking new tag replaces previous selection
    // Clicking selected tag deselects it (shows "All")
    setSelectedTags(tags);
  };

  return (
    <TagFilter
      selectedTags={selectedTags}
      onTagChange={handleTagChange}
      // maxTags prop is ignored - always single selection
    />
  );
}
```

Backend supports multiple tags, but frontend limits to 1 for better UX and performance.

## Common Component Patterns

### Form Handling with React Hook Form
```typescript
import { useForm, Controller } from 'react-hook-form';
import { TextField, Select, MenuItem } from '@mui/material';

function NewsForm() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      status: NEWS_STATUS.DRAFT
    }
  });

  const onSubmit = async (data: CreateNewsData) => {
    // API call
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="title"
        control={control}
        rules={{ required: 'Title is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        )}
      />

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <Select {...field}>
            {ALL_NEWS_STATUSES.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </form>
  );
}
```

### Enum Display in Tables
```typescript
import { Chip } from '@mui/material';
import { getNewsStatusLabel, getNewsStatusColor } from '@/enums/NewsEnums';

function NewsTable({ news }: { news: News[] }) {
  return (
    <Table>
      <TableBody>
        {news.map(item => (
          <TableRow key={item.id}>
            <TableCell>{item.title}</TableCell>
            <TableCell>
              <Chip
                label={getNewsStatusLabel(item.status)}
                color={getNewsStatusColor(item.status)}
                size="small"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

## Common Pitfalls & Solutions

### 1. Using Numeric Enum Values
**Problem:** Comparing `status === 3` instead of using enum constants
**Solution:** Always use enum constants: `status === NEWS_STATUS.PUBLISHED`

### 2. Direct Type Imports
**Problem:** Importing from subfolders instead of central export
**Solution:** Always import from `@/types`: `import { News } from '@/types'`

### 3. Wrong Pagination Conversion
**Problem:** Sending MUI page index (0-indexed) directly to API
**Solution:** Add 1: `api.getNews({ page: page + 1 })`

### 4. Manual Cursor Pagination
**Problem:** Not using `useCursorPagination` hook, managing state manually
**Solution:** Use the hook for consistent infinite scroll behavior

### 5. Wrong API Method for Cursor Pagination
**Problem:** Using `_get()` or `_list()` for cursor endpoints
**Solution:** Use `_listWithCursor()` for cursor-based endpoints

### 6. Column ID Mismatch in Admin Tables
**Problem:** Column IDs don't match entity property names
**Solution:** Always check entity type files, use exact camelCase property names

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build
npm run build

# Type checking
npm run type-check

# Preview production build
npm run preview
```

## Next Steps

1. **Working with enums?** → See [/src/enums/README.md](../src/enums/README.md)
2. **Understanding types?** → See [/src/types/README.md](../src/types/README.md)
3. **Creating components?** → See [/src/components/README.md](../src/components/README.md)
4. **API integration?** → See [/src/APIs/README.md](../src/APIs/README.md)

## Key Files to Reference

- `/CLAUDE.md` - Comprehensive project rules and patterns
- `/src/types/index.ts` - Central type export point
- `/src/types/ApiTypes.ts` - Shared API response structures
- `/src/hooks/useCursorPagination.ts` - Infinite scroll hook
- `/src/hooks/useApiCall.ts` - API error handling hook
- `/src/contexts/ApiContext.tsx` - API client access
- `/src/contexts/ProfileContext.tsx` - User profile state
