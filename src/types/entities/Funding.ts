export type Fund = {
  id: string;
  channelId: string;
  channelWalletId: string;
  fundableId: string;
  fundableType: number;
  currentAmount: number;
  goalAmount?: number;
  currency: string;
  expiresAt?: string;
  isActive: boolean;
  goalReached: boolean;
  statusId: number;
  createdAt: string;
  updatedAt: string;
};

export type FundContribution = {
  id: string;
  fundId: string;
  userId: string;
  channelSubscriptionId?: string;
  amount: number;
  currency: string;
  transactionId?: string;
  comment?: string;
  isAnonymous: boolean;
  statusId: number;
  typeId: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    handle: string;
    name: string;
  };
};

export type FundSummary = {
  fund: Fund;
  contributions: FundContribution[];
  totalContributors: number;
  recentContributions: FundContribution[];
  topContributors: FundContribution[];
};

export type Payout = {
  transactionId: string;
  amount: number;
  currency: string;
  recipientId: string;
  status: string;
};

export type ChannelFundingStats = {
  totalRaised: number;
  totalContributions: number;
  activeFunds: number;
  completedFunds: number;
  topFundedContent: Array<{
    id: string;
    title: string;
    type: 'news' | 'poll';
    amount: number;
    currency: string;
  }>;
  currencyBreakdown: Record<string, {
    amount: number;
    contributions: number;
  }>;
};