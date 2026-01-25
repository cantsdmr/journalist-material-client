/**
 * Notification Entity Type
 * Represents in-app notifications
 */
export interface Notification {
  id: string;
  userId: string;
  typeId: number;
  categoryId: number;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
