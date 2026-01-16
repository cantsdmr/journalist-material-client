import { PaymentProviderCodeType } from '../entities/Account';

export type UpdateProfileData = {
  displayName?: string;
  photoUrl?: string;
  roleId?: number;
};

export type AddPaymentMethodData = {
  providerCode: PaymentProviderCodeType;
  currency?: string;
  isDefault?: boolean;
  payoutIdentifier: string;
  payoutDetails: {
    // PayPal
    email?: string;
    type?: 'PAYPAL';
  } | {
    // Bank Transfer - IBAN
    type: 'IBAN';
    iban: string;
    accountHolderName: string;
    swiftCode?: string;
  } | {
    // Bank Transfer - ACH
    type: 'ACH';
    accountNumber: string;
    routingNumber: string;
    accountHolderName: string;
    bankName: string;
  } | {
    // Iyzico - Turkish Identity
    type: 'IYZICO_IDENTITY';
    identityNumber: string;
    recipientName: string;
  } | {
    // Iyzico - Phone
    type: 'IYZICO_PHONE';
    phoneNumber: string;
    recipientName: string;
  } | {
    // Iyzico - Member ID
    type: 'IYZICO_MEMBER';
    memberId: string;
    recipientName: string;
  };
};

export type UpdatePaymentMethodData = {
  currency?: string;
  isDefault?: boolean;
  details?: {
    email?: string; // PayPal
    accountType?: 'personal' | 'business'; // PayPal
    cardNumber?: string; // iyzico
    expiryMonth?: string; // iyzico
    expiryYear?: string; // iyzico
    cvv?: string; // iyzico
    cardHolderName?: string; // iyzico
    cardType?: 'CREDIT' | 'DEBIT'; // iyzico
    [key: string]: any;
  };
};

export type SubscribeData = {
  tierId: string;
  paymentMethodId?: string;
}; 