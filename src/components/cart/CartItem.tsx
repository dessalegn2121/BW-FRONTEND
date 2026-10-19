import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartLine } from '../../types';
import { formatCurrency } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';

export function CartItem({ line }: { line: CartLine }) {
  const { updateQty, remove } = useCart();
  const { settings } = useSettings();
  const currency = settings?.currency ?? 'USD';

  return (
    <div className="flex gap-4 py-4 border-b last:border-0">
      <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden shrink-0">
        {line.imageUrl ? (
          <img src={line.imageUrl} alt={line.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-2xl">🥤</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{line.name}</h4>
        <p className="text-sm text-gray-500">{formatCurrency(line.unitPrice, currency)} each</p>
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => updateQty(line.menuItemId, line.quantity - 1)}
            className="w-8 h-8 rounded-lg border grid place-items-center hover:bg-gray-50"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center font-medium">{line.quantity}</span>
          <button
            onClick={() => updateQty(line.menuItemId, line.quantity + 1)}
            className="w-8 h-8 rounded-lg border grid place-items-center hover:bg-gray-50"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={() => remove(line.menuItemId)}
            className="ml-auto p-2 text-red-600 hover:bg-red-50 rounded-lg"
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="text-right font-semibold">
        {formatCurrency(line.unitPrice * line.quantity, currency)}
      </div>
    </div>
  );
}