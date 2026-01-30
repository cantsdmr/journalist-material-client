// Transaction Type Enum
export const TRANSACTION_TYPE = {
  DEPOSIT: "DEPOSIT",
  WITHDRAWAL: "WITHDRAWAL",
  TRANSFER: "TRANSFER",
  REFUND: "REFUND",
  FEE: "FEE",
  PAYMENT: "PAYMENT",
  PAYOUT: "PAYOUT",
  FUND_CONTRIBUTION: "FUND_CONTRIBUTION",
  FUND_WITHDRAWAL: "FUND_WITHDRAWAL",
  PLATFORM_FEE: "PLATFORM_FEE",
  SUBSCRIPTION_CHARGE: "SUBSCRIPTION_CHARGE"
} as const;

export type TransactionType = typeof TRANSACTION_TYPE[keyof typeof TRANSACTION_TYPE];

// Transaction Status Enum
export const TRANSACTION_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED"
} as const;

export type TransactionStatus = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS];

// Helper Functions for Transaction Type
export function getTransactionTypeLabel(type: TransactionType): string {
  switch (type) {
  case TRANSACTION_TYPE.DEPOSIT:
    return "Deposit";
  case TRANSACTION_TYPE.WITHDRAWAL:
    return "Withdrawal";
  case TRANSACTION_TYPE.TRANSFER:
    return "Transfer";
  case TRANSACTION_TYPE.REFUND:
    return "Refund";
  case TRANSACTION_TYPE.FEE:
    return "Fee";
  case TRANSACTION_TYPE.PAYMENT:
    return "Payment";
  case TRANSACTION_TYPE.PAYOUT:
    return "Payout";
  case TRANSACTION_TYPE.FUND_CONTRIBUTION:
    return "Fund Contribution";
  case TRANSACTION_TYPE.FUND_WITHDRAWAL:
    return "Fund Withdrawal";
  case TRANSACTION_TYPE.PLATFORM_FEE:
    return "Platform Fee";
  case TRANSACTION_TYPE.SUBSCRIPTION_CHARGE:
    return "Subscription Charge";
  default:
    return type;
  }
}

export function getTransactionTypeColor(type: TransactionType): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (type) {
  case TRANSACTION_TYPE.DEPOSIT:
    return "success";
  case TRANSACTION_TYPE.WITHDRAWAL:
    return "warning";
  case TRANSACTION_TYPE.TRANSFER:
    return "info";
  case TRANSACTION_TYPE.REFUND:
    return "secondary";
  case TRANSACTION_TYPE.FEE:
    return "error";
  case TRANSACTION_TYPE.PAYMENT:
    return "primary";
  case TRANSACTION_TYPE.PAYOUT:
    return "success";
  case TRANSACTION_TYPE.FUND_CONTRIBUTION:
    return "success";
  case TRANSACTION_TYPE.FUND_WITHDRAWAL:
    return "warning";
  case TRANSACTION_TYPE.PLATFORM_FEE:
    return "error";
  case TRANSACTION_TYPE.SUBSCRIPTION_CHARGE:
    return "primary";
  default:
    return "default";
  }
}

// Helper Functions for Transaction Status
export function getTransactionStatusLabel(status: TransactionStatus): string {
  switch (status) {
  case TRANSACTION_STATUS.PENDING:
    return "Pending";
  case TRANSACTION_STATUS.PROCESSING:
    return "Processing";
  case TRANSACTION_STATUS.COMPLETED:
    return "Completed";
  case TRANSACTION_STATUS.FAILED:
    return "Failed";
  case TRANSACTION_STATUS.CANCELLED:
    return "Cancelled";
  case TRANSACTION_STATUS.REFUNDED:
    return "Refunded";
  default:
    return status;
  }
}

export function getTransactionStatusColor(status: TransactionStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  switch (status) {
  case TRANSACTION_STATUS.PENDING:
    return "warning";
  case TRANSACTION_STATUS.PROCESSING:
    return "info";
  case TRANSACTION_STATUS.COMPLETED:
    return "success";
  case TRANSACTION_STATUS.FAILED:
    return "error";
  case TRANSACTION_STATUS.CANCELLED:
    return "secondary";
  case TRANSACTION_STATUS.REFUNDED:
    return "secondary";
  default:
    return "default";
  }
}

// Dropdown Options
export const ALL_TRANSACTION_TYPES = [
  { value: TRANSACTION_TYPE.DEPOSIT, label: "Deposit" },
  { value: TRANSACTION_TYPE.WITHDRAWAL, label: "Withdrawal" },
  { value: TRANSACTION_TYPE.TRANSFER, label: "Transfer" },
  { value: TRANSACTION_TYPE.REFUND, label: "Refund" },
  { value: TRANSACTION_TYPE.FEE, label: "Fee" },
  { value: TRANSACTION_TYPE.PAYMENT, label: "Payment" },
  { value: TRANSACTION_TYPE.PAYOUT, label: "Payout" },
  { value: TRANSACTION_TYPE.FUND_CONTRIBUTION, label: "Fund Contribution" },
  { value: TRANSACTION_TYPE.FUND_WITHDRAWAL, label: "Fund Withdrawal" },
  { value: TRANSACTION_TYPE.PLATFORM_FEE, label: "Platform Fee" },
  { value: TRANSACTION_TYPE.SUBSCRIPTION_CHARGE, label: "Subscription Charge" }
] as const;

export const ALL_TRANSACTION_STATUSES = [
  { value: TRANSACTION_STATUS.PENDING, label: "Pending" },
  { value: TRANSACTION_STATUS.PROCESSING, label: "Processing" },
  { value: TRANSACTION_STATUS.COMPLETED, label: "Completed" },
  { value: TRANSACTION_STATUS.FAILED, label: "Failed" },
  { value: TRANSACTION_STATUS.CANCELLED, label: "Cancelled" },
  { value: TRANSACTION_STATUS.REFUNDED, label: "Refunded" }
] as const;
