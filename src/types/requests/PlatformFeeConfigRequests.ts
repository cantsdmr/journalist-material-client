import { PlatformFeeEntityType } from "@/enums/PlatformFeeEnums";

export type CreateFeeConfigData = {
  entityTypeId: PlatformFeeEntityType;
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
