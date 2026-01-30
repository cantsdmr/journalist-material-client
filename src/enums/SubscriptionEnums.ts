// Subscription Status Enum
export const SUBSCRIPTION_STATUS = {
  ACTIVE: "ACTIVE",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
  PENDING: "PENDING",
  SUSPENDED: "SUSPENDED"
} as const;

export type SubscriptionStatus = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];

// Helper Functions
export function getSubscriptionStatusLabel(status: SubscriptionStatus): string {
  switch (status) {
  case SUBSCRIPTION_STATUS.ACTIVE:
    return "Active";
  case SUBSCRIPTION_STATUS.CANCELLED:
    return "Cancelled";
  case SUBSCRIPTION_STATUS.EXPIRED:
    return "Expired";
  case SUBSCRIPTION_STATUS.PENDING:
    return "Pending";
  case SUBSCRIPTION_STATUS.SUSPENDED:
    return "Suspended";
  default:
    return status;
  }
}

export function getSubscriptionStatusColor(status: SubscriptionStatus): 'success' | 'warning' | 'error' | 'info' | 'default' {
  switch (status) {
  case SUBSCRIPTION_STATUS.ACTIVE:
    return "success";
  case SUBSCRIPTION_STATUS.CANCELLED:
    return "warning";
  case SUBSCRIPTION_STATUS.EXPIRED:
    return "error";
  case SUBSCRIPTION_STATUS.PENDING:
    return "info";
  case SUBSCRIPTION_STATUS.SUSPENDED:
    return "info";
  default:
    return "default";
  }
}

// Validation Functions
export function isSubscriptionStatusActive(status: SubscriptionStatus): boolean {
  return status === SUBSCRIPTION_STATUS.ACTIVE;
}

export function isSubscriptionStatusCancelled(status: SubscriptionStatus): boolean {
  return status === SUBSCRIPTION_STATUS.CANCELLED;
}

export function canCancelSubscription(status: SubscriptionStatus): boolean {
  return isSubscriptionStatusActive(status);
}

export function canReactivateSubscription(status: SubscriptionStatus): boolean {
  return status === SUBSCRIPTION_STATUS.CANCELLED || status === SUBSCRIPTION_STATUS.SUSPENDED;
}

// Dropdown Options
export const ALL_SUBSCRIPTION_STATUSES = [
  { value: SUBSCRIPTION_STATUS.ACTIVE, label: "Active" },
  { value: SUBSCRIPTION_STATUS.CANCELLED, label: "Cancelled" },
  { value: SUBSCRIPTION_STATUS.EXPIRED, label: "Expired" },
  { value: SUBSCRIPTION_STATUS.PENDING, label: "Pending" },
  { value: SUBSCRIPTION_STATUS.SUSPENDED, label: "Suspended" }
] as const;

// Legacy function names for backwards compatibility (can be removed later)
export const getMembershipStatusColor = getSubscriptionStatusColor;
export const getMembershipStatusLabel = getSubscriptionStatusLabel;
export const canCancelMembership = canCancelSubscription;
