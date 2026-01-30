// Expense Order Status Enum
export const EXPENSE_ORDER_STATUS = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  UNDER_REVIEW: "UNDER_REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PAID: "PAID",
  CANCELLED: "CANCELLED"
} as const;

export type ExpenseOrderStatus = typeof EXPENSE_ORDER_STATUS[keyof typeof EXPENSE_ORDER_STATUS];

// Helper Functions
export function getExpenseOrderStatusLabel(status: ExpenseOrderStatus): string {
  switch (status) {
  case EXPENSE_ORDER_STATUS.DRAFT:
    return "Draft";
  case EXPENSE_ORDER_STATUS.SUBMITTED:
    return "Submitted";
  case EXPENSE_ORDER_STATUS.UNDER_REVIEW:
    return "Under Review";
  case EXPENSE_ORDER_STATUS.APPROVED:
    return "Approved";
  case EXPENSE_ORDER_STATUS.REJECTED:
    return "Rejected";
  case EXPENSE_ORDER_STATUS.PAID:
    return "Paid";
  case EXPENSE_ORDER_STATUS.CANCELLED:
    return "Cancelled";
  default:
    return status;
  }
}

export function getExpenseOrderStatusColor(status: ExpenseOrderStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (status) {
  case EXPENSE_ORDER_STATUS.DRAFT:
    return "default";
  case EXPENSE_ORDER_STATUS.SUBMITTED:
    return "info";
  case EXPENSE_ORDER_STATUS.UNDER_REVIEW:
    return "warning";
  case EXPENSE_ORDER_STATUS.APPROVED:
    return "success";
  case EXPENSE_ORDER_STATUS.REJECTED:
    return "error";
  case EXPENSE_ORDER_STATUS.PAID:
    return "success";
  case EXPENSE_ORDER_STATUS.CANCELLED:
    return "secondary";
  default:
    return "default";
  }
}

export function getExpenseOrderStatusColorHex(status: ExpenseOrderStatus): string {
  switch (status) {
  case EXPENSE_ORDER_STATUS.DRAFT:
    return "#9e9e9e";
  case EXPENSE_ORDER_STATUS.SUBMITTED:
    return "#2196f3";
  case EXPENSE_ORDER_STATUS.UNDER_REVIEW:
    return "#ff9800";
  case EXPENSE_ORDER_STATUS.APPROVED:
    return "#4caf50";
  case EXPENSE_ORDER_STATUS.REJECTED:
    return "#f44336";
  case EXPENSE_ORDER_STATUS.PAID:
    return "#8bc34a";
  case EXPENSE_ORDER_STATUS.CANCELLED:
    return "#607d8b";
  default:
    return "#9e9e9e";
  }
}

// Dropdown Options
export const ALL_EXPENSE_ORDER_STATUSES = [
  { value: EXPENSE_ORDER_STATUS.DRAFT, label: "Draft" },
  { value: EXPENSE_ORDER_STATUS.SUBMITTED, label: "Submitted" },
  { value: EXPENSE_ORDER_STATUS.UNDER_REVIEW, label: "Under Review" },
  { value: EXPENSE_ORDER_STATUS.APPROVED, label: "Approved" },
  { value: EXPENSE_ORDER_STATUS.REJECTED, label: "Rejected" },
  { value: EXPENSE_ORDER_STATUS.PAID, label: "Paid" },
  { value: EXPENSE_ORDER_STATUS.CANCELLED, label: "Cancelled" }
] as const;

// Legacy exports for backward compatibility (will be removed)
export const ExpenseOrderStatus = EXPENSE_ORDER_STATUS;
export const ExpenseOrderStatusLabels = {
  [EXPENSE_ORDER_STATUS.DRAFT]: getExpenseOrderStatusLabel(EXPENSE_ORDER_STATUS.DRAFT),
  [EXPENSE_ORDER_STATUS.SUBMITTED]: getExpenseOrderStatusLabel(EXPENSE_ORDER_STATUS.SUBMITTED),
  [EXPENSE_ORDER_STATUS.UNDER_REVIEW]: getExpenseOrderStatusLabel(EXPENSE_ORDER_STATUS.UNDER_REVIEW),
  [EXPENSE_ORDER_STATUS.APPROVED]: getExpenseOrderStatusLabel(EXPENSE_ORDER_STATUS.APPROVED),
  [EXPENSE_ORDER_STATUS.REJECTED]: getExpenseOrderStatusLabel(EXPENSE_ORDER_STATUS.REJECTED),
  [EXPENSE_ORDER_STATUS.PAID]: getExpenseOrderStatusLabel(EXPENSE_ORDER_STATUS.PAID),
  [EXPENSE_ORDER_STATUS.CANCELLED]: getExpenseOrderStatusLabel(EXPENSE_ORDER_STATUS.CANCELLED)
};
export const ExpenseOrderStatusColors = {
  [EXPENSE_ORDER_STATUS.DRAFT]: getExpenseOrderStatusColorHex(EXPENSE_ORDER_STATUS.DRAFT),
  [EXPENSE_ORDER_STATUS.SUBMITTED]: getExpenseOrderStatusColorHex(EXPENSE_ORDER_STATUS.SUBMITTED),
  [EXPENSE_ORDER_STATUS.UNDER_REVIEW]: getExpenseOrderStatusColorHex(EXPENSE_ORDER_STATUS.UNDER_REVIEW),
  [EXPENSE_ORDER_STATUS.APPROVED]: getExpenseOrderStatusColorHex(EXPENSE_ORDER_STATUS.APPROVED),
  [EXPENSE_ORDER_STATUS.REJECTED]: getExpenseOrderStatusColorHex(EXPENSE_ORDER_STATUS.REJECTED),
  [EXPENSE_ORDER_STATUS.PAID]: getExpenseOrderStatusColorHex(EXPENSE_ORDER_STATUS.PAID),
  [EXPENSE_ORDER_STATUS.CANCELLED]: getExpenseOrderStatusColorHex(EXPENSE_ORDER_STATUS.CANCELLED)
};
