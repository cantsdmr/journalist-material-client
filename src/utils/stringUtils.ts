export const camelCaseToTitleCase = (str: string): string => {
  // First, handle special cases like "ID" or "URL"
  const specialCases: Record<string, string> = {
    'Id': 'ID',
    'Url': 'URL',
    'Api': 'API',
  };

  return str
    // Split on capital letters
    .replace(/([A-Z])/g, ' $1')
    // Capitalize first letter
    .replace(/^./, (str) => str.toUpperCase())
    // Handle special cases
    .split(' ')
    .map(word => specialCases[word] || word)
    .join(' ')
    .trim();
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    notation: 'compact',
    maximumFractionDigits: 2
  }).format(amount);
}; 