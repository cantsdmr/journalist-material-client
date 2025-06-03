// ============================================================================
// SHARED API TYPES (Auto-generated from backend)
// ============================================================================
// 
// This file is automatically copied from the backend project.
// DO NOT EDIT DIRECTLY - Edit the backend file instead:
// backend/src/common/types/ApiTypes.ts
//
// To regenerate this file, run: npm run sync-types
//

/**
 * Pagination metadata returned by koa-pagination-v2 middleware
 * This matches both backend PaginationMetadata and frontend Meta interfaces
 */
export interface PaginationMetadata {
  offset: number;
  limit: number;
  total: number;
  pageCount: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Standard paginated response structure
 * This matches both backend PaginatedResponse and frontend PaginatedCollection
 */
export interface PaginatedResponse<T> {
  items: T[];
  metadata: PaginationMetadata;
}

/**
 * Simple list response without pagination
 * This matches both backend ListResponse and frontend Collection
 */
export interface ListResponse<T> {
  items: T[];
}

/**
 * Error response structure
 */
export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: any;
}

/**
 * Pagination query parameters for requests
 */
export interface PaginationQuery {
  page?: number | string;
  limit?: number | string;
  order?: 'asc' | 'desc';
}

/**
 * Default pagination settings
 */
export const DEFAULT_PAGINATION: Required<PaginationQuery> = {
  page: 1,
  limit: 20,
  order: 'desc'
};

// ============================================================================
// TYPE ALIASES FOR BACKWARD COMPATIBILITY
// ============================================================================

/**
 * @deprecated Use PaginationMetadata instead
 */
export type Meta = PaginationMetadata;

/**
 * @deprecated Use PaginatedResponse instead
 */
export type PaginatedCollection<T> = PaginatedResponse<T>;

/**
 * @deprecated Use ListResponse instead
 */
export type Collection<T> = ListResponse<T>;

/**
 * Frontend pagination object type
 */
export type PaginationObject = PaginationQuery; 