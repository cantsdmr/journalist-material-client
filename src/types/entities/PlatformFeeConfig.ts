import { Channel, ChannelTier } from './Channel';

export type PlatformFeeConfig = {
  id: string;
  entityTypeId: number;
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
