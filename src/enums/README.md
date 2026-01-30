# Frontend Enums Guide

This guide explains the enum pattern used in the frontend: **string enum keys exclusively throughout the entire application**.

## Quick Reference

**CRITICAL:** Frontend uses string enum keys ONLY - NEVER use numeric values!

| Context | Enum Type | Example | Valid |
|---------|-----------|---------|-------|
| **API Request** | String key | `{ "status": "PUBLISHED" }` | ✅ |
| **API Response** | String key | `{ "status": "PUBLISHED" }` | ✅ |
| **Component State** | String key | `const [status, setStatus] = useState("DRAFT")` | ✅ |
| **Comparisons** | String key | `news.status === NEWS_STATUS.PUBLISHED` | ✅ |
| **Type Annotations** | String literal | `status: NewsStatus` | ✅ |
| **Numeric values** | Number | `status === 3` | ❌ NEVER! |

## The Pattern

### 1. Define String Enum with Helper Functions

Every enum file follows this exact pattern:

```typescript
// src/enums/NewsEnums.ts

// 1. Define enum object with string keys
export const NEWS_STATUS = {
  DRAFT: "DRAFT",
  IN_REVIEW: "IN_REVIEW",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
  DELETED: "DELETED"
} as const;

// 2. Export type for type safety
export type NewsStatus = typeof NEWS_STATUS[keyof typeof NEWS_STATUS];
// Type: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED" | "DELETED"

// 3. Helper function for UI labels
export function getNewsStatusLabel(status: NewsStatus): string {
  const labels: Record<NewsStatus, string> = {
    DRAFT: "Draft",
    IN_REVIEW: "In Review",
    PUBLISHED: "Published",
    ARCHIVED: "Archived",
    DELETED: "Deleted"
  };
  return labels[status] || status;
}

// 4. Helper function for UI colors (MUI Chip colors)
export function getNewsStatusColor(status: NewsStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  const colors: Record<NewsStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
    DRAFT: "warning",
    IN_REVIEW: "info",
    PUBLISHED: "success",
    ARCHIVED: "default",
    DELETED: "error"
  };
  return colors[status] || "default";
}

// 5. Dropdown options for Select/Autocomplete components
export const ALL_NEWS_STATUSES = [
  { value: NEWS_STATUS.DRAFT, label: "Draft" },
  { value: NEWS_STATUS.IN_REVIEW, label: "In Review" },
  { value: NEWS_STATUS.PUBLISHED, label: "Published" },
  { value: NEWS_STATUS.ARCHIVED, label: "Archived" },
  { value: NEWS_STATUS.DELETED, label: "Deleted" }
] as const;
```

### 2. Type System Integration

```typescript
// src/types/entities/News.ts
import { NewsStatus } from '@/enums/NewsEnums';

export interface News {
  id: string;
  title: string;
  content: string;
  status: NewsStatus; // Type: "DRAFT" | "PUBLISHED" | ...
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. Component Usage - Display

```typescript
// src/components/NewsCard.tsx
import { Chip } from '@mui/material';
import { NEWS_STATUS, getNewsStatusLabel, getNewsStatusColor } from '@/enums/NewsEnums';
import { News } from '@/types';

interface NewsCardProps {
  news: News;
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{news.title}</Typography>

        {/* ✅ Use helper functions for display */}
        <Chip
          label={getNewsStatusLabel(news.status)}
          color={getNewsStatusColor(news.status)}
          size="small"
        />

        {/* ✅ Use enum constants for comparisons */}
        {news.status === NEWS_STATUS.PUBLISHED && (
          <Typography variant="caption">
            Published on {new Date(news.publishedAt).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
```

### 4. Component Usage - Forms

```typescript
// src/components/NewsForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { Select, MenuItem } from '@mui/material';
import { NEWS_STATUS, ALL_NEWS_STATUSES, NewsStatus } from '@/enums/NewsEnums';
import { CreateNewsData } from '@/types';

export function NewsForm() {
  const { control, handleSubmit } = useForm<CreateNewsData>({
    defaultValues: {
      title: '',
      content: '',
      status: NEWS_STATUS.DRAFT // ✅ Use enum constant for default
    }
  });

  const onSubmit = async (data: CreateNewsData) => {
    // data.status is already a string enum key
    await api.app.news.createNews(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <Select {...field}>
            {/* ✅ Use ALL_NEWS_STATUSES for dropdown options */}
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

### 5. API Integration

```typescript
// src/APIs/NewsAPI.ts
import { NewsStatus } from '@/enums/NewsEnums';

export interface CreateNewsParams {
  title: string;
  content: string;
  status?: NewsStatus; // Type-safe: only accepts string enum keys
}

class NewsAPI extends BaseAPI {
  async createNews(params: CreateNewsParams): Promise<News> {
    // ✅ API receives string enum keys directly
    return this._post<News>('/news', params);
    // Request body: { "title": "...", "status": "DRAFT" }
  }

  async getNewsByStatus(status: NewsStatus): Promise<News[]> {
    // ✅ Pass string enum key as query parameter
    return this._list<News>('/news', { status });
    // Request: GET /news?status=PUBLISHED
  }
}
```

### 6. State Management

```typescript
// src/pages/NewsPage.tsx
import { useState } from 'react';
import { NEWS_STATUS, NewsStatus } from '@/enums/NewsEnums';

export function NewsPage() {
  // ✅ Use string enum type for state
  const [selectedStatus, setSelectedStatus] = useState<NewsStatus>(NEWS_STATUS.PUBLISHED);
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      // ✅ Pass string enum key to API
      const result = await api.app.news.getNewsByStatus(selectedStatus);
      setNews(result);
    };
    fetchNews();
  }, [selectedStatus]);

  return (
    <div>
      <Select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value as NewsStatus)}
      >
        {ALL_NEWS_STATUSES.map(({ value, label }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
```

## Complete Example: News Status Workflow

### 1. Define Enum
```typescript
// src/enums/NewsEnums.ts
export const NEWS_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED"
} as const;

export type NewsStatus = typeof NEWS_STATUS[keyof typeof NEWS_STATUS];

export function getNewsStatusLabel(status: NewsStatus): string {
  return { DRAFT: "Draft", PUBLISHED: "Published" }[status] || status;
}

export const ALL_NEWS_STATUSES = [
  { value: NEWS_STATUS.DRAFT, label: "Draft" },
  { value: NEWS_STATUS.PUBLISHED, label: "Published" }
] as const;
```

### 2. Define Types
```typescript
// src/types/entities/News.ts
import { NewsStatus } from '@/enums/NewsEnums';

export interface News {
  id: string;
  title: string;
  status: NewsStatus; // "DRAFT" | "PUBLISHED"
}
```

### 3. Create Form
```typescript
// src/components/NewsForm.tsx
import { NEWS_STATUS, ALL_NEWS_STATUSES } from '@/enums/NewsEnums';

export function NewsForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: '',
      status: NEWS_STATUS.DRAFT // ✅ String key
    }
  });

  const onSubmit = async (data) => {
    await api.app.news.createNews(data);
    // API request: { "title": "...", "status": "DRAFT" }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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

### 4. Display in List
```typescript
// src/components/NewsList.tsx
import { NEWS_STATUS, getNewsStatusLabel, getNewsStatusColor } from '@/enums/NewsEnums';

export function NewsList({ news }: { news: News[] }) {
  return (
    <>
      {news.map(item => (
        <Card key={item.id}>
          <Typography>{item.title}</Typography>

          {/* ✅ Helper functions for display */}
          <Chip
            label={getNewsStatusLabel(item.status)}
            color={getNewsStatusColor(item.status)}
          />

          {/* ✅ Enum constant for comparison */}
          {item.status === NEWS_STATUS.PUBLISHED && (
            <Button>View</Button>
          )}
        </Card>
      ))}
    </>
  );
}
```

## Available Enums

### Content Enums
- **NewsEnums.ts**
  - `NEWS_STATUS` - Article status
  - Helper: `getNewsStatusLabel()`, `getNewsStatusColor()`
  - Options: `ALL_NEWS_STATUSES`

- **PollEnums.ts**
  - `POLL_STATUS` - Poll status
  - Helper: `getPollStatusLabel()`, `getPollStatusColor()`
  - Options: `ALL_POLL_STATUSES`

- **TagEnums.ts**
  - `TAG_STATUS` - Tag status
  - `TAG_TYPE` - Tag categories
  - Helpers + Options for both

### User & Channel Enums
- **UserEnums.ts**
  - `USER_ROLE` - User roles (USER, JOURNALIST, ADMIN, SUPER_ADMIN)
  - `USER_STATUS` - Account status
  - Helpers: `getUserRoleLabel()`, `getUserStatusColor()`
  - Options: `ALL_USER_ROLES`, `ALL_USER_STATUSES`

- **ChannelEnums.ts**
  - `CHANNEL_STATUS` - Channel status
  - Helper: `getChannelStatusLabel()`, `getChannelStatusColor()`

### Financial Enums
- **TransactionEnums.ts**
  - `TRANSACTION_TYPE` - Transaction types
  - `TRANSACTION_STATUS` - Transaction status
  - Helpers + Options

- **ExpenseOrderEnums.ts**
  - `EXPENSE_ORDER_STATUS` - Expense order status
  - Helper: `getExpenseOrderStatusLabel()`, `getExpenseOrderStatusColor()`

- **ExpenseTypeEnums.ts**
  - `EXPENSE_TYPE` - Expense categories
  - Helper: `getExpenseTypeLabel()`
  - Options: `ALL_EXPENSE_TYPES`

- **PayoutEnums.ts**
  - `PAYOUT_STATUS` - Payout status
  - Helper: `getPayoutStatusLabel()`, `getPayoutStatusColor()`

### Subscription Enums
- **SubscriptionEnums.ts**
  - `SUBSCRIPTION_STATUS` - Subscription status
  - Helper: `getSubscriptionStatusLabel()`, `getSubscriptionStatusColor()`

### Notification Enums
- **NotificationEnums.ts**
  - `NOTIFICATION_TYPE` - Notification types
  - `NOTIFICATION_CATEGORY` - Categories
  - `NOTIFICATION_PRIORITY` - Priority levels
  - `NOTIFICATION_STATUS` - Read status
  - Helpers for all types

### Media Enums
- **MediaEnums.ts**
  - `MEDIA_TYPE` - General media types
  - `NEWS_MEDIA_TYPE` - News-specific
  - `POLL_MEDIA_TYPE` - Poll-specific
  - Helpers + Options

### Search & Filters
- **SearchEnums.ts**
  - `SEARCH_TYPE` - Entity types (ALL, NEWS, POLL, CHANNEL, etc.)
  - `SEARCH_SORT` - Sorting options (RELEVANCE, NEWEST, OLDEST, POPULAR)
  - Helpers: `getSearchTypeLabel()`, `getSearchSortLabel()`
  - Options: `ALL_SEARCH_TYPES`, `ALL_SEARCH_SORT_OPTIONS`

- **BookmarkEnums.ts**
  - `BOOKMARKABLE_TYPE` - Bookmarkable entities
  - Helper: `getBookmarkableTypeLabel()`

### Platform Enums
- **PlatformFeeEnums.ts**
  - `PLATFORM_FEE_ENTITY_TYPE` - Fee entity types (GLOBAL, CHANNEL, TIER)
  - Helper: `getPlatformFeeEntityTypeLabel()`

## Helper Function Patterns

### Label Helper
```typescript
export function getEnumLabel(value: EnumType): string {
  const labels: Record<EnumType, string> = {
    KEY1: "Display Label 1",
    KEY2: "Display Label 2"
  };
  return labels[value] || value; // Fallback to key if not found
}
```

### Color Helper (MUI Chips)
```typescript
export function getEnumColor(value: EnumType): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  const colors: Record<EnumType, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
    ACTIVE: "success",
    INACTIVE: "default",
    ERROR: "error"
  };
  return colors[value] || "default";
}
```

### Icon Helper (Optional)
```typescript
import { CheckCircle, Warning, Error } from '@mui/icons-material';

export function getEnumIcon(value: EnumType): React.ReactElement {
  const icons: Record<EnumType, React.ReactElement> = {
    ACTIVE: <CheckCircle />,
    WARNING: <Warning />,
    ERROR: <Error />
  };
  return icons[value] || <CheckCircle />;
}
```

### Dropdown Options
```typescript
export const ALL_ENUM_VALUES = [
  { value: ENUM.KEY1, label: "Display Label 1" },
  { value: ENUM.KEY2, label: "Display Label 2" }
] as const;

// Usage in Select
<Select>
  {ALL_ENUM_VALUES.map(({ value, label }) => (
    <MenuItem key={value} value={value}>{label}</MenuItem>
  ))}
</Select>
```

## Best Practices

### ✅ DO

1. **Always use enum constants**
   ```typescript
   if (news.status === NEWS_STATUS.PUBLISHED) { }
   ```

2. **Use helper functions for display**
   ```typescript
   <Chip label={getNewsStatusLabel(news.status)} />
   ```

3. **Use ALL_* options for dropdowns**
   ```typescript
   {ALL_NEWS_STATUSES.map(({ value, label }) => ...)}
   ```

4. **Type function parameters with enum types**
   ```typescript
   function handleStatusChange(status: NewsStatus) { }
   ```

5. **Use string literal types in interfaces**
   ```typescript
   interface News {
     status: NewsStatus; // "DRAFT" | "PUBLISHED" | ...
   }
   ```

### ❌ DON'T

1. **Don't use magic strings**
   ```typescript
   // ❌ WRONG
   if (news.status === "PUBLISHED") { }

   // ✅ CORRECT
   if (news.status === NEWS_STATUS.PUBLISHED) { }
   ```

2. **Don't use numeric values EVER**
   ```typescript
   // ❌ WRONG - NEVER DO THIS!
   if (news.status === 3) { }

   // ✅ CORRECT
   if (news.status === NEWS_STATUS.PUBLISHED) { }
   ```

3. **Don't hardcode labels in components**
   ```typescript
   // ❌ WRONG
   <Chip label={news.status === "PUBLISHED" ? "Published" : "Draft"} />

   // ✅ CORRECT
   <Chip label={getNewsStatusLabel(news.status)} />
   ```

4. **Don't create dropdown options inline**
   ```typescript
   // ❌ WRONG
   <Select>
     <MenuItem value="DRAFT">Draft</MenuItem>
     <MenuItem value="PUBLISHED">Published</MenuItem>
   </Select>

   // ✅ CORRECT
   <Select>
     {ALL_NEWS_STATUSES.map(({ value, label }) => (
       <MenuItem key={value} value={value}>{label}</MenuItem>
     ))}
   </Select>
   ```

5. **Don't convert to/from numbers**
   ```typescript
   // ❌ WRONG - Frontend never works with numbers!
   const statusNumber = Number(news.status);

   // ✅ CORRECT - Always use string enum keys
   const status = NEWS_STATUS.PUBLISHED;
   ```

## Type Safety Tips

### Narrow Types with Type Guards
```typescript
function isPublishedNews(news: News): news is News & { status: typeof NEWS_STATUS.PUBLISHED } {
  return news.status === NEWS_STATUS.PUBLISHED;
}

if (isPublishedNews(news)) {
  // TypeScript knows news.status is definitely "PUBLISHED" here
}
```

### Exhaustive Switch Statements
```typescript
function handleStatus(status: NewsStatus): string {
  switch (status) {
    case NEWS_STATUS.DRAFT:
      return "Draft";
    case NEWS_STATUS.IN_REVIEW:
      return "In Review";
    case NEWS_STATUS.PUBLISHED:
      return "Published";
    case NEWS_STATUS.ARCHIVED:
      return "Archived";
    case NEWS_STATUS.DELETED:
      return "Deleted";
    default:
      // TypeScript will error if we miss a case
      const _exhaustive: never = status;
      return _exhaustive;
  }
}
```

### Const Assertions for Strict Types
```typescript
// ✅ Use 'as const' for strict typing
export const ALL_NEWS_STATUSES = [
  { value: NEWS_STATUS.DRAFT, label: "Draft" }
] as const;

// Type is readonly and exact:
// readonly [{ readonly value: "DRAFT"; readonly label: "Draft"; }]
```

## Creating a New Enum

Follow this checklist:

1. **Create enum file** in `/src/enums/`
   ```typescript
   export const MY_ENUM = {
     VALUE1: "VALUE1",
     VALUE2: "VALUE2"
   } as const;
   ```

2. **Export type**
   ```typescript
   export type MyEnum = typeof MY_ENUM[keyof typeof MY_ENUM];
   ```

3. **Create label helper**
   ```typescript
   export function getMyEnumLabel(value: MyEnum): string { ... }
   ```

4. **Create color helper (if applicable)**
   ```typescript
   export function getMyEnumColor(value: MyEnum): ChipColor { ... }
   ```

5. **Create dropdown options**
   ```typescript
   export const ALL_MY_ENUM_VALUES = [...] as const;
   ```

6. **Update entity types** in `/src/types/entities/`
   ```typescript
   import { MyEnum } from '@/enums/MyEnums';
   export interface MyEntity {
     myField: MyEnum;
   }
   ```

7. **Update central export** in `/src/types/index.ts`
   ```typescript
   export type { MyEnum } from '@/enums/MyEnums';
   ```

## Troubleshooting

### Problem: TypeScript error "Type 'string' is not assignable to type 'NewsStatus'"

**Cause:** Using plain string instead of enum constant

**Solution:**
```typescript
// ❌ WRONG
const status: NewsStatus = "PUBLISHED"; // Might error

// ✅ CORRECT
const status: NewsStatus = NEWS_STATUS.PUBLISHED;
```

### Problem: Select component not showing selected value

**Cause:** Value mismatch between state and MenuItem values

**Solution:**
```typescript
// Ensure state type matches MenuItem values
const [status, setStatus] = useState<NewsStatus>(NEWS_STATUS.DRAFT);

<Select value={status}>
  {ALL_NEWS_STATUSES.map(({ value, label }) => (
    <MenuItem key={value} value={value}> {/* Must match state type */}
      {label}
    </MenuItem>
  ))}
</Select>
```

### Problem: API validation errors when sending enum values

**Cause:** Backend expects string keys, frontend sending something else

**Solution:**
```typescript
// ✅ Always send string enum keys
await api.app.news.createNews({
  title: "My News",
  status: NEWS_STATUS.PUBLISHED // String: "PUBLISHED"
});

// ❌ NEVER send numbers
await api.app.news.createNews({
  title: "My News",
  status: 3 // WRONG!
});
```

## See Also

- [Quick Start Guide](/docs/QUICK_START.md) - Overview of frontend patterns
- [Type System Guide](/src/types/README.md) - Understanding types and interfaces
- [API Integration Guide](/src/APIs/README.md) - Working with APIs
- [Component Patterns](/src/components/README.md) - Component best practices
