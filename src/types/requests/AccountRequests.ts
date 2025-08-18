export type UpdateProfileData = {
  displayName?: string;
  photoUrl?: string;
  roleId?: number;
};

export type AddPaymentMethodData = {
  typeId: number;
  currency?: string;
  isDefault?: boolean;
  details: {
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
  tier_id: string;
  payment_method_id?: string;
}; 