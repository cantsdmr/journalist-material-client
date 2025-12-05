export type CreateExpenseOrderData = {
  channelId: string;
  typeId: number;
  title: string;
  description: string;
  amount: number;
  currency?: string;
  receiptUrl?: string;
  notes?: string;
};

export type UpdateExpenseOrderData = {
  title?: string;
  description?: string;
  amount?: number;
  currency?: string;
  typeId?: number;
  receiptUrl?: string;
  notes?: string;
};

export type SubmitExpenseOrderData = {
  paymentMethodId?: string;
};

export type ApproveExpenseOrderData = {
  notes?: string;
};

export type RejectExpenseOrderData = {
  rejectionReason: string;
  notes?: string
};

export type ProcessPaymentData = {
  paymentReference?: string;
}; 