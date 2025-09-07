export type CreateContributionData = {
  amount: number;
  currency: string;
  paymentMethodId: string;
  comment?: string;
  isAnonymous?: boolean;
};

export type CreateFundData = {
  goalAmount?: number;
  currency?: string;
  expiresAt?: string;
};

export type UpdateFundData = {
  goalAmount?: number;
  currency?: string;
  expiresAt?: string;
  isActive?: boolean;
};

export type ProcessPayoutData = {
  amount?: number;
  recipientId: string;
  description?: string;
};