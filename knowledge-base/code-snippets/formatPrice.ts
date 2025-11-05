/**
 * Utility function for formatting prices in Norwegian Krone (NOK)
 * Used in PricingCalculator and other components
 */

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('no-NO', {
    style: 'currency',
    currency: 'NOK',
    maximumFractionDigits: 0,
  }).format(price);
};

// Eksempel bruk:
// formatPrice(15000) => "15 000 kr"
// formatPrice(299) => "299 kr"

