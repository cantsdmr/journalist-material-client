export const UserStatus = {
    ACTIVE: 1,
    INACTIVE: 2,
    PENDING: 3,
    BLOCKED: 4,
    SUSPENDED: 5,
    BANNED: 6,
    DELETED: 7,
    NOT_VERIFIED: 8
  } as const;


export const UserRole = {
    SUPER_ADMIN: 1,
    ADMIN: 2,
    MODERATOR: 3,
    REGULAR_USER: 4,
    GUEST: 5,
    JOURNALIST: 6,
    EDITOR: 7,
    EVALUATOR: 8,
    FINANCE_MANAGER: 9
  } as const;
  