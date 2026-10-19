import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import type { MenuItem } from '../../types';
import { formatCurrency } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';

export function MenuCard({ item }: { item: MenuItem }) {
  const { add } = useCart();
  const { settings } = useSettings();
  const currency = settings?.currency ?? 'USD';

  return (
    <div className="card overflow-hidden flex flex-col group">
      <Link to={`/menu/${item._id}`} className="block relative aspect-square bg-gray-100 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-4xl">🥤</div>
        )}
        {!item.available && (
          <div className="absolute inset-0 bg-black/60 text-white grid place-items-center font-semibold">
            Unavailable
          </div>
        )}
      </Link>
      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/menu/${item._id}`}>
          <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1 flex-1">{item.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-brand-600">{formatCurrency(item.price, currency)}</span>
          <button
            onClick={() => add(item)}
            disabled={!item.available}
            className="btn-primary text-sm px-3 py-2"
            aria-label={`Add ${item.name} to cart`}
          >
            <ShoppingCart size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}