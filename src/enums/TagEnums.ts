// Tag Type Enum
export const TAG_TYPE = {
  SYSTEM: "SYSTEM",
  USER: "USER",
  CHANNEL: "CHANNEL",
  TRENDING: "TRENDING"
} as const;

export type TagType = typeof TAG_TYPE[keyof typeof TAG_TYPE];

// Tag Status Enum
export const TAG_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  FLAGGED: "FLAGGED"
} as const;

export type TagStatus = typeof TAG_STATUS[keyof typeof TAG_STATUS];

// Helper Functions for Tag Type
export function getTagTypeLabel(type: TagType): string {
  switch (type) {
  case TAG_TYPE.SYSTEM:
    return "System";
  case TAG_TYPE.USER:
    return "User";
  case TAG_TYPE.CHANNEL:
    return "Channel";
  case TAG_TYPE.TRENDING:
    return "Trending";
  default:
    return type;
  }
}

export function getTagTypeColor(type: TagType): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (type) {
  case TAG_TYPE.SYSTEM:
    return "primary";
  case TAG_TYPE.USER:
    return "info";
  case TAG_TYPE.CHANNEL:
    return "secondary";
  case TAG_TYPE.TRENDING:
    return "warning";
  default:
    return "default";
  }
}

// Helper Functions for Tag Status
export function getTagStatusLabel(status: TagStatus): string {
  switch (status) {
  case TAG_STATUS.PENDING:
    return "Pending";
  case TAG_STATUS.APPROVED:
    return "Approved";
  case TAG_STATUS.REJECTED:
    return "Rejected";
  case TAG_STATUS.FLAGGED:
    return "Flagged";
  default:
    return status;
  }
}

export function getTagStatusColor(status: TagStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (status) {
  case TAG_STATUS.PENDING:
    return "warning";
  case TAG_STATUS.APPROVED:
    return "success";
  case TAG_STATUS.REJECTED:
    return "error";
  case TAG_STATUS.FLAGGED:
    return "error";
  default:
    return "default";
  }
}

// Dropdown Options
export const ALL_TAG_TYPES = [
  { value: TAG_TYPE.SYSTEM, label: "System" },
  { value: TAG_TYPE.USER, label: "User" },
  { value: TAG_TYPE.CHANNEL, label: "Channel" },
  { value: TAG_TYPE.TRENDING, label: "Trending" }
] as const;

export const ALL_TAG_STATUSES = [
  { value: TAG_STATUS.PENDING, label: "Pending" },
  { value: TAG_STATUS.APPROVED, label: "Approved" },
  { value: TAG_STATUS.REJECTED, label: "Rejected" },
  { value: TAG_STATUS.FLAGGED, label: "Flagged" }
] as const;
