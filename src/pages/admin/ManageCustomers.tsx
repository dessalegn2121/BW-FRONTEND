import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Spinner } from '../../components/ui/Spinner';
import { formatCurrency, formatDate } from '../../utils/format';

export function ManageCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.listCustomers().then(setCustomers).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="grid place-items-center py-12"><Spinner /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Name</th><th className="p-3">Phone</th>
              <th className="p-3">Orders</th><th className="p-3">Total Spent</th><th className="p-3">Last Order</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={i} className="border-t">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3">{c.phone || '—'}</td>
                <td className="p-3">{c.orderCount ?? 0}</td>
                <td className="p-3">{formatCurrency(c.totalSpent ?? 0)}</td>
                <td className="p-3 text-gray-500">{c.lastOrder ? formatDate(c.lastOrder) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}