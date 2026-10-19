import { ReactNode } from 'react';
import { formatCurrency } from '../../utils/format';
import { useSettings } from '../../context/SettingsContext';

interface Props {
  subtotal: number;
  deliveryFee?: number;
  discount?: number;
  children?: ReactNode;
}

export function CartSummary({ subtotal, deliveryFee = 0, discount = 0, children }: Props) {
  const { settings } = useSettings();
  const currency = settings?.currency ?? 'USD';
  const total = subtotal + deliveryFee - discount;

  return (
    <div className="card p-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span>{formatCurrency(subtotal, currency)}</span>
      </div>
      {deliveryFee > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery Fee</span>
          <span>{formatCurrency(deliveryFee, currency)}</span>
        </div>
      )}
      {discount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Discount</span>
          <span>−{formatCurrency(discount, currency)}</span>
        </div>
      )}
      <div className="flex justify-between pt-2 border-t font-bold text-lg">
        <span>Total</span>
        <span className="text-brand-600">{formatCurrency(total, currency)}</span>
      </div>
      {children && <div className="pt-2">{children}</div>}
    </div>
  );
}