export type UpdateProfileData = {
  displayName?: string;
  photoUrl?: string;
  roleId?: number;
};

export type AddPaymentMethodData = {
  type_id: number;
  currency: string;
  is_default?: boolean;
  details: {
    email?: string; // PayPal
    cardNumber?: string; // iyzico
    expiryMonth?: number; // iyzico
    expiryYear?: number; // iyzico
    cvv?: string; // iyzico
    cardHolderName?: string; // iyzico
    [key: string]: any;
  };
};

export type UpdatePaymentMethodData = {
  currency?: string;
  is_default?: boolean;
  details?: {
    email?: string; // PayPal
    cardNumber?: string; // iyzico
    expiryMonth?: number; // iyzico
    expiryYear?: number; // iyzico
    cvv?: string; // iyzico
    cardHolderName?: string; // iyzico
    [key: string]: any;
  };
};

export type SubscribeData = {
  tier_id: string;
  payment_method_id?: string;
}; 