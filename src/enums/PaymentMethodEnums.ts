// Payment Method Type Enum (Legacy - for backward compatibility with numeric IDs)
// Note: The backend is transitioning to use PaymentProviderCode instead
export const PAYMENT_METHOD_TYPE_ID = {
  CREDIT_CARD: 1,
  BANK_TRANSFER: 2,
  PAYPAL: 3,
  IYZICO: 4,
  OTHER: 5
} as const;

export type PaymentMethodTypeId = typeof PAYMENT_METHOD_TYPE_ID[keyof typeof PAYMENT_METHOD_TYPE_ID];

// Payment Provider Code Enum (New string-based approach)
export const PAYMENT_PROVIDER_CODE = {
  PAYPAL: "PAYPAL",
  STRIPE: "STRIPE",
  IYZICO: "IYZICO",
  BANK_TRANSFER: "BANK_TRANSFER",
  CREDIT_CARD: "CREDIT_CARD",
  OTHER: "OTHER"
} as const;

export type PaymentProviderCode = typeof PAYMENT_PROVIDER_CODE[keyof typeof PAYMENT_PROVIDER_CODE];

// Helper Functions for Payment Method Type
export function getPaymentMethodTypeLabel(typeId: PaymentMethodTypeId): string {
  switch (typeId) {
    case PAYMENT_METHOD_TYPE_ID.CREDIT_CARD:
      return "Credit Card";
    case PAYMENT_METHOD_TYPE_ID.BANK_TRANSFER:
      return "Bank Transfer";
    case PAYMENT_METHOD_TYPE_ID.PAYPAL:
      return "PayPal";
    case PAYMENT_METHOD_TYPE_ID.IYZICO:
      return "Credit/Debit Card (Iyzico)";
    case PAYMENT_METHOD_TYPE_ID.OTHER:
      return "Other";
    default:
      return "Unknown";
  }
}

// Helper Functions for Payment Provider Code
export function getPaymentProviderLabel(code: PaymentProviderCode): string {
  switch (code) {
    case PAYMENT_PROVIDER_CODE.PAYPAL:
      return "PayPal";
    case PAYMENT_PROVIDER_CODE.STRIPE:
      return "Stripe";
    case PAYMENT_PROVIDER_CODE.IYZICO:
      return "Iyzico";
    case PAYMENT_PROVIDER_CODE.BANK_TRANSFER:
      return "Bank Transfer";
    case PAYMENT_PROVIDER_CODE.CREDIT_CARD:
      return "Credit Card";
    case PAYMENT_PROVIDER_CODE.OTHER:
      return "Other";
    default:
      return code;
  }
}

// Dropdown Options for Legacy Type IDs
export const ALL_PAYMENT_METHOD_TYPES = [
  { value: PAYMENT_METHOD_TYPE_ID.PAYPAL, label: "PayPal" },
  { value: PAYMENT_METHOD_TYPE_ID.IYZICO, label: "Credit/Debit Card (Iyzico)" },
  { value: PAYMENT_METHOD_TYPE_ID.CREDIT_CARD, label: "Credit Card" },
  { value: PAYMENT_METHOD_TYPE_ID.BANK_TRANSFER, label: "Bank Transfer" },
  { value: PAYMENT_METHOD_TYPE_ID.OTHER, label: "Other" }
] as const;

// Dropdown Options for Provider Codes
export const ALL_PAYMENT_PROVIDERS = [
  { value: PAYMENT_PROVIDER_CODE.PAYPAL, label: "PayPal" },
  { value: PAYMENT_PROVIDER_CODE.IYZICO, label: "Iyzico" },
  { value: PAYMENT_PROVIDER_CODE.STRIPE, label: "Stripe" },
  { value: PAYMENT_PROVIDER_CODE.CREDIT_CARD, label: "Credit Card" },
  { value: PAYMENT_PROVIDER_CODE.BANK_TRANSFER, label: "Bank Transfer" },
  { value: PAYMENT_PROVIDER_CODE.OTHER, label: "Other" }
] as const;
