// Fundable Type Enum (what can be funded)
export const FUNDABLE_TYPE = {
  NEWS: "NEWS",
  POLL: "POLL"
} as const;

export type FundableType = typeof FUNDABLE_TYPE[keyof typeof FUNDABLE_TYPE];

// Fund Status Enum
export const FUND_STATUS = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED"
} as const;

export type FundStatus = typeof FUND_STATUS[keyof typeof FUND_STATUS];

// Contribution Type Enum
export const CONTRIBUTION_TYPE = {
  ONE_TIME: "ONE_TIME",
  RECURRING: "RECURRING"
} as const;

export type ContributionType = typeof CONTRIBUTION_TYPE[keyof typeof CONTRIBUTION_TYPE];

// Contribution Status Enum
export const CONTRIBUTION_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED"
} as const;

export type ContributionStatus = typeof CONTRIBUTION_STATUS[keyof typeof CONTRIBUTION_STATUS];

// Helper Functions for Fundable Type
export function getFundableTypeLabel(type: FundableType): string {
  switch (type) {
  case FUNDABLE_TYPE.NEWS:
    return "News";
  case FUNDABLE_TYPE.POLL:
    return "Poll";
  default:
    return type;
  }
}

// Helper Functions for Fund Status
export function getFundStatusLabel(status: FundStatus): string {
  switch (status) {
  case FUND_STATUS.ACTIVE:
    return "Active";
  case FUND_STATUS.COMPLETED:
    return "Completed";
  case FUND_STATUS.EXPIRED:
    return "Expired";
  case FUND_STATUS.CANCELLED:
    return "Cancelled";
  default:
    return status;
  }
}

export function getFundStatusColor(status: FundStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (status) {
  case FUND_STATUS.ACTIVE:
    return "success";
  case FUND_STATUS.COMPLETED:
    return "primary";
  case FUND_STATUS.EXPIRED:
    return "warning";
  case FUND_STATUS.CANCELLED:
    return "error";
  default:
    return "default";
  }
}

// Helper Functions for Contribution Type
export function getContributionTypeLabel(type: ContributionType): string {
  switch (type) {
  case CONTRIBUTION_TYPE.ONE_TIME:
    return "One-Time";
  case CONTRIBUTION_TYPE.RECURRING:
    return "Recurring";
  default:
    return type;
  }
}

// Helper Functions for Contribution Status
export function getContributionStatusLabel(status: ContributionStatus): string {
  switch (status) {
  case CONTRIBUTION_STATUS.PENDING:
    return "Pending";
  case CONTRIBUTION_STATUS.COMPLETED:
    return "Completed";
  case CONTRIBUTION_STATUS.FAILED:
    return "Failed";
  case CONTRIBUTION_STATUS.REFUNDED:
    return "Refunded";
  default:
    return status;
  }
}

export function getContributionStatusColor(status: ContributionStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (status) {
  case CONTRIBUTION_STATUS.PENDING:
    return "warning";
  case CONTRIBUTION_STATUS.COMPLETED:
    return "success";
  case CONTRIBUTION_STATUS.FAILED:
    return "error";
  case CONTRIBUTION_STATUS.REFUNDED:
    return "info";
  default:
    return "default";
  }
}

// Dropdown Options
export const ALL_FUNDABLE_TYPES = [
  { value: FUNDABLE_TYPE.NEWS, label: "News" },
  { value: FUNDABLE_TYPE.POLL, label: "Poll" }
] as const;

export const ALL_FUND_STATUSES = [
  { value: FUND_STATUS.ACTIVE, label: "Active" },
  { value: FUND_STATUS.COMPLETED, label: "Completed" },
  { value: FUND_STATUS.EXPIRED, label: "Expired" },
  { value: FUND_STATUS.CANCELLED, label: "Cancelled" }
] as const;

export const ALL_CONTRIBUTION_TYPES = [
  { value: CONTRIBUTION_TYPE.ONE_TIME, label: "One-Time" },
  { value: CONTRIBUTION_TYPE.RECURRING, label: "Recurring" }
] as const;

export const ALL_CONTRIBUTION_STATUSES = [
  { value: CONTRIBUTION_STATUS.PENDING, label: "Pending" },
  { value: CONTRIBUTION_STATUS.COMPLETED, label: "Completed" },
  { value: CONTRIBUTION_STATUS.FAILED, label: "Failed" },
  { value: CONTRIBUTION_STATUS.REFUNDED, label: "Refunded" }
] as const;
