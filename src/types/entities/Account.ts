import { ChannelStaff, ChannelSubscription } from "./Channel";
import { UserRole, UserStatus } from "@/enums/UserEnums";

// Payment Provider Codes (matches backend)
export const PaymentProviderCode = {
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
  IYZICO: 'iyzico',
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  OTHER: 'other'
} as const;

export type PaymentProviderCodeType = typeof PaymentProviderCode[keyof typeof PaymentProviderCode];

// Legacy enum for backward compatibility (deprecated - use PaymentProviderCode instead)
export const PaymentMethodTypeEnum = {
  CREDIT_CARD: 1,
  BANK_TRANSFER: 2,
  PAYPAL: 3,
  IYZICO: 4,
  OTHER: 5
} as const;

export const PaymentMethodTypes = [
  { id: PaymentMethodTypeEnum.PAYPAL, name: 'PayPal', description: 'Pay with your PayPal account' },
  { id: PaymentMethodTypeEnum.IYZICO, name: 'Credit/Debit Card', description: 'Pay with your credit or debit card via Iyzico' }
];

export type UserProfile = {
  id: string;
  externalId: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  roleId: UserRole;
  statusId: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  subscriptions?: ChannelSubscription[];
  staffChannels?: ChannelStaff[];
};

// Payment Provider (replaces PaymentMethodType)
export type PaymentProvider = {
  id: string;
  code: PaymentProviderCodeType;
  name: string;
  description?: string;
  isActive: boolean;
  supportsSubscriptions: boolean;
  supportsPayouts: boolean;
  displayOrder: number;
};

// Legacy type for backward compatibility
export type PaymentMethodType = {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
};

export type PaymentMethod = {
  id: string;
  providerId: string;
  provider: PaymentProvider;
  currency: string;
  isDefault: boolean;
  expiresAt?: string;
  lastUsedAt?: string;
  payoutIdentifier?: string;
  payoutDetails?: {
    email?: string; // PayPal
    type?: string;
    accountHolderName?: string; // Bank transfer
    iban?: string;
    swiftCode?: string;
    accountNumber?: string;
    routingNumber?: string;
    bankName?: string;
    recipientName?: string; // Iyzico
    identityNumber?: string;
    phoneNumber?: string;
    memberId?: string;
    [key: string]: any;
  };
  // Legacy fields for backward compatibility (deprecated)
  typeId?: number;
  type?: PaymentMethodType;
  details?: any;
};

