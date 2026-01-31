import { PayoutStatus } from "@/enums/PayoutEnums";

export interface Payout {
  id: string;
  expenseOrderId: string;
  journalistId: string;
  channelId: string;
  grossAmount: number;
  platformFeeAmount: number;
  netAmount: number;
  currency: string;
  paymentMethodId: string;
  status: PayoutStatus; // "PENDING", "PROCESSING", "COMPLETED", "FAILED", "CANCELLED"
  paymentReference?: string;
  processedBy?: string;
  processedAt?: string;
  retryCount: number;
  maxRetries: number;
  nextRetryAt?: string;
  errorMessage?: string;
  errorCategory?: string;
  createdAt: string;
  updatedAt: string;
  // Related data
  expenseOrder?: {
    id: string;
    title: string;
    description: string;
    type: { name: string };
  };
  journalist?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  channel?: {
    id: string;
    name: string;
  };
}

export interface PayoutStats {
  totalPayouts: number;
  totalAmount: number;
  pendingCount: number;
  completedCount: number;
  failedCount: number;
  currency: string;
}
