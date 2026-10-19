import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { menuService } from '../services/menuService';
import type { MenuItem } from '../types';
import { PageContainer } from '../components/layout/PageContainer';
import { Spinner } from '../components/ui/Spinner';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { formatCurrency } from '../utils/format';

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { add } = useCart();
  const { settings } = useSettings();
  const currency = settings?.currency ?? 'USD';

  const [item, setItem] = useState<MenuItem | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    menuService.get(id).then(setItem).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="grid place-items-center py-24"><Spinner /></div>;
  if (!item) return <PageContainer><p>Item not found.</p></PageContainer>;

  const handleAdd = () => {
    add(item, qty);
    navigate('/cart');
  };

  return (
    <PageContainer>
      <Link to="/menu" className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4">
        <ArrowLeft size={18} /> Back to menu
      </Link>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="card overflow-hidden aspect-square bg-gray-100">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-9xl">🥤</div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{item.name}</h1>
          <p className="mt-2 text-2xl font-bold text-brand-600">{formatCurrency(item.price, currency)}</p>
          <p className="mt-4 text-gray-600 leading-relaxed">{item.description}</p>

          {!item.available && (
            <p className="mt-4 text-red-600 font-medium">Currently unavailable</p>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2 border rounded-lg">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 grid place-items-center hover:bg-gray-50"
                aria-label="Decrease"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-10 h-10 grid place-items-center hover:bg-gray-50"
                aria-label="Increase"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={!item.available}
              className="btn-primary flex-1"
            >
              <ShoppingCart size={18} /> Add {formatCurrency(item.price * qty, currency)}
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}