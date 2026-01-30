// User Status Enum
export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PENDING: "PENDING",
  BLOCKED: "BLOCKED",
  SUSPENDED: "SUSPENDED",
  BANNED: "BANNED",
  DELETED: "DELETED",
  NOT_VERIFIED: "NOT_VERIFIED"
} as const;

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

// User Role Enum
export const USER_ROLE = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  REGULAR_USER: "REGULAR_USER",
  GUEST: "GUEST",
  JOURNALIST: "JOURNALIST",
  EDITOR: "EDITOR",
  EVALUATOR: "EVALUATOR",
  FINANCE_MANAGER: "FINANCE_MANAGER"
} as const;

export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];

// Helper Functions for User Status
export function getUserStatusLabel(status: UserStatus): string {
  switch (status) {
  case USER_STATUS.ACTIVE:
    return "Active";
  case USER_STATUS.INACTIVE:
    return "Inactive";
  case USER_STATUS.PENDING:
    return "Pending";
  case USER_STATUS.BLOCKED:
    return "Blocked";
  case USER_STATUS.SUSPENDED:
    return "Suspended";
  case USER_STATUS.BANNED:
    return "Banned";
  case USER_STATUS.DELETED:
    return "Deleted";
  case USER_STATUS.NOT_VERIFIED:
    return "Not Verified";
  default:
    return status;
  }
}

export function getUserStatusColor(status: UserStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (status) {
  case USER_STATUS.ACTIVE:
    return "success";
  case USER_STATUS.INACTIVE:
    return "secondary";
  case USER_STATUS.PENDING:
    return "warning";
  case USER_STATUS.BLOCKED:
    return "error";
  case USER_STATUS.SUSPENDED:
    return "warning";
  case USER_STATUS.BANNED:
    return "error";
  case USER_STATUS.DELETED:
    return "secondary";
  case USER_STATUS.NOT_VERIFIED:
    return "info";
  default:
    return "default";
  }
}

// Helper Functions for User Role
export function getUserRoleLabel(role: UserRole): string {
  switch (role) {
  case USER_ROLE.SUPER_ADMIN:
    return "Super Admin";
  case USER_ROLE.ADMIN:
    return "Admin";
  case USER_ROLE.MODERATOR:
    return "Moderator";
  case USER_ROLE.REGULAR_USER:
    return "Regular User";
  case USER_ROLE.GUEST:
    return "Guest";
  case USER_ROLE.JOURNALIST:
    return "Journalist";
  case USER_ROLE.EDITOR:
    return "Editor";
  case USER_ROLE.EVALUATOR:
    return "Evaluator";
  case USER_ROLE.FINANCE_MANAGER:
    return "Finance Manager";
  default:
    return role;
  }
}

export function getUserRoleColor(role: UserRole): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (role) {
  case USER_ROLE.SUPER_ADMIN:
    return "error";
  case USER_ROLE.ADMIN:
    return "warning";
  case USER_ROLE.MODERATOR:
    return "info";
  case USER_ROLE.REGULAR_USER:
    return "default";
  case USER_ROLE.GUEST:
    return "secondary";
  case USER_ROLE.JOURNALIST:
    return "primary";
  case USER_ROLE.EDITOR:
    return "info";
  case USER_ROLE.EVALUATOR:
    return "info";
  case USER_ROLE.FINANCE_MANAGER:
    return "success";
  default:
    return "default";
  }
}

// Dropdown Options
export const ALL_USER_STATUSES = [
  { value: USER_STATUS.ACTIVE, label: "Active" },
  { value: USER_STATUS.INACTIVE, label: "Inactive" },
  { value: USER_STATUS.PENDING, label: "Pending" },
  { value: USER_STATUS.BLOCKED, label: "Blocked" },
  { value: USER_STATUS.SUSPENDED, label: "Suspended" },
  { value: USER_STATUS.BANNED, label: "Banned" },
  { value: USER_STATUS.NOT_VERIFIED, label: "Not Verified" }
] as const;

export const ALL_USER_ROLES = [
  { value: USER_ROLE.SUPER_ADMIN, label: "Super Admin" },
  { value: USER_ROLE.ADMIN, label: "Admin" },
  { value: USER_ROLE.MODERATOR, label: "Moderator" },
  { value: USER_ROLE.REGULAR_USER, label: "Regular User" },
  { value: USER_ROLE.GUEST, label: "Guest" },
  { value: USER_ROLE.JOURNALIST, label: "Journalist" },
  { value: USER_ROLE.EDITOR, label: "Editor" },
  { value: USER_ROLE.EVALUATOR, label: "Evaluator" },
  { value: USER_ROLE.FINANCE_MANAGER, label: "Finance Manager" }
] as const;
