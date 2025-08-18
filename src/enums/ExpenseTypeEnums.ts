export const EXPENSE_TYPE = {
  TRAVEL: 1,
  EQUIPMENT: 2,
  ACCOMMODATION: 3,
  FOOD: 4,
  COMMUNICATION: 5,
  LABOR: 6,
  OTHER: 7
} as const;

export const EXPENSE_TYPE_LABELS: Record<keyof typeof EXPENSE_TYPE, string> = {
  TRAVEL: 'Travel',
  EQUIPMENT: 'Equipment',
  ACCOMMODATION: 'Accommodation',
  FOOD: 'Food',
  COMMUNICATION: 'Communication',
  LABOR: 'Labor',
  OTHER: 'Other'
} as const;

export type ExpenseTypeValue = typeof EXPENSE_TYPE[keyof typeof EXPENSE_TYPE];

export const getExpenseTypeLabel = (typeId: number): string => {
  const entry = Object.entries(EXPENSE_TYPE).find(([_, id]) => id === typeId);
  return entry ? EXPENSE_TYPE_LABELS[entry[0] as keyof typeof EXPENSE_TYPE] : 'Unknown';
};

export const getExpenseTypeOptions = () => {
  return Object.entries(EXPENSE_TYPE).map(([key, value]) => ({
    id: value,
    name: EXPENSE_TYPE_LABELS[key as keyof typeof EXPENSE_TYPE]
  }));
};