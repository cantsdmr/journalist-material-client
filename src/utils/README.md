# Utility Functions Guide

Reusable utility functions for common operations.

## Quick Reference

| Utility | Purpose | Example |
|---------|---------|---------|
| **formatDate** | Format dates | `formatDate(date, 'MMM dd, yyyy')` |
| **formatCurrency** | Format money | `formatCurrency(1000, 'USD')` |
| **truncateText** | Shorten text | `truncateText(text, 100)` |
| **generateSlug** | Create URL slugs | `generateSlug('My Title')` |
| **validateEmail** | Email validation | `validateEmail('user@example.com')` |
| **typeGuards** | Type checking | `isNews(item)`, `isPoll(item)` |

## Directory Structure

```
src/utils/
├── dateUtils.ts          # Date formatting and manipulation
├── currencyUtils.ts      # Money formatting
├── textUtils.ts          # Text operations
├── validationUtils.ts    # Validation helpers
├── typeGuards.ts         # TypeScript type guards
└── index.ts              # Barrel export
```

## Date Utilities

**File:** `/src/utils/dateUtils.ts`

```typescript
import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

export function formatDate(date: Date | string, formatStr: string = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';
  return format(dateObj, formatStr);
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Unknown';
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
}

export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
}
```

**Usage:**

```typescript
import { formatDate, formatRelativeTime } from '@/utils/dateUtils';

function NewsCard({ news }: { news: News }) {
  return (
    <div>
      <Typography variant="caption">
        {formatRelativeTime(news.createdAt)}
        {/* "2 hours ago" */}
      </Typography>

      <Typography variant="caption">
        {formatDate(news.publishedAt, 'MMM dd, yyyy')}
        {/* "Jan 30, 2026" */}
      </Typography>
    </div>
  );
}
```

## Currency Utilities

**File:** `/src/utils/currencyUtils.ts`

```typescript
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount / 100); // Backend stores in cents
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-US').format(amount);
}

export function parseCurrencyInput(input: string): number {
  const cleaned = input.replace(/[^0-9.]/g, '');
  const value = parseFloat(cleaned);
  return isNaN(value) ? 0 : Math.round(value * 100); // Convert to cents
}
```

**Usage:**

```typescript
import { formatCurrency } from '@/utils/currencyUtils';

function SubscriptionCard({ subscription }: { subscription: Subscription }) {
  return (
    <div>
      <Typography>
        {formatCurrency(subscription.amount, 'USD')}
        {/* "$10.00" */}
      </Typography>
    </div>
  );
}
```

## Text Utilities

**File:** `/src/utils/textUtils.ts`

```typescript
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural || singular + 's'}`;
}

export function stripHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}
```

**Usage:**

```typescript
import { truncateText, pluralize } from '@/utils/textUtils';

function NewsCard({ news }: { news: News }) {
  return (
    <div>
      <Typography variant="body2">
        {truncateText(news.content, 150)}
        {/* "This is a long text that will be truncated..." */}
      </Typography>

      <Typography variant="caption">
        {pluralize(news.commentCount, 'comment')}
        {/* "5 comments" or "1 comment" */}
      </Typography>
    </div>
  );
}
```

## Validation Utilities

**File:** `/src/utils/validationUtils.ts`

```typescript
import { VALIDATION_RULES } from '@/constants/validation';

export function validateEmail(email: string): boolean {
  return VALIDATION_RULES.EMAIL_REGEX.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`);
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}
```

**Usage:**

```typescript
import { validateEmail, validatePassword } from '@/utils/validationUtils';

function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!validateEmail(email)) {
      toast.error('Invalid email');
      return;
    }

    const { isValid, errors } = validatePassword(password);
    if (!isValid) {
      toast.error(errors.join(', '));
      return;
    }

    // Submit form
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Type Guards

**File:** `/src/utils/typeGuards.ts`

```typescript
import { News, Poll } from '@/types';
import { NEWS_STATUS, POLL_STATUS } from '@/enums';

export function isNews(item: News | Poll): item is News {
  return 'content' in item;
}

export function isPoll(item: News | Poll): item is Poll {
  return 'options' in item;
}

export function isPublishedNews(news: News): news is News & { status: typeof NEWS_STATUS.PUBLISHED } {
  return news.status === NEWS_STATUS.PUBLISHED;
}

export function isActivePoll(poll: Poll): poll is Poll & { status: typeof POLL_STATUS.ACTIVE } {
  return poll.status === POLL_STATUS.ACTIVE;
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
```

**Usage:**

```typescript
import { isNews, isPoll } from '@/utils/typeGuards';

function SearchResultCard({ result }: { result: News | Poll }) {
  if (isNews(result)) {
    // TypeScript knows result is News
    return <NewsCard news={result} />;
  } else {
    // TypeScript knows result is Poll
    return <PollCard poll={result} />;
  }
}
```

## Best Practices

### ✅ DO

1. **Use utilities for consistent formatting**
   ```typescript
   formatDate(news.createdAt, 'MMM dd, yyyy')
   ```

2. **Validate user input**
   ```typescript
   if (!validateEmail(email)) {
     toast.error('Invalid email');
   }
   ```

3. **Use type guards for union types**
   ```typescript
   if (isNews(item)) {
     // TypeScript knows item is News
   }
   ```

### ❌ DON'T

1. **Don't duplicate logic**
   ```typescript
   // ❌ WRONG - Format manually everywhere
   const date = new Date(news.createdAt).toLocaleDateString();

   // ✅ CORRECT - Use utility
   const date = formatDate(news.createdAt);
   ```

## See Also

- [Quick Start Guide](/docs/QUICK_START.md)
- [Constants Guide](/src/constants/README.md)
- [Type System Guide](/src/types/README.md)
