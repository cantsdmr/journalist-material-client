import { NotificationType, NotificationCategory } from "@/enums/NotificationEnums";

/**
 * Query parameters for fetching notifications (offset-based pagination)
 */
export interface GetNotificationsParams {
  typeId?: NotificationType;
  categoryId?: NotificationCategory;
  isRead?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Query parameters for cursor-based notification feed
 * Cursors are self-describing (contain field and direction metadata)
 */
export interface GetNotificationFeedParams {
  typeId?: NotificationType;
  categoryId?: NotificationCategory;
  isRead?: boolean;
  limit?: number;
  after?: string;  // Opaque cursor string (self-describing)
  before?: string; // Opaque cursor string (self-describing)
}
