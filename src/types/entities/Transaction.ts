export type ChannelTransaction = {
  id: string;
  channelId: string;
  userId: string;
  subscriptionId?: string;
  typeId: number;
  amount: number;
  currency: string;
  statusId: number;
  fundId?: string;
  channelWalletId: string;
  externalTransactionId?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};
