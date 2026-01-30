import { Channel, ChannelTier } from './Channel';
import { PlatformFeeEntityType } from "@/enums/PlatformFeeEnums";

export type PlatformFeeConfig = {
  id: string;
  entityTypeId: PlatformFeeEntityType;
  entityId?: string;
  feePercentage: number;
  effectiveFrom: Date;
  effectiveUntil?: Date;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  channel?: Channel;
  tier?: ChannelTier;
};
