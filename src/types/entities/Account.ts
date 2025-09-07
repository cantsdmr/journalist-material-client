import { ChannelStaff, ChannelSubscription } from "./Channel";

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
  roleId: number;
  statusId: number;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  subscriptions?: ChannelSubscription[];
  staffChannels?: ChannelStaff[];
};

export type PaymentMethodType = {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
};

export type PaymentMethod = {
  id: string;
  typeId: number;
  type: PaymentMethodType;
  currency: string;
  isDefault: boolean;
  expiresAt?: string;
  lastUsedAt?: string;
  details: {
    email?: string; // PayPal
    cardNumber?: string; // iyzico (masked)
    expiryMonth?: number; // iyzico
    expiryYear?: number; // iyzico
    cardHolderName?: string; // iyzico
    [key: string]: any;
  };
};

