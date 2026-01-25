export type CreateFeeConfigData = {
  entityTypeId: number;
  entityId?: string;
  feePercentage: number;
  effectiveFrom: string;
  effectiveUntil?: string;
  description?: string;
};

export type EditFeeConfigData = {
  feePercentage?: number;
  effectiveUntil?: string;
  description?: string;
};
