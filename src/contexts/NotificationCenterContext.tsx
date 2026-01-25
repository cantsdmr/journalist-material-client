import { useState, useEffect, useCallback, useRef } from "react";
import { useApiContext } from "./ApiContext";
import { useAuth } from "./AuthContext";
import { useApp } from "./AppContext";
import { Notification, GetNotificationFeedParams } from "@/types/index";
import { createCtx } from "./BaseContext";
import { useApiCall } from "@/hooks/useApiCall";
import { useCursorPagination } from "@/hooks/useCursorPagination";
import { CursorPaginatedResponse } from "@/types/ApiTypes";

interface NotificationCenterState {
  notifications: Notification[];
  newCount: number; // YouTube-style badge count (new notifications since last check)
  isOpen: boolean;
  isLoading: boolean;
  hasMore: boolean;
  actions: {
    fetchNotifications: (filters?: Omit<GetNotificationFeedParams, 'after' | 'before' | 'limit'>) => Promise<void>;
    loadMore: () => Promise<void>;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (notificationId: string) => Promise<void>;
    refreshNewCount: () => Promise<void>;
    markAsChecked: () => Promise<void>; // Reset "new" badge
    toggleDrawer: () => void;
    openDrawer: () => void;
    closeDrawer: () => void;
  };
}

export const [NotificationCenterContext, useNotificationCenter] = createCtx<NotificationCenterState>();

const NOTIFICATIONS_PER_PAGE = 20;

export const NotificationCenterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { api } = useApiContext();
  const { user: authUser } = useAuth();
  const { isAuthenticated } = useApp();
  const { execute } = useApiCall();

  const [newCount, setNewCount] = useState(0); // YouTube-style badge count
  const [isOpen, setIsOpen] = useState(false);

  // Use ref to track auth state for callbacks
  const authUserRef = useRef(authUser);
  authUserRef.current = authUser;

  // Track if we've already fetched notifications for the current drawer open session
  const hasFetchedRef = useRef(false);

  /**
   * Stable fetcher function for cursor pagination
   * Uses useCallback to prevent recreation on every render
   */
  const fetcher = useCallback(async (
    filters: Omit<GetNotificationFeedParams, 'after' | 'before' | 'limit'>,
    cursor?: string,
    limit?: number
  ): Promise<CursorPaginatedResponse<Notification>> => {
    const params: GetNotificationFeedParams = {
      ...filters,
      limit: limit || NOTIFICATIONS_PER_PAGE,
      after: cursor
    };

    const response = await api.app.notification.getNotificationFeed(params);
    return response as CursorPaginatedResponse<Notification>;
  }, [api]);

  /**
   * Cursor pagination hook for notifications
   */
  const {
    items: notifications,
    isLoading,
    hasMore,
    loadMore: loadMoreCursor,
    fetchInitial,
    refresh,
    updateFilters,
    updateItem,
    removeItem
  } = useCursorPagination<Notification, Omit<GetNotificationFeedParams, 'after' | 'before' | 'limit'>>({
    fetcher,
    pageSize: NOTIFICATIONS_PER_PAGE,
    autoFetch: false
  });

  // Track loading and hasMore state for loadMore callback
  const loadingRef = useRef(isLoading);
  loadingRef.current = isLoading;
  const hasMoreRef = useRef(hasMore);
  hasMoreRef.current = hasMore;

  /**
   * Fetch notifications with filters
   */
  const fetchNotifications = useCallback(async (
    filters: Omit<GetNotificationFeedParams, 'after' | 'before' | 'limit'> = {}
  ) => {
    if (!authUserRef.current) return;
    await updateFilters(filters);
  }, [updateFilters]);

  /**
   * Load more notifications (infinite scroll)
   */
  const loadMore = useCallback(async () => {
    if (!authUserRef.current || loadingRef.current || !hasMoreRef.current) return;
    await loadMoreCursor();
  }, [loadMoreCursor]);

  /**
   * Refresh new notifications count (YouTube-style badge)
   */
  const refreshNewCount = useCallback(async () => {
    if (!authUserRef.current) return;

    const result = await execute(
      () => api.app.notification.getNewNotificationsCount(),
      { showErrorToast: false }
    );

    if (result) {
      setNewCount(result.count || 0);
    }
  }, [api, execute]);

  /**
   * Mark as checked (reset "new" badge to zero)
   * Called when user opens notification drawer
   */
  const markAsChecked = useCallback(async () => {
    if (!authUserRef.current) return;

    // Optimistically reset the badge
    setNewCount(0);

    const result = await execute(
      () => api.app.notification.markAsChecked(),
      { showErrorToast: false, showSuccessMessage: false }
    );

    // Rollback on failure
    if (!result) {
      await refreshNewCount();
    }
  }, [api, execute, refreshNewCount]);

  /**
   * Mark a notification as read
   */
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!authUserRef.current) return;

    // Optimistic update
    updateItem(
      (n) => n.id === notificationId,
      (n) => ({ ...n, isRead: true, readAt: new Date().toISOString() })
    );

    const result = await execute(
      () => api.app.notification.markAsRead(notificationId),
      { showErrorToast: true, showSuccessMessage: false }
    );

    // Rollback on failure
    if (!result) {
      updateItem(
        (n) => n.id === notificationId,
        (n) => ({ ...n, isRead: false, readAt: undefined })
      );
    }
  }, [api, execute, updateItem]);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    if (!authUserRef.current) return;

    // Optimistic update - mark all as read
    const now = new Date().toISOString();
    updateItem(() => true, (item) => ({ ...item, isRead: true, readAt: now }));

    const result = await execute(
      () => api.app.notification.markAllAsRead(),
      { showErrorToast: true, showSuccessMessage: true, successMessage: 'All notifications marked as read' }
    );

    // Refresh on failure
    if (!result) {
      await refresh();
    }
  }, [api, execute, updateItem, refresh]);

  /**
   * Delete a notification
   */
  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!authUserRef.current) return;

    // Optimistic update
    removeItem((n) => n.id === notificationId);

    const result = await execute(
      () => api.app.notification.deleteNotification(notificationId),
      { showErrorToast: true, showSuccessMessage: false }
    );

    // Rollback on failure
    if (!result) {
      await refresh();
    }
  }, [api, execute, removeItem, refresh]);

  /**
   * Toggle drawer open/closed
   */
  const toggleDrawer = useCallback(async () => {
    setIsOpen(prev => {
      const willBeOpen = !prev;
      // Mark as checked when opening (YouTube-style)
      if (willBeOpen) {
        markAsChecked();
      }
      return willBeOpen;
    });
  }, [markAsChecked]);

  /**
   * Open drawer
   */
  const openDrawer = useCallback(async () => {
    setIsOpen(true);
    // Mark as checked when drawer opens (YouTube-style)
    await markAsChecked();
  }, [markAsChecked]);

  /**
   * Close drawer
   */
  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Listen to FCM notifications and refresh new count
   */
  useEffect(() => {
    const handleFCMNotification = () => {
      refreshNewCount(); // YouTube-style badge update
      // If drawer is open, refresh notifications
      if (isOpen) {
        refresh();
      }
    };

    window.addEventListener('fcm-notification-received', handleFCMNotification);

    return () => {
      window.removeEventListener('fcm-notification-received', handleFCMNotification);
    };
  }, [isOpen, refresh, refreshNewCount]);

  /**
   * Initialize - fetch new count when user logs in and API is authenticated
   */
  useEffect(() => {
    if (authUser && isAuthenticated) {
      refreshNewCount(); // YouTube-style badge
    } else {
      // Reset state on logout or when not authenticated
      setNewCount(0);
      setIsOpen(false);
    }
  }, [authUser, isAuthenticated, refreshNewCount]);

  /**
   * Fetch notifications when drawer is opened
   * Fetches fresh data every time the drawer opens
   */
  useEffect(() => {
    if (isOpen && !isLoading) {
      // Only fetch if we haven't fetched yet, or if drawer was closed and reopened
      if (!hasFetchedRef.current) {
        hasFetchedRef.current = true;
        fetchInitial();
      }
    } else if (!isOpen) {
      // Reset flag when drawer closes so next open triggers a fresh fetch
      hasFetchedRef.current = false;
    }
  }, [isOpen, isLoading, fetchInitial]);

  const value: NotificationCenterState = {
    notifications,
    newCount, // YouTube-style badge count
    isOpen,
    isLoading,
    hasMore,
    actions: {
      fetchNotifications,
      loadMore,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      refreshNewCount,
      markAsChecked,
      toggleDrawer,
      openDrawer,
      closeDrawer
    }
  };

  return (
    <NotificationCenterContext.Provider value={value}>
      {children}
    </NotificationCenterContext.Provider>
  );
};
