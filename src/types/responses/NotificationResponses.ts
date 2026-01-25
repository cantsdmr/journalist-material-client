import { Notification } from '../entities/Notification';
import { CursorPaginationMetadata } from '../ApiTypes';

/**
 * Response type for unread count endpoint
 */
export interface UnreadCountResponse {
  count: number;
}

/**
 * Cursor-based paginated response for notifications (infinite scroll)
 */
export interface NotificationFeedResponse {
  items: Notification[];
  metadata: CursorPaginationMetadata;
}
