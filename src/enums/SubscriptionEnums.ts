export const SUBSCRIPTION_STATUS = {
  ACTIVE: 1,
  CANCELLED: 2,
  EXPIRED: 3,
  PENDING: 4,
  SUSPENDED: 5
} as const;

export type SubscriptionStatusValue = typeof SUBSCRIPTION_STATUS[keyof typeof SUBSCRIPTION_STATUS];

// String mappings for API compatibility
export const SubscriptionStatusStrings = {
  [SUBSCRIPTION_STATUS.ACTIVE]: 'active',
  [SUBSCRIPTION_STATUS.CANCELLED]: 'cancelled',
  [SUBSCRIPTION_STATUS.EXPIRED]: 'expired',
  [SUBSCRIPTION_STATUS.PENDING]: 'pending',
  [SUBSCRIPTION_STATUS.SUSPENDED]: 'suspended'
} as const;

// Reverse mapping from strings to numbers
export const StringToSubscriptionStatus = {
  'active': SUBSCRIPTION_STATUS.ACTIVE,
  'cancelled': SUBSCRIPTION_STATUS.CANCELLED,
  'expired': SUBSCRIPTION_STATUS.EXPIRED,
  'pending': SUBSCRIPTION_STATUS.PENDING,
  'suspended': SUBSCRIPTION_STATUS.SUSPENDED
} as const;

// Core utility functions for type normalization
function normalizeToStatusId(status: string | number): SubscriptionStatusValue {
  if (typeof status === 'number') {
    return Object.values(SUBSCRIPTION_STATUS).includes(status as SubscriptionStatusValue) 
      ? status as SubscriptionStatusValue 
      : SUBSCRIPTION_STATUS.PENDING; // fallback
  }
  
  const lowercaseStatus = status.toLowerCase();
  return StringToSubscriptionStatus[lowercaseStatus as keyof typeof StringToSubscriptionStatus] || SUBSCRIPTION_STATUS.PENDING;
}

function normalizeToStatusString(status: string | number): string {
  if (typeof status === 'string') {
    const lowercaseStatus = status.toLowerCase();
    return lowercaseStatus in StringToSubscriptionStatus ? lowercaseStatus : 'pending';
  }
  
  return SubscriptionStatusStrings[status as SubscriptionStatusValue] || 'pending';
}

// Helper functions
export function getSubscriptionStatusString(statusId: SubscriptionStatusValue): string {
  return SubscriptionStatusStrings[statusId] || 'unknown';
}

export function getSubscriptionStatusId(statusString: string): SubscriptionStatusValue | undefined {
  return StringToSubscriptionStatus[statusString.toLowerCase() as keyof typeof StringToSubscriptionStatus];
}

export function isSubscriptionStatusActive(status: string | number): boolean {
  return normalizeToStatusId(status) === SUBSCRIPTION_STATUS.ACTIVE;
}

export function isSubscriptionStatusCancelled(status: string | number): boolean {
  return normalizeToStatusId(status) === SUBSCRIPTION_STATUS.CANCELLED;
}

// UI Helper functions
export function getSubscriptionStatusLabel(status: string | number): string {
  const statusString = normalizeToStatusString(status);

  switch (statusString) {
  case 'active':
    return 'Active';
  case 'cancelled':
    return 'Cancelled';
  case 'expired':
    return 'Expired';
  case 'pending':
    return 'Pending';
  case 'suspended':
    return 'Suspended';
  default:
    return statusString.charAt(0).toUpperCase() + statusString.slice(1);
  }
}

export function getSubscriptionStatusColor(status: string | number): 'success' | 'warning' | 'error' | 'info' | 'default' {
  const statusString = normalizeToStatusString(status);

  switch (statusString) {
  case 'active':
    return 'success';
  case 'cancelled':
    return 'warning';
  case 'expired':
    return 'error';
  case 'pending':
    return 'info';
  case 'suspended':
    return 'info';
  default:
    return 'default';
  }
}

// Validation functions
export function isValidSubscriptionStatus(status: string | number): boolean {
  if (typeof status === 'number') {
    return Object.values(SUBSCRIPTION_STATUS).includes(status as SubscriptionStatusValue);
  }
  
  const lowercaseStatus = status.toLowerCase();
  return lowercaseStatus in StringToSubscriptionStatus;
}

export function canCancelSubscription(status: string | number): boolean {
  return isSubscriptionStatusActive(status);
}

export function canReactivateSubscription(status: string | number): boolean {
  const statusId = normalizeToStatusId(status);
  return statusId === SUBSCRIPTION_STATUS.CANCELLED || statusId === SUBSCRIPTION_STATUS.SUSPENDED;
}

// All available statuses for dropdowns/selects
export const ALL_SUBSCRIPTION_STATUSES = [
  { id: SUBSCRIPTION_STATUS.ACTIVE, value: 'active', label: 'Active' },
  { id: SUBSCRIPTION_STATUS.CANCELLED, value: 'cancelled', label: 'Cancelled' },
  { id: SUBSCRIPTION_STATUS.EXPIRED, value: 'expired', label: 'Expired' },
  { id: SUBSCRIPTION_STATUS.PENDING, value: 'pending', label: 'Pending' },
  { id: SUBSCRIPTION_STATUS.SUSPENDED, value: 'suspended', label: 'Suspended' }
] as const;

// Legacy function names for backwards compatibility (optional - can be removed)
export const getMembershipStatusColor = getSubscriptionStatusColor;
export const getMembershipStatusLabel = getSubscriptionStatusLabel;
export const canCancelMembership = canCancelSubscription; 