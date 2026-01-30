import { TransactionType, TransactionStatus } from "@/enums/TransactionEnums";

export type ChannelTransaction = {
  id: string;
  channelId: string;
  userId: string;
  subscriptionId?: string;
  typeId: TransactionType;
  amount: number;
  currency: string;
  statusId: TransactionStatus;
  fundId?: string;
  channelWalletId: string;
  externalTransactionId?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};
