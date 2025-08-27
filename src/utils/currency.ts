export function formatAED(amount: number, locale: 'en' | 'ar' = 'en'): string {
  try {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-AE' : 'en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} AED`;
  }
}
