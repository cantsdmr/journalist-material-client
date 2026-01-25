/**
 * Query parameters for fetching notifications (offset-based pagination)
 */
export interface GetNotificationsParams {
  typeId?: number;
  categoryId?: number;
  isRead?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Query parameters for cursor-based notification feed
 * Cursors are self-describing (contain field and direction metadata)
 */
export interface GetNotificationFeedParams {
  typeId?: number;
  categoryId?: number;
  isRead?: boolean;
  limit?: number;
  after?: string;  // Opaque cursor string (self-describing)
  before?: string; // Opaque cursor string (self-describing)
}
