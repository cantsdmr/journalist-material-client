# Constants Guide

Application constants for paths, configuration, and static values.

## Quick Reference

| Constant File | Purpose | Example Values |
|---------------|---------|----------------|
| **paths.ts** | Route paths | `/news`, `/polls`, `/dashboard` |
| **config.ts** | App configuration | API URL, timeouts, limits |
| **validation.ts** | Validation rules | Min/max lengths, regex patterns |

## Part 1: Route Paths

**File:** `/src/constants/paths.ts`

```typescript
export const PATHS = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  NEWS: '/news',
  NEWS_DETAIL: '/news/:id',
  POLLS: '/polls',
  POLL_DETAIL: '/polls/:id',
  SEARCH: '/search',

  // User routes
  PROFILE: '/profile',
  SETTINGS: '/settings',
  BOOKMARKS: '/bookmarks',

  // Studio routes (content creators)
  STUDIO: '/studio',
  STUDIO_NEWS: '/studio/news',
  STUDIO_NEWS_CREATE: '/studio/news/create',
  STUDIO_NEWS_EDIT: '/studio/news/:id/edit',
  STUDIO_POLLS: '/studio/polls',
  STUDIO_EXPENSE_ORDERS: '/studio/expense-orders',
  STUDIO_EXPENSE_ORDER_CREATE: '/studio/expense-orders/create',
  STUDIO_EXPENSE_ORDER_VIEW: '/studio/expense-orders/:id',
  STUDIO_EXPENSE_ORDER_EDIT: '/studio/expense-orders/:id/edit',

  // Admin routes
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_NEWS: '/admin/news',
  ADMIN_POLLS: '/admin/polls',
  ADMIN_TAGS: '/admin/tags'
} as const;

export type PathKey = keyof typeof PATHS;
export type PathValue = typeof PATHS[PathKey];
```

**Usage:**

```typescript
import { PATHS } from '@/constants/paths';
import { useNavigate } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();

  return (
    <nav>
      <Button onClick={() => navigate(PATHS.HOME)}>Home</Button>
      <Button onClick={() => navigate(PATHS.NEWS)}>News</Button>
      <Button onClick={() => navigate(PATHS.POLLS)}>Polls</Button>
    </nav>
  );
}

// Dynamic paths
function NewsCard({ newsId }: { newsId: string }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(PATHS.NEWS_DETAIL.replace(':id', newsId));
  };

  return <Card onClick={handleClick}>...</Card>;
}
```

## Part 2: App Configuration

**File:** `/src/constants/config.ts`

```typescript
export const APP_CONFIG = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  API_TIMEOUT: 30000, // 30 seconds

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  ADMIN_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100,

  // Infinite Scroll
  FEED_PAGE_SIZE: 20,
  NOTIFICATION_PAGE_SIZE: 30,

  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],

  // Search
  SEARCH_DEBOUNCE_MS: 500,
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_RESULTS: 50,

  // Content Limits
  MAX_NEWS_TITLE_LENGTH: 200,
  MAX_NEWS_CONTENT_LENGTH: 50000,
  MAX_COMMENT_LENGTH: 1000,
  MAX_BIO_LENGTH: 500,

  // Timeouts
  TOAST_DURATION: 5000, // 5 seconds
  AUTO_SAVE_INTERVAL: 60000, // 1 minute

  // Features
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: false
} as const;
```

**Usage:**

```typescript
import { APP_CONFIG } from '@/constants/config';

// In API client
const api = new API({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: APP_CONFIG.API_TIMEOUT
});

// In form validation
const titleMaxLength = APP_CONFIG.MAX_NEWS_TITLE_LENGTH;

// In pagination
const [limit, setLimit] = useState(APP_CONFIG.DEFAULT_PAGE_SIZE);

// In file upload
if (file.size > APP_CONFIG.MAX_FILE_SIZE) {
  toast.error('File too large');
}
```

## Part 3: Validation Rules

**File:** `/src/constants/validation.ts`

```typescript
export const VALIDATION_RULES = {
  // Email
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  EMAIL_MAX_LENGTH: 255,

  // Password
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,

  // Names
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,

  // Content
  TITLE_MIN_LENGTH: 5,
  TITLE_MAX_LENGTH: 200,
  CONTENT_MIN_LENGTH: 50,
  CONTENT_MAX_LENGTH: 50000,

  // Comments
  COMMENT_MIN_LENGTH: 1,
  COMMENT_MAX_LENGTH: 1000,

  // Phone
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,

  // URL
  URL_REGEX: /^https?:\/\/.+/,

  // Tags
  MAX_TAGS_PER_ITEM: 10,
  TAG_MIN_LENGTH: 2,
  TAG_MAX_LENGTH: 30
} as const;
```

**Usage with React Hook Form:**

```typescript
import { useForm } from 'react-hook-form';
import { VALIDATION_RULES } from '@/constants/validation';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: VALIDATION_RULES.EMAIL_REGEX,
            message: 'Invalid email format'
          },
          maxLength: {
            value: VALIDATION_RULES.EMAIL_MAX_LENGTH,
            message: 'Email too long'
          }
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: VALIDATION_RULES.PASSWORD_MIN_LENGTH,
            message: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`
          }
        })}
        type="password"
        error={!!errors.password}
        helperText={errors.password?.message}
      />
    </form>
  );
}
```

## Part 4: UI Constants

**File:** `/src/constants/ui.ts`

```typescript
export const UI_CONSTANTS = {
  // Drawer width
  DRAWER_WIDTH: 240,
  MINI_DRAWER_WIDTH: 64,

  // AppBar height
  APPBAR_HEIGHT: 64,
  MOBILE_APPBAR_HEIGHT: 56,

  // Breakpoints (MUI defaults)
  BREAKPOINT_XS: 0,
  BREAKPOINT_SM: 600,
  BREAKPOINT_MD: 960,
  BREAKPOINT_LG: 1280,
  BREAKPOINT_XL: 1920,

  // Z-index layers
  Z_INDEX_DRAWER: 1200,
  Z_INDEX_APPBAR: 1100,
  Z_INDEX_MODAL: 1300,
  Z_INDEX_SNACKBAR: 1400,

  // Animation durations
  ANIMATION_DURATION_SHORT: 200,
  ANIMATION_DURATION_STANDARD: 300,
  ANIMATION_DURATION_LONG: 500
} as const;
```

**Usage:**

```typescript
import { UI_CONSTANTS } from '@/constants/ui';

const drawerStyles = {
  width: UI_CONSTANTS.DRAWER_WIDTH,
  zIndex: UI_CONSTANTS.Z_INDEX_DRAWER
};
```

## Best Practices

### ✅ DO

1. **Use constants instead of magic values**
   ```typescript
   // ✅ CORRECT
   navigate(PATHS.NEWS_DETAIL.replace(':id', newsId));

   // ❌ WRONG
   navigate(`/news/${newsId}`);
   ```

2. **Import constants at the top**
   ```typescript
   import { PATHS, APP_CONFIG, VALIDATION_RULES } from '@/constants';
   ```

3. **Use type-safe path helpers**
   ```typescript
   const newsPath: PathValue = PATHS.NEWS;
   ```

### ❌ DON'T

1. **Don't hardcode values**
   ```typescript
   // ❌ WRONG
   const maxLength = 200;

   // ✅ CORRECT
   const maxLength = APP_CONFIG.MAX_NEWS_TITLE_LENGTH;
   ```

2. **Don't duplicate constants**
   ```typescript
   // ❌ WRONG - Define in multiple places
   const pageSize = 20; // In component A
   const pageSize = 20; // In component B

   // ✅ CORRECT - Use shared constant
   const pageSize = APP_CONFIG.DEFAULT_PAGE_SIZE;
   ```

## See Also

- [Quick Start Guide](/docs/QUICK_START.md)
- [Type System Guide](/src/types/README.md)
- [Enum Guide](/src/enums/README.md)
