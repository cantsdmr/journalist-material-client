import { ExpenseOrderStatus } from "@/enums/ExpenseOrderEnums";
import { User } from "./User";
import { Channel } from "./Channel";

export type ExpenseType = {
  id: number;
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
  receipt_url?: string;
  notes?: string;
  approver?: User;
  approved_at?: Date;
  rejection_reason?: string;
  paymentMethod?: ExpensePaymentMethod;
  paid_at?: Date;
  payment_reference?: string;
  submitted_at?: Date;
  created_at: Date;
  updated_at: Date;
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