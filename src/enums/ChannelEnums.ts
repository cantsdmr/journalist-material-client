// Channel Status Enum
export const CHANNEL_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PRIVATE: "PRIVATE",
  SUSPENDED: "SUSPENDED",
  DELETED: "DELETED"
} as const;

export type ChannelStatus = typeof CHANNEL_STATUS[keyof typeof CHANNEL_STATUS];

// Channel Role Enum
export const CHANNEL_ROLE = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  MEMBER: "MEMBER"
} as const;

export type ChannelRole = typeof CHANNEL_ROLE[keyof typeof CHANNEL_ROLE];

// Helper Functions for Channel Status
export function getChannelStatusLabel(status: ChannelStatus): string {
  switch (status) {
  case CHANNEL_STATUS.ACTIVE:
    return "Active";
  case CHANNEL_STATUS.INACTIVE:
    return "Inactive";
  case CHANNEL_STATUS.PRIVATE:
    return "Private";
  case CHANNEL_STATUS.SUSPENDED:
    return "Suspended";
  case CHANNEL_STATUS.DELETED:
    return "Deleted";
  default:
    return status;
  }
}

export function getChannelStatusColor(status: ChannelStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (status) {
  case CHANNEL_STATUS.ACTIVE:
    return "success";
  case CHANNEL_STATUS.INACTIVE:
    return "secondary";
  case CHANNEL_STATUS.PRIVATE:
    return "info";
  case CHANNEL_STATUS.SUSPENDED:
    return "warning";
  case CHANNEL_STATUS.DELETED:
    return "error";
  default:
    return "default";
  }
}

// Helper Functions for Channel Role
export function getChannelRoleLabel(role: ChannelRole): string {
  switch (role) {
  case CHANNEL_ROLE.OWNER:
    return "Owner";
  case CHANNEL_ROLE.ADMIN:
    return "Admin";
  case CHANNEL_ROLE.MODERATOR:
    return "Moderator";
  case CHANNEL_ROLE.MEMBER:
    return "Member";
  default:
    return role;
  }
}

export function getChannelRoleColor(role: ChannelRole): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (role) {
  case CHANNEL_ROLE.OWNER:
    return "error";
  case CHANNEL_ROLE.ADMIN:
    return "warning";
  case CHANNEL_ROLE.MODERATOR:
    return "info";
  case CHANNEL_ROLE.MEMBER:
    return "default";
  default:
    return "default";
  }
}

// Dropdown Options
export const ALL_CHANNEL_STATUSES = [
  { value: CHANNEL_STATUS.ACTIVE, label: "Active" },
  { value: CHANNEL_STATUS.INACTIVE, label: "Inactive" },
  { value: CHANNEL_STATUS.PRIVATE, label: "Private" },
  { value: CHANNEL_STATUS.SUSPENDED, label: "Suspended" },
  { value: CHANNEL_STATUS.DELETED, label: "Deleted" }
] as const;

export const ALL_CHANNEL_ROLES = [
  { value: CHANNEL_ROLE.OWNER, label: "Owner" },
  { value: CHANNEL_ROLE.ADMIN, label: "Admin" },
  { value: CHANNEL_ROLE.MODERATOR, label: "Moderator" },
  { value: CHANNEL_ROLE.MEMBER, label: "Member" }
] as const;
