// Expense Type Enum
export const EXPENSE_TYPE = {
  TRAVEL: "TRAVEL",
  EQUIPMENT: "EQUIPMENT",
  ACCOMMODATION: "ACCOMMODATION",
  FOOD: "FOOD",
  COMMUNICATION: "COMMUNICATION",
  LABOR: "LABOR",
  OTHER: "OTHER"
} as const;

export type ExpenseType = typeof EXPENSE_TYPE[keyof typeof EXPENSE_TYPE];

// Helper Functions
export function getExpenseTypeLabel(type: ExpenseType): string {
  switch (type) {
  case EXPENSE_TYPE.TRAVEL:
    return "Travel";
  case EXPENSE_TYPE.EQUIPMENT:
    return "Equipment";
  case EXPENSE_TYPE.ACCOMMODATION:
    return "Accommodation";
  case EXPENSE_TYPE.FOOD:
    return "Food";
  case EXPENSE_TYPE.COMMUNICATION:
    return "Communication";
  case EXPENSE_TYPE.LABOR:
    return "Labor";
  case EXPENSE_TYPE.OTHER:
    return "Other";
  default:
    return type;
  }
}

// Dropdown Options
export const ALL_EXPENSE_TYPES = [
  { value: EXPENSE_TYPE.TRAVEL, label: "Travel" },
  { value: EXPENSE_TYPE.EQUIPMENT, label: "Equipment" },
  { value: EXPENSE_TYPE.ACCOMMODATION, label: "Accommodation" },
  { value: EXPENSE_TYPE.FOOD, label: "Food" },
  { value: EXPENSE_TYPE.COMMUNICATION, label: "Communication" },
  { value: EXPENSE_TYPE.LABOR, label: "Labor" },
  { value: EXPENSE_TYPE.OTHER, label: "Other" }
] as const;