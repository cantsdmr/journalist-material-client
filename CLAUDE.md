Design system:
- Use MUI
- Use Typescript
- Use React
- Use React Router
- Use React Context
- Use React Hooks
- Use React Hook Form
- Use React Infinite Scroll
- Use React Skeleton
- Create common components under /components
- Design the pages using mobile first approach
- Use numbered enums
- Use apiContext

Type System:
- All entity types are defined in /src/types/entities/ folder
- Request types are defined in /src/types/requests/ folder (e.g., NotificationRequests.ts, NewsRequests.ts)
- Response types are defined in /src/types/responses/ folder (e.g., NotificationResponses.ts, NewsResponses.ts)
- /src/types/index.ts is the central export point - always import types from "@/types" not directly from subfolders
- /src/types/ApiTypes.ts contains shared API response structures used across all endpoints:
  - PaginatedResponse<T> - Standard offset-based pagination with metadata (offset, limit, total, pageCount, etc.)
  - CursorPaginatedResponse<T> - Cursor-based pagination for infinite scroll (items, metadata with hasMore, nextCursor, prevCursor)
  - ListResponse<T> - Simple list without pagination
  - PaginationMetadata - Metadata interface for offset-based pagination
  - CursorPaginationMetadata - Metadata interface for cursor-based pagination
- Entity types use camelCase for property names (e.g., userId, createdAt, statusId)
- Always refer to entity type files when working with API responses in admin pages
- Column IDs in AdminTable components must match the exact property names from entity types
- Common entity files: Account.ts, Channel.ts, ExpenseOrder.ts, Funding.ts, News.ts, Poll.ts, Subscription.ts, Tag.ts, User.ts, Notification.ts
- Admin-specific entity types (like AdminSubscription) may have different field names than regular entity types
- When building admin pages, always check the corresponding entity type in /src/types/entities/ to ensure column definitions match
- Frontend entity types must match backend service DTOs exactly (refer to journalist-api/src/services/*/dto/ for backend types)
- Backend DTOs use @Expose decorators to map snake_case database fields to camelCase frontend fields

Pagination:
- MUI TablePagination uses 0-indexed pages (page 0 = first page, page 1 = second page)
- Backend API expects 1-indexed pages (page 1 = first page, page 2 = second page)
- Always convert: send { page: page + 1, limit: rowsPerPage } to API
- Backend koa-pagination-v2 middleware calculates: offset = (page - 1) * limit
- Use PaginationQuery type from ApiTypes.ts for all API calls
- Response metadata includes: offset, limit, total, pageCount, currentPage, hasNext, hasPrev
- Example flow: MUI shows "Page 1" (page=0) → send page=1 to API → backend calculates offset=0

Cursor Pagination (Infinite Scroll):
- Use CursorPaginatedResponse<T> for infinite scroll feeds (notifications, news feeds, etc.)
- Cursors are opaque, self-describing strings (contain field, direction, value, id metadata)
- Backend cursorPagination middleware is applied globally in app.ts - parses after/before query params
- Frontend uses useCursorPagination hook with fetcher function pattern
- HTTP client: Always use _listWithCursor() method for cursor-based endpoints, NOT _get() or _list()
- API methods should accept params with optional after/before cursor strings
- Response includes: items[], metadata { limit, hasMore, nextCursor?, prevCursor? }
- nextCursor is only present when hasMore is true - prevents infinite loading
- Use refs (loadingRef, hasMoreRef) in callbacks to prevent function recreation on state changes
- Example: NotificationAPI.getNotificationFeed() uses _listWithCursor() and returns CursorPaginatedResponse

Tag Filtering:
- TagFilter component enforces single tag selection only (clicking new tag replaces previous selection)
- Clicking selected tag deselects it and shows "All"
- Backend supports multiple tags but frontend limits to 1 for better UX and performance
- maxTags prop is ignored - always enforces single tag selection