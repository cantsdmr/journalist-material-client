export enum ExpenseOrderStatus {
  DRAFT = 1,
  SUBMITTED = 2,
  UNDER_REVIEW = 3,
  APPROVED = 4,
  REJECTED = 5,
  PAID = 6,
  CANCELLED = 7
}

export const ExpenseOrderStatusLabels = {
  [ExpenseOrderStatus.DRAFT]: 'Draft',
  [ExpenseOrderStatus.SUBMITTED]: 'Submitted',
  [ExpenseOrderStatus.UNDER_REVIEW]: 'Under Review',
  [ExpenseOrderStatus.APPROVED]: 'Approved',
  [ExpenseOrderStatus.REJECTED]: 'Rejected',
  [ExpenseOrderStatus.PAID]: 'Paid',
  [ExpenseOrderStatus.CANCELLED]: 'Cancelled'
};

export const ExpenseOrderStatusColors = {
  [ExpenseOrderStatus.DRAFT]: '#9e9e9e',
  [ExpenseOrderStatus.SUBMITTED]: '#2196f3',
  [ExpenseOrderStatus.UNDER_REVIEW]: '#ff9800',
  [ExpenseOrderStatus.APPROVED]: '#4caf50',
  [ExpenseOrderStatus.REJECTED]: '#f44336',
  [ExpenseOrderStatus.PAID]: '#8bc34a',
  [ExpenseOrderStatus.CANCELLED]: '#607d8b'
}; 