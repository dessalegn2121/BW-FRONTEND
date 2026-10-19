import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Spinner } from '../../components/ui/Spinner';
import { Input } from '../../components/ui/Input';
import { formatCurrency } from '../../utils/format';

export function Reports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10));

  const load = async () => {
    setLoading(true);
    try { setData(await adminService.salesReport({ from, to })); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const exportCSV = () => {
    if (!data) return;
    const rows = [['Date', 'Orders', 'Sales'], ...data.daily.map((d: any) => [d._id, d.count, (d.total / 100).toFixed(2)])];
    const csv = rows.map((r: any[]) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `sales-report-${from}-to-${to}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sales Reports</h1>

      <div className="card p-4 mb-6 grid sm:grid-cols-3 gap-3 items-end">
        <Input label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Input label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <div className="flex gap-2">
          <button onClick={load} className="btn-primary flex-1">Run</button>
          <button onClick={exportCSV} className="btn-outline">CSV</button>
        </div>
      </div>

      {loading ? <div className="grid place-items-center py-12"><Spinner /></div> : data && (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="card p-5"><p className="text-sm text-gray-500">Total Sales</p><p className="text-3xl font-bold text-brand-600">{formatCurrency(data.totalSales)}</p></div>
            <div className="card p-5"><p className="text-sm text-gray-500">Orders</p><p className="text-3xl font-bold">{data.orderCount}</p></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h2 className="font-semibold mb-3">Daily Sales</h2>
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500"><tr><th className="py-2">Date</th><th>Orders</th><th className="text-right">Sales</th></tr></thead>
                <tbody>
                  {data.daily.map((d: any) => (
                    <tr key={d._id} className="border-t">
                      <td className="py-2">{d._id}</td><td>{d.count}</td><td className="text-right">{formatCurrency(d.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card p-6">
              <h2 className="font-semibold mb-3">Best Sellers</h2>
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500"><tr><th className="py-2">Item</th><th>Qty</th><th className="text-right">Revenue</th></tr></thead>
                <tbody>
                  {data.bestSellers.map((b: any) => (
                    <tr key={b._id} className="border-t">
                      <td className="py-2">{b._id}</td><td>{b.qty}</td><td className="text-right">{formatCurrency(b.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}