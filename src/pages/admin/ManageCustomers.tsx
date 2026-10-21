import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { formatCurrency, formatDate } from '../../utils/format';
import type { AdminCustomer } from '../../types';

export function ManageCustomers() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;
    setLoading(true);
    setError(false);
    adminService.listCustomers()
      .then((result) => {
        if (isCurrentRequest) setCustomers(result);
      })
      .catch(() => {
        if (isCurrentRequest) setError(true);
      })
      .finally(() => {
        if (isCurrentRequest) setLoading(false);
      });
    return () => {
      isCurrentRequest = false;
    };
  }, [reloadKey]);

  if (loading) return <div className="grid place-items-center py-12"><Spinner /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      {error && (
        <div className="card mb-4 flex items-center justify-between gap-4 p-4 text-red-700" role="alert">
          <span>Unable to load customers. Please try again.</span>
          <Button variant="outline" onClick={() => setReloadKey((key) => key + 1)}>Retry</Button>
        </div>
      )}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Name</th><th className="p-3">Phone</th>
              <th className="p-3">Orders</th><th className="p-3">Total Spent</th><th className="p-3">Last Order</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3">{c.phone || '—'}</td>
                <td className="p-3">{c.orderCount ?? 0}</td>
                <td className="p-3">{formatCurrency(c.totalSpent ?? 0)}</td>
                <td className="p-3 text-gray-500">{c.lastOrder ? formatDate(c.lastOrder) : '—'}</td>
              </tr>
            ))}
            {!error && customers.length === 0 && (
              <tr className="border-t">
                <td className="p-6 text-center text-gray-500" colSpan={5}>
                  No customers found. Customers will appear here after they place an order.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}