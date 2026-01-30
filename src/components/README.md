# Components Guide

Reusable UI components following Material-UI design system.

## Quick Reference

| Component Category | Purpose | Examples |
|-------------------|---------|----------|
| **Common** | Shared UI elements | `TagFilter`, `LoadingSpinner`, `ErrorBoundary` |
| **Feature-Specific** | Domain components | `NewsCard`, `PollCard`, `ExpenseOrderForm` |
| **Layout** | Page structure | `AppBar`, `Sidebar`, `PageContainer` |
| **Forms** | Input components | `NewsForm`, `PollForm`, `SearchInput` |

## Directory Structure

```
src/components/
├── common/              # Shared components
│   ├── TagFilter.tsx
│   ├── LoadingSpinner.tsx
│   ├── ErrorBoundary.tsx
│   └── ConfirmDialog.tsx
├── news/                # News-specific
│   ├── NewsCard.tsx
│   ├── NewsList.tsx
│   └── NewsForm.tsx
├── poll/                # Poll-specific
│   ├── PollCard.tsx
│   ├── PollOptionList.tsx
│   └── PollForm.tsx
├── expense-order/       # Expense order components
│   └── ExpenseOrderForm.tsx
├── layout/              # Layout components
│   ├── AppBar.tsx
│   ├── Sidebar.tsx
│   └── PageContainer.tsx
└── admin/               # Admin components
    └── AdminTable.tsx
```

## Design Principles

### Mobile-First Approach
All components are designed for mobile first, then enhanced for larger screens.

```typescript
// ✅ CORRECT - Mobile-first responsive design
const styles = {
  container: {
    padding: 2,           // Mobile
    [theme.breakpoints.up('md')]: {
      padding: 4          // Desktop
    }
  },
  fontSize: {
    fontSize: '0.875rem', // Mobile
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem'    // Desktop
    }
  }
};
```

### Component Patterns

#### 1. Display Components (Cards, Lists)

**Example: NewsCard.tsx**

```typescript
import { Card, CardContent, Typography, Chip } from '@mui/material';
import { News } from '@/types';
import { getNewsStatusLabel, getNewsStatusColor } from '@/enums/NewsEnums';
import { formatRelativeTime } from '@/utils/dateUtils';

interface NewsCardProps {
  news: News;
  onClick?: () => void;
}

export function NewsCard({ news, onClick }: NewsCardProps) {
  return (
    <Card onClick={onClick} sx={{ cursor: onClick ? 'pointer' : 'default' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {news.title}
        </Typography>

        {/* Use enum helper for status display */}
        <Chip
          label={getNewsStatusLabel(news.status)}
          color={getNewsStatusColor(news.status)}
          size="small"
        />

        {/* Use utility for date formatting */}
        <Typography variant="caption" color="text.secondary">
          {formatRelativeTime(news.createdAt)}
        </Typography>

        <Typography variant="body2">
          {news.excerpt}
        </Typography>
      </CardContent>
    </Card>
  );
}
```

#### 2. Form Components

**Example: NewsForm.tsx**

```typescript
import { useForm, Controller } from 'react-hook-form';
import { TextField, Select, MenuItem, Button } from '@mui/material';
import { CreateNewsData, Channel } from '@/types';
import { NEWS_STATUS, ALL_NEWS_STATUSES } from '@/enums/NewsEnums';

interface NewsFormProps {
  initialData?: Partial<CreateNewsData>;
  channels: Channel[];
  onSubmit: (data: CreateNewsData) => Promise<void>;
  loading?: boolean;
}

export function NewsForm({ initialData, channels, onSubmit, loading }: NewsFormProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<CreateNewsData>({
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      status: initialData?.status || NEWS_STATUS.DRAFT,
      channelId: initialData?.channelId || ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="title"
        control={control}
        rules={{ required: 'Title is required', minLength: 5 }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Title"
            fullWidth
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        )}
      />

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <Select {...field} fullWidth>
            {ALL_NEWS_STATUSES.map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        )}
      />

      <Controller
        name="channelId"
        control={control}
        rules={{ required: 'Channel is required' }}
        render={({ field }) => (
          <Select
            {...field}
            fullWidth
            error={!!errors.channelId}
          >
            {channels.map(channel => (
              <MenuItem key={channel.id} value={channel.id}>
                {channel.name}
              </MenuItem>
            ))}
          </Select>
        )}
      />

      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
}
```

#### 3. Common Components

**TagFilter Component**

CRITICAL: Enforces single tag selection only!

```typescript
import { Chip, Box } from '@mui/material';
import { Tag } from '@/types';

interface TagFilterProps {
  tags: Tag[];
  selectedTags: string[];
  onTagChange: (tagIds: string[]) => void;
}

export function TagFilter({ tags, selectedTags, onTagChange }: TagFilterProps) {
  const handleTagClick = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      // Deselect - show "All"
      onTagChange([]);
    } else {
      // Replace previous selection with new tag
      onTagChange([tagId]);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <Chip
        label="All"
        onClick={() => onTagChange([])}
        color={selectedTags.length === 0 ? 'primary' : 'default'}
      />

      {tags.map(tag => (
        <Chip
          key={tag.id}
          label={tag.name}
          onClick={() => handleTagClick(tag.id)}
          color={selectedTags.includes(tag.id) ? 'primary' : 'default'}
        />
      ))}
    </Box>
  );
}
```

**LoadingSpinner Component**

```typescript
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  fullPage?: boolean;
}

export function LoadingSpinner({ message = 'Loading...', fullPage = false }: LoadingSpinnerProps) {
  const styles = fullPage
    ? { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }
    : { display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 };

  return (
    <Box sx={styles}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress />
        {message && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
```

**ErrorBoundary Component**

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {this.state.error?.message}
          </Typography>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
```

#### 4. Admin Components

**AdminTable Component**

```typescript
import { Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
import { useState } from 'react';

interface Column<T> {
  id: keyof T;
  label: string;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  total: number;
  onPageChange: (page: number, rowsPerPage: number) => void;
}

export function AdminTable<T extends { id: string }>({
  columns,
  data,
  total,
  onPageChange
}: AdminTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
    onPageChange(newPage, rowsPerPage);
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={String(column.id)} width={column.width}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.id}>
              {columns.map(column => (
                <TableCell key={String(column.id)}>
                  {column.render
                    ? column.render(row[column.id], row)
                    : String(row[column.id])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        count={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </>
  );
}
```

## Best Practices

### ✅ DO

1. **Use TypeScript interfaces for props**
   ```typescript
   interface NewsCardProps {
     news: News;
     onClick?: () => void;
   }
   ```

2. **Use enum helpers for display**
   ```typescript
   <Chip label={getNewsStatusLabel(news.status)} />
   ```

3. **Use utility functions**
   ```typescript
   {formatRelativeTime(news.createdAt)}
   ```

4. **Handle loading states**
   ```typescript
   if (loading) return <LoadingSpinner />;
   ```

5. **Make components reusable**
   ```typescript
   <NewsCard news={news} onClick={() => navigate(`/news/${news.id}`)} />
   ```

### ❌ DON'T

1. **Don't hardcode strings**
   ```typescript
   // ❌ WRONG
   <Chip label="Published" />

   // ✅ CORRECT
   <Chip label={getNewsStatusLabel(news.status)} />
   ```

2. **Don't use magic numbers**
   ```typescript
   // ❌ WRONG
   if (news.status === 3) { }

   // ✅ CORRECT
   if (news.status === NEWS_STATUS.PUBLISHED) { }
   ```

3. **Don't duplicate component logic**
   ```typescript
   // ✅ CORRECT - Create reusable component
   <NewsCard news={news} />
   ```

## Component Checklist

When creating a new component:

- [ ] TypeScript interface for props
- [ ] Proper prop validation
- [ ] Loading state handling
- [ ] Error state handling
- [ ] Empty state handling
- [ ] Mobile-responsive design
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] Use enum helpers for status display
- [ ] Use utility functions for formatting
- [ ] Export from component folder's index.ts

## See Also

- [Quick Start Guide](/docs/QUICK_START.md)
- [Type System Guide](/src/types/README.md)
- [Enum Guide](/src/enums/README.md)
- [Utils Guide](/src/utils/README.md)
