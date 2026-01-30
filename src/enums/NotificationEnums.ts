// Notification Type Enum
export const NOTIFICATION_TYPE = {
  SUBSCRIPTION_ACTIVATED: "SUBSCRIPTION_ACTIVATED",
  SUBSCRIPTION_RENEWED: "SUBSCRIPTION_RENEWED",
  SUBSCRIPTION_CANCELLED: "SUBSCRIPTION_CANCELLED",
  SUBSCRIPTION_SUSPENDED: "SUBSCRIPTION_SUSPENDED",
  SUBSCRIPTION_PAYMENT_FAILED: "SUBSCRIPTION_PAYMENT_FAILED",
  PAYOUT_INITIATED: "PAYOUT_INITIATED",
  PAYOUT_COMPLETED: "PAYOUT_COMPLETED",
  PAYOUT_FAILED: "PAYOUT_FAILED",
  FUND_RECEIVED: "FUND_RECEIVED",
  CHANNEL_NEWS_PUBLISHED: "CHANNEL_NEWS_PUBLISHED",
  CHANNEL_POLL_CREATED: "CHANNEL_POLL_CREATED",
  CHANNEL_POLL_ENDED: "CHANNEL_POLL_ENDED",
  SYSTEM_ANNOUNCEMENT: "SYSTEM_ANNOUNCEMENT"
} as const;

export type NotificationType = typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE];

// Notification Category Enum
export const NOTIFICATION_CATEGORY = {
  SUBSCRIPTION: "SUBSCRIPTION",
  PAYMENT: "PAYMENT",
  PAYOUT: "PAYOUT",
  CHANNEL: "CHANNEL",
  SYSTEM: "SYSTEM"
} as const;

export type NotificationCategory = typeof NOTIFICATION_CATEGORY[keyof typeof NOTIFICATION_CATEGORY];

// Helper Functions for Notification Type
export function getNotificationTypeLabel(type: NotificationType): string {
  switch (type) {
  case NOTIFICATION_TYPE.SUBSCRIPTION_ACTIVATED:
    return "Subscription Activated";
  case NOTIFICATION_TYPE.SUBSCRIPTION_RENEWED:
    return "Subscription Renewed";
  case NOTIFICATION_TYPE.SUBSCRIPTION_CANCELLED:
    return "Subscription Cancelled";
  case NOTIFICATION_TYPE.SUBSCRIPTION_SUSPENDED:
    return "Subscription Suspended";
  case NOTIFICATION_TYPE.SUBSCRIPTION_PAYMENT_FAILED:
    return "Subscription Payment Failed";
  case NOTIFICATION_TYPE.PAYOUT_INITIATED:
    return "Payout Initiated";
  case NOTIFICATION_TYPE.PAYOUT_COMPLETED:
    return "Payout Completed";
  case NOTIFICATION_TYPE.PAYOUT_FAILED:
    return "Payout Failed";
  case NOTIFICATION_TYPE.FUND_RECEIVED:
    return "Fund Received";
  case NOTIFICATION_TYPE.CHANNEL_NEWS_PUBLISHED:
    return "News Published";
  case NOTIFICATION_TYPE.CHANNEL_POLL_CREATED:
    return "Poll Created";
  case NOTIFICATION_TYPE.CHANNEL_POLL_ENDED:
    return "Poll Ended";
  case NOTIFICATION_TYPE.SYSTEM_ANNOUNCEMENT:
    return "System Announcement";
  default:
    return type;
  }
}

// Helper Functions for Notification Category
export function getNotificationCategoryLabel(category: NotificationCategory): string {
  switch (category) {
  case NOTIFICATION_CATEGORY.SUBSCRIPTION:
    return "Subscription";
  case NOTIFICATION_CATEGORY.PAYMENT:
    return "Payment";
  case NOTIFICATION_CATEGORY.PAYOUT:
    return "Payout";
  case NOTIFICATION_CATEGORY.CHANNEL:
    return "Channel";
  case NOTIFICATION_CATEGORY.SYSTEM:
    return "System";
  default:
    return category;
  }
}

export function getNotificationCategoryColor(category: NotificationCategory): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (category) {
  case NOTIFICATION_CATEGORY.SUBSCRIPTION:
    return "info";
  case NOTIFICATION_CATEGORY.PAYMENT:
    return "success";
  case NOTIFICATION_CATEGORY.PAYOUT:
    return "primary";
  case NOTIFICATION_CATEGORY.CHANNEL:
    return "secondary";
  case NOTIFICATION_CATEGORY.SYSTEM:
    return "warning";
  default:
    return "default";
  }
}

// Dropdown Options
export const ALL_NOTIFICATION_TYPES = [
  { value: NOTIFICATION_TYPE.SUBSCRIPTION_ACTIVATED, label: "Subscription Activated" },
  { value: NOTIFICATION_TYPE.SUBSCRIPTION_RENEWED, label: "Subscription Renewed" },
  { value: NOTIFICATION_TYPE.SUBSCRIPTION_CANCELLED, label: "Subscription Cancelled" },
  { value: NOTIFICATION_TYPE.SUBSCRIPTION_SUSPENDED, label: "Subscription Suspended" },
  { value: NOTIFICATION_TYPE.SUBSCRIPTION_PAYMENT_FAILED, label: "Subscription Payment Failed" },
  { value: NOTIFICATION_TYPE.PAYOUT_INITIATED, label: "Payout Initiated" },
  { value: NOTIFICATION_TYPE.PAYOUT_COMPLETED, label: "Payout Completed" },
  { value: NOTIFICATION_TYPE.PAYOUT_FAILED, label: "Payout Failed" },
  { value: NOTIFICATION_TYPE.FUND_RECEIVED, label: "Fund Received" },
  { value: NOTIFICATION_TYPE.CHANNEL_NEWS_PUBLISHED, label: "News Published" },
  { value: NOTIFICATION_TYPE.CHANNEL_POLL_CREATED, label: "Poll Created" },
  { value: NOTIFICATION_TYPE.CHANNEL_POLL_ENDED, label: "Poll Ended" },
  { value: NOTIFICATION_TYPE.SYSTEM_ANNOUNCEMENT, label: "System Announcement" }
] as const;

export const ALL_NOTIFICATION_CATEGORIES = [
  { value: NOTIFICATION_CATEGORY.SUBSCRIPTION, label: "Subscription" },
  { value: NOTIFICATION_CATEGORY.PAYMENT, label: "Payment" },
  { value: NOTIFICATION_CATEGORY.PAYOUT, label: "Payout" },
  { value: NOTIFICATION_CATEGORY.CHANNEL, label: "Channel" },
  { value: NOTIFICATION_CATEGORY.SYSTEM, label: "System" }
] as const;
