// Platform Fee Entity Type Enum
export const PLATFORM_FEE_ENTITY_TYPE = {
  GLOBAL: "GLOBAL",
  CHANNEL: "CHANNEL",
  TIER: "TIER"
} as const;

export type PlatformFeeEntityType = typeof PLATFORM_FEE_ENTITY_TYPE[keyof typeof PLATFORM_FEE_ENTITY_TYPE];

// Helper Functions
export function getPlatformFeeEntityTypeLabel(type: PlatformFeeEntityType): string {
  switch (type) {
  case PLATFORM_FEE_ENTITY_TYPE.GLOBAL:
    return "Global";
  case PLATFORM_FEE_ENTITY_TYPE.CHANNEL:
    return "Channel";
  case PLATFORM_FEE_ENTITY_TYPE.TIER:
    return "Tier";
  default:
    return type;
  }
}

// Dropdown Options
export const ALL_PLATFORM_FEE_ENTITY_TYPES = [
  { value: PLATFORM_FEE_ENTITY_TYPE.GLOBAL, label: "Global" },
  { value: PLATFORM_FEE_ENTITY_TYPE.CHANNEL, label: "Channel" },
  { value: PLATFORM_FEE_ENTITY_TYPE.TIER, label: "Tier" }
] as const;
