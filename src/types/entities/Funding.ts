import { FundableType, FundStatus, ContributionType, ContributionStatus } from "@/enums/FundingEnums";

export interface Fund {
  id: string;
  channelId: string;
  channelWalletId: string;
  fundableId: string;
  fundableType: FundableType; // "NEWS" or "POLL"
  currentAmount: number;
  goalAmount?: number;
  currency: string;
  expiresAt?: string;
  isActive: boolean;
  goalReached: boolean;
  status: FundStatus; // "ACTIVE", "COMPLETED", "EXPIRED", "CANCELLED"
  createdAt: string;
  updatedAt: string;
}

export interface FundContribution {
  id: string;
  fundId: string;
  userId: string;
  channelSubscriptionId?: string;
  amount: number;
  currency: string;
  transactionId?: string;
  comment?: string;
  isAnonymous: boolean;
  status: ContributionStatus; // "PENDING", "COMPLETED", "FAILED", "REFUNDED"
  type: ContributionType; // "ONE_TIME", "RECURRING"
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    handle: string;
    name: string;
  };
}

export interface FundSummary {
  fund: Fund;
  contributions: FundContribution[];
  totalContributors: number;
  recentContributions: FundContribution[];
  topContributors: FundContribution[];
}

export interface ChannelFundingStats {
  totalRaised: number;
  totalContributions: number;
  activeFunds: number;
  completedFunds: number;
  topFundedContent: Array<{
    id: string;
    title: string;
    type: FundableType;
    amount: number;
    currency: string;
  }>;
  currencyBreakdown: Record<string, {
    amount: number;
    contributions: number;
  }>;
}
