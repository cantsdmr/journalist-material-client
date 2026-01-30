import { NotificationType, NotificationCategory } from "@/enums/NotificationEnums";

/**
 * Notification Entity Type
 * Represents in-app notifications
 */
export interface Notification {
  id: string;
  userId: string;
  typeId: NotificationType;
  categoryId: NotificationCategory;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Notification Preference Entity Type
 * Controls which notification types a user receives
 */
export interface NotificationPreference {
  id: string | null;
  userId: string;
  notificationTypeId: NotificationType;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  createdAt: Date | string | null;
  updatedAt: Date | string | null;
}

/**
 * Notification Type Metadata
 * Provides human-readable names and descriptions for notification types
 */
export interface NotificationTypeMetadata {
  id: NotificationType;
  name: string;
  description: string;
  category: NotificationCategory;
}
