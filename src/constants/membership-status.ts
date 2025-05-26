export const MembershipStatus = {
  ACTIVE: 1,
  CANCELLED: 2,
  EXPIRED: 3,
  PENDING: 4,
  SUSPENDED: 5
} as const;

export type MembershipStatusValue = typeof MembershipStatus[keyof typeof MembershipStatus];

// String mappings for API compatibility
export const MembershipStatusStrings = {
  [MembershipStatus.ACTIVE]: 'active',
  [MembershipStatus.CANCELLED]: 'cancelled',
  [MembershipStatus.EXPIRED]: 'expired',
  [MembershipStatus.PENDING]: 'pending',
  [MembershipStatus.SUSPENDED]: 'suspended'
} as const;

// Reverse mapping from strings to numbers
export const StringToMembershipStatus = {
  'active': MembershipStatus.ACTIVE,
  'cancelled': MembershipStatus.CANCELLED,
  'expired': MembershipStatus.EXPIRED,
  'pending': MembershipStatus.PENDING,
  'suspended': MembershipStatus.SUSPENDED
} as const;

// Helper functions
export function getMembershipStatusString(statusId: MembershipStatusValue): string {
  return MembershipStatusStrings[statusId] || 'unknown';
}

export function getMembershipStatusId(statusString: string): MembershipStatusValue | undefined {
  return StringToMembershipStatus[statusString.toLowerCase() as keyof typeof StringToMembershipStatus];
}

export function isMembershipStatusActive(status: string | number): boolean {
  if (typeof status === 'string') {
    return status.toLowerCase() === 'active';
  }
  return status === MembershipStatus.ACTIVE;
}

export function isMembershipStatusCancelled(status: string | number): boolean {
  if (typeof status === 'string') {
    return status.toLowerCase() === 'cancelled';
  }
  return status === MembershipStatus.CANCELLED;
}

// UI Helper functions
export function getMembershipStatusLabel(status: string | number): string {
  let statusString: string;
  
  if (typeof status === 'number') {
    statusString = getMembershipStatusString(status as MembershipStatusValue);
  } else {
    statusString = status.toLowerCase();
  }

  switch (statusString) {
    case 'active':
      return 'Active';
    case 'canceled':
    case 'cancelled':
      return 'Canceled';
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

export function getMembershipStatusColor(status: string | number): 'success' | 'warning' | 'error' | 'info' | 'default' {
  let statusString: string;
  
  if (typeof status === 'number') {
    statusString = getMembershipStatusString(status as MembershipStatusValue);
  } else {
    statusString = status.toLowerCase();
  }

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
export function isValidMembershipStatus(status: string | number): boolean {
  if (typeof status === 'string') {
    return status.toLowerCase() in StringToMembershipStatus;
  }
  return Object.values(MembershipStatus).includes(status as MembershipStatusValue);
}

export function canCancelMembership(status: string | number): boolean {
  return isMembershipStatusActive(status);
}

export function canReactivateMembership(status: string | number): boolean {
  return isMembershipStatusCancelled(status) || 
         (typeof status === 'string' && status.toLowerCase() === 'suspended') ||
         (typeof status === 'number' && status === MembershipStatus.SUSPENDED);
}

// All available statuses for dropdowns/selects
export const ALL_MEMBERSHIP_STATUSES = [
  { id: MembershipStatus.ACTIVE, value: 'active', label: 'Active' },
  { id: MembershipStatus.CANCELLED, value: 'canceled', label: 'Canceled' },
  { id: MembershipStatus.EXPIRED, value: 'expired', label: 'Expired' },
  { id: MembershipStatus.PENDING, value: 'pending', label: 'Pending' },
  { id: MembershipStatus.SUSPENDED, value: 'suspended', label: 'Suspended' }
] as const; 