// Payout Status Enum
export const PAYOUT_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED"
} as const;

export type PayoutStatus = typeof PAYOUT_STATUS[keyof typeof PAYOUT_STATUS];

// Helper Functions for Payout Status
export function getPayoutStatusLabel(status: PayoutStatus): string {
  switch (status) {
  case PAYOUT_STATUS.PENDING:
    return "Pending";
  case PAYOUT_STATUS.PROCESSING:
    return "Processing";
  case PAYOUT_STATUS.COMPLETED:
    return "Completed";
  case PAYOUT_STATUS.FAILED:
    return "Failed";
  case PAYOUT_STATUS.CANCELLED:
    return "Cancelled";
  default:
    return status;
  }
}

export function getPayoutStatusColor(status: PayoutStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (status) {
  case PAYOUT_STATUS.PENDING:
    return "warning";
  case PAYOUT_STATUS.PROCESSING:
    return "info";
  case PAYOUT_STATUS.COMPLETED:
    return "success";
  case PAYOUT_STATUS.FAILED:
    return "error";
  case PAYOUT_STATUS.CANCELLED:
    return "default";
  default:
    return "default";
  }
}

// Dropdown Options
export const ALL_PAYOUT_STATUSES = [
  { value: PAYOUT_STATUS.PENDING, label: "Pending" },
  { value: PAYOUT_STATUS.PROCESSING, label: "Processing" },
  { value: PAYOUT_STATUS.COMPLETED, label: "Completed" },
  { value: PAYOUT_STATUS.FAILED, label: "Failed" },
  { value: PAYOUT_STATUS.CANCELLED, label: "Cancelled" }
] as const;
