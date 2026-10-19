import { FormEvent, useState } from 'react';
import { orderService } from '../services/orderService';
import type { Order } from '../types';
import { PageContainer } from '../components/layout/PageContainer';
import { Input } from '../components/ui/Input';
import { formatCurrency, formatDate, statusColor } from '../utils/format';

export function MyOrders() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); setOrder(null); setLoading(true);
    try {
      setOrder(await orderService.lookup(orderNumber, phone));
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Order not found');
    } finally { setLoading(false); }
  };

  return (
    <PageContainer className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">My Orders</h1>
      <p className="text-gray-600 mb-6">Look up your order using your order number and phone.</p>

      <form onSubmit={onSubmit} className="card p-6 space-y-4">
        <Input label="Order Number" required placeholder="BW-XXXX-XXXX" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
        <Input label="Phone Number" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button className="btn-primary" disabled={loading}>{loading ? 'Searching…' : 'Find Order'}</button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>

      {order && (
        <div className="card p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-lg">{order.orderNumber}</h2>
              <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
          </div>
          <div className="space-y-2">
            {order.items.map((it, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{it.quantity}× {it.name}</span>
                <span>{formatCurrency(it.unitPrice * it.quantity, 'USD')}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span><span>{formatCurrency(order.total, 'USD')}</span>
          </div>
        </div>
      )}
    </PageContainer>
  );
}