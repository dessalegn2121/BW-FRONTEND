import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import type { Order, OrderStatus } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { formatCurrency, formatDate, statusColor } from '../../utils/format';

const STATUSES: OrderStatus[] = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

export function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [active, setActive] = useState<Order | null>(null);
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminService.listOrders({ status: filter || undefined, limit: 50 });
      setOrders(res.orders);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const viewOrder = async (order: Order) => {
    setLoadingOrderId(order._id);
    try {
      setActive(await adminService.getOrder(order._id));
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Unable to load order details');
    } finally {
      setLoadingOrderId(null);
    }
  };

  const changeStatus = async (order: Order, status: OrderStatus) => {
    let reason: string | undefined;
    if (status === 'Cancelled') {
      reason = prompt('Cancellation reason?') ?? undefined;
      if (!reason) return;
    }
    try {
      await adminService.updateOrderStatus(order._id, status, reason);
      load();
      setActive(null);
    } catch (e: any) {
      alert(e?.response?.data?.error ?? 'Update failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Orders</h1>
        <select className="input max-w-xs" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <div className="grid place-items-center py-12"><Spinner /></div> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Order #</th><th className="p-3">Customer</th>
                <th className="p-3">Type</th><th className="p-3">Total</th>
                <th className="p-3">Status</th><th className="p-3">Date</th><th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t">
                  <td className="p-3 font-mono text-xs">{o.orderNumber}</td>
                  <td className="p-3">{o.customerName}<br /><span className="text-gray-500 text-xs">{o.customerPhone}</span></td>
                  <td className="p-3 capitalize">{o.orderType}</td>
                  <td className="p-3">{formatCurrency(o.total)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor(o.orderStatus)}`}>{o.orderStatus}</span>
                  </td>
                  <td className="p-3 text-gray-500 text-xs">{formatDate(o.createdAt)}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => viewOrder(o)} disabled={loadingOrderId === o._id} className="btn-outline text-xs px-3 py-1">
                      {loadingOrderId === o._id ? 'Loading…' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!active} onClose={() => setActive(null)} title={active ? `Order ${active.orderNumber}` : ''}>
        {active && (
          <div className="space-y-4">
            <div className="text-sm space-y-1">
              <p><strong>Customer:</strong> {active.customerName} ({active.customerPhone})</p>
              <p><strong>Type:</strong> {active.orderType}</p>
              {active.tableNumber && <p><strong>Table:</strong> {active.tableNumber}</p>}
              {active.dineInDate && <p><strong>Dine-in date:</strong> {active.dineInDate}</p>}
              {active.dineInTime && <p><strong>Dine-in time:</strong> {active.dineInTime}</p>}
              {active.dineInTime && <p><strong>Reserved duration:</strong> 6 hours</p>}
              {active.pickupName && <p><strong>Pickup name:</strong> {active.pickupName}</p>}
              {active.pickupPhone && <p><strong>Pickup phone:</strong> {active.pickupPhone}</p>}
              {active.deliveryAddress && (
                <p><strong>{active.orderType === 'takeaway' ? 'Pickup address' : 'Address'}:</strong> {active.deliveryAddress}</p>
              )}
              <p><strong>Payment:</strong> {active.paymentMethod}</p>
              {active.notes && <p><strong>Notes:</strong> {active.notes}</p>}
            </div>

            {active.paymentReceipt && (
              <div className="border-t pt-3">
                <p className="font-semibold text-sm mb-2">Uploaded payment receipt</p>
                <a href={active.paymentReceipt} target="_blank" rel="noreferrer">
                  <img src={active.paymentReceipt} alt={`Payment receipt for order ${active.orderNumber}`} className="max-h-72 rounded-lg border object-contain" />
                </a>
              </div>
            )}

            <div className="border-t pt-3">
              {active.items.map((it, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span>{it.quantity}× {it.name}</span>
                  <span>{formatCurrency(it.unitPrice * it.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2 border-t mt-2">
                <span>Total</span><span>{formatCurrency(active.total)}</span>
              </div>
            </div>

            <div>
              <label className="label">Change status</label>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => changeStatus(active, s)}
                    disabled={s === active.orderStatus}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                      s === active.orderStatus
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
