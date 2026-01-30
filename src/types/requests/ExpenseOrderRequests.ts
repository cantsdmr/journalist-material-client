import { ExpenseType } from "@/enums/ExpenseTypeEnums";

export type CreateExpenseOrderData = {
  channelId: string;
  typeId: ExpenseType;
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
  typeId?: ExpenseType;
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