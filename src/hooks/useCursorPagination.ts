import { CursorPaginatedResponse } from '@/types/ApiTypes';
import { useState, useCallback, useRef } from 'react';

/**
 * Cursor pagination state
 */
export interface CursorPaginationState<T> {
  items: T[];
  isLoading: boolean;
  hasMore: boolean;
  nextCursor?: string;
  prevCursor?: string;
  error?: Error;
}

/**
 * Cursor pagination options
 */
export interface UseCursorPaginationOptions<T, TFilters = any> {
  /** Function to fetch data from API */
  fetcher: (filters: TFilters, cursor?: string, limit?: number) => Promise<CursorPaginatedResponse<T>>;
  /** Initial filters */
  initialFilters?: TFilters;
  /** Items per page */
  pageSize?: number;
  /** Auto-fetch on mount */
  autoFetch?: boolean;
}

/**
 * Cursor pagination hook
 *
 * Provides cursor-based pagination functionality for infinite scroll interfaces
 *
 * @example
 * ```tsx
 * const { items, isLoading, hasMore, loadMore, refresh } = useCursorPagination({
 *   fetcher: (filters, cursor, limit) => api.getNotificationFeed(filters, cursor, limit),
 *   pageSize: 20,
 *   autoFetch: true
 * });
 * ```
 */
export function useCursorPagination<T, TFilters = any>({
  fetcher,
  initialFilters = {} as TFilters,
  pageSize = 20,
  autoFetch = false
}: UseCursorPaginationOptions<T, TFilters>) {
  const [state, setState] = useState<CursorPaginationState<T>>({
    items: [],
    isLoading: false,
    hasMore: true,
    nextCursor: undefined,
    prevCursor: undefined,
    error: undefined
  });

  const [filters, setFilters] = useState<TFilters>(initialFilters);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const isMountedRef = useRef(true);
  const isFirstFetchRef = useRef(!autoFetch);

  // Use ref to track current state for loadMore guard checks
  const stateRef = useRef(state);
  stateRef.current = state;

  /**
   * Fetch initial page
   */
  const fetchInitial = useCallback(async (newFilters?: TFilters) => {
    const activeFilters = newFilters !== undefined ? newFilters : filtersRef.current;

    setState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      const response = await fetcher(activeFilters, undefined, pageSize);

      if (isMountedRef.current) {
        setState({
          items: response.items,
          isLoading: false,
          hasMore: response.metadata.hasMore,
          nextCursor: response.metadata.nextCursor,
          prevCursor: response.metadata.prevCursor,
          error: undefined
        });
      }
    } catch (error) {
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Failed to fetch data')
        }));
      }
    }
  }, [fetcher, pageSize]);

  /**
   * Load more items (append to existing)
   */
  const loadMore = useCallback(async () => {
    const currentState = stateRef.current;

    if (currentState.isLoading || !currentState.hasMore || !currentState.nextCursor) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      const response = await fetcher(filtersRef.current, currentState.nextCursor, pageSize);

      if (isMountedRef.current) {
        setState(prev => ({
          items: [...prev.items, ...response.items],
          isLoading: false,
          hasMore: response.metadata.hasMore,
          nextCursor: response.metadata.nextCursor,
          prevCursor: response.metadata.prevCursor,
          error: undefined
        }));
      }
    } catch (error) {
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Failed to load more')
        }));
      }
    }
  }, [fetcher, pageSize]);

  /**
   * Refresh data (reset to first page)
   */
  const refresh = useCallback(async () => {
    await fetchInitial(filtersRef.current);
  }, [fetchInitial]);

  /**
   * Update filters and refetch
   */
  const updateFilters = useCallback(async (newFilters: TFilters) => {
    setFilters(newFilters);
    await fetchInitial(newFilters);
  }, [fetchInitial]);

  /**
   * Reset pagination state
   */
  const reset = useCallback(() => {
    setState({
      items: [],
      isLoading: false,
      hasMore: true,
      nextCursor: undefined,
      prevCursor: undefined,
      error: undefined
    });
  }, []);

  /**
   * Add item to the beginning of the list
   */
  const prependItem = useCallback((item: T) => {
    setState(prev => ({
      ...prev,
      items: [item, ...prev.items]
    }));
  }, []);

  /**
   * Remove item from the list
   */
  const removeItem = useCallback((predicate: (item: T) => boolean) => {
    setState(prev => ({
      ...prev,
      items: prev.items.filter(item => !predicate(item))
    }));
  }, []);

  /**
   * Update item in the list
   */
  const updateItem = useCallback((predicate: (item: T) => boolean, updater: (item: T) => T) => {
    setState(prev => ({
      ...prev,
      items: prev.items.map(item => predicate(item) ? updater(item) : item)
    }));
  }, []);

  // Auto-fetch on mount if enabled
  if (isFirstFetchRef.current && autoFetch) {
    isFirstFetchRef.current = false;
    fetchInitial();
  }

  // Cleanup on unmount
  isMountedRef.current = true;

  return {
    // State
    items: state.items,
    isLoading: state.isLoading,
    hasMore: state.hasMore,
    error: state.error,
    nextCursor: state.nextCursor,
    prevCursor: state.prevCursor,
    filters,

    // Actions
    fetchInitial,
    loadMore,
    refresh,
    updateFilters,
    reset,
    prependItem,
    removeItem,
    updateItem
  };
}
