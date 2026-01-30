import { ExpenseOrderStatus } from "@/enums/ExpenseOrderEnums";
import { ExpenseType as ExpenseTypeEnum } from "@/enums/ExpenseTypeEnums";
import { User } from "./User";
import { Channel } from "./Channel";

export type ExpenseType = {
  id: ExpenseTypeEnum;
  name: string;
};

export type ExpenseOrder = {
  id: string;
  journalist: User;
  channel: Channel;
  type: ExpenseType;
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: ExpenseOrderStatus;
  receiptUrl?: string;
  notes?: string;
  approver?: User;
  approvedAt?: Date;
  rejectionReason?: string;
  paymentMethod?: ExpensePaymentMethod;
  paidAt?: Date;
  paymentReference?: string;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ExpensePaymentMethod = {
  id: string;
  type: string;
  details: string;
  isDefault: boolean;
};

export type ExpenseOrderStats = {
  total: number;
  draft: number;
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
  paid: number;
  cancelled: number;
  totalAmount: number;
  totalPaidAmount: number;
}; 