import { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Clock, CheckCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { StatCard } from '../../components/admin/StatCard';
import { Spinner } from '../../components/ui/Spinner';
import { formatCurrency } from '../../utils/format';

export function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.dashboard().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="grid place-items-center py-24"><Spinner /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Sales" value={formatCurrency(data?.todaySales ?? 0)} icon={<DollarSign />} color="bg-green-500" />
        <StatCard label="Today's Orders" value={data?.todayOrders ?? 0} icon={<ShoppingBag />} color="bg-blue-500" />
        <StatCard label="Pending Orders" value={data?.pendingOrders ?? 0} icon={<Clock />} color="bg-yellow-500" />
        <StatCard label="Completed Today" value={data?.completedOrders ?? 0} icon={<CheckCircle />} color="bg-purple-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Popular Items</h2>
          {data?.popularItems?.length ? (
            <ul className="space-y-2">
              {data.popularItems.map((p: any, i: number) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>{p._id}</span>
                  <span className="font-medium">{p.count} sold</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-500 text-sm">No data yet.</p>}
        </div>
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Alerts</h2>
          <p className="text-sm text-gray-700">
            Unavailable items: <span className="font-semibold">{data?.unavailableItems ?? 0}</span>
          </p>
        </div>
      </div>
    </div>
  );
}