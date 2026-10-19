export function formatCurrency(amount: number, currency = 'USD'): string {
  const currencyLabel = currency.trim() || 'USD';

  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyLabel }).format(amount / 100);
  } catch (error) {
    if (!(error instanceof RangeError)) throw error;

    const formattedAmount = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount / 100);
    return `${currencyLabel} ${formattedAmount}`;
  }
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function statusColor(status: string): string {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Confirmed': return 'bg-blue-100 text-blue-800';
    case 'Preparing': return 'bg-orange-100 text-orange-800';
    case 'Ready': return 'bg-purple-100 text-purple-800';
    case 'Completed': return 'bg-green-100 text-green-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}