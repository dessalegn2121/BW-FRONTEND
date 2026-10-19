import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { orderService } from '../services/orderService';
import type { Order } from '../types';
import { PageContainer } from '../components/layout/PageContainer';
import { Spinner } from '../components/ui/Spinner';
import { formatCurrency, formatDate } from '../utils/format';

export function OrderConfirmation() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const phone = (location.state as { phone?: string } | null)?.phone;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber || !phone) {
      setError('To view this confirmation, use the order number and phone number from checkout in My Orders.');
      setLoading(false);
      return;
    }
    orderService.lookup(orderNumber, phone).then(setOrder).catch((e) => setError(e?.response?.data?.message ?? 'Order not found'))
      .finally(() => setLoading(false));
  }, [orderNumber, phone]);

  if (loading) return <div className="grid place-items-center py-24"><Spinner /></div>;
  if (error || !order) return <PageContainer><p className="text-red-600">{error}</p></PageContainer>;

  return (
    <PageContainer className="max-w-2xl">
      <div className="card p-8 text-center">
        <CheckCircle size={64} className="mx-auto text-green-500" />
        <h1 className="text-2xl font-bold mt-4">Order Received!</h1>
        <p className="text-gray-600 mt-2">
          Your order <span className="font-semibold">{order.orderNumber}</span> has been placed.
        </p>

        <div className="mt-6 text-left bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Date</span><span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Status</span><span className="font-medium">{order.orderStatus}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Type</span><span className="capitalize">{order.orderType}</span>
          </div>
          <div className="border-t my-3"></div>
          {order.items.map((it, i) => (
            <div key={i} className="flex justify-between text-sm py-1">
              <span>{it.quantity}× {it.name}</span>
              <span>{formatCurrency(it.unitPrice * it.quantity, 'USD')}</span>
            </div>
          ))}
          <div className="border-t my-3"></div>
          <div className="flex justify-between font-bold">
            <span>Total</span><span className="text-brand-600">{formatCurrency(order.total, 'USD')}</span>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Please keep your order number handy. You can track your order in My Orders.
        </p>
        <div className="mt-6 flex gap-2 justify-center">
          <Link to="/my-orders" className="btn-outline">My Orders</Link>
          <Link to="/menu" className="btn-primary">Order Again</Link>
        </div>
      </div>
    </PageContainer>
  );
}