/**
 * Formats a numeric value into INR currency format (e.g. ₹1,234.50).
 * Uses the en-IN locale format.
 * @param {number|string} amount 
 * @returns {string}
 */
export function formatCurrency(amount) {
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount)) return '₹0.00';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericAmount);
}

/**
 * Formats a YYYY-MM-DD date string into a readable representation (e.g. 04 Jun 2026).
 * @param {string} dateString 
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  // Avoid time-zone offset shifting date by appending noon time or using UTC date splits.
  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}
