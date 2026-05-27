import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../../api/admin.js';
import StatCard from '../../components/admin/StatCard.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { ORDER_STATUS_LABELS } from '../../constants/orderStatus.js';
import { formatDate, formatPrice } from '../../utils/format.js';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const stats = data?.stats ?? {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">Tổng quan hệ thống</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng sản phẩm" value={stats.products ?? 0} accent="amber" />
        <StatCard label="Tổng danh mục" value={stats.categories ?? 0} accent="slate" />
        <StatCard label="Tổng đơn hàng" value={stats.orders ?? 0} accent="emerald" />
        <StatCard label="Tổng lead" value={stats.leads ?? 0} accent="sky" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Đơn hàng gần đây</h2>
            <Link to="/admin/orders" className="text-sm text-amber-700 hover:text-amber-800">
              Xem tất cả
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="pb-2 font-medium">Mã</th>
                  <th className="pb-2 font-medium">Khách</th>
                  <th className="pb-2 font-medium">Tổng</th>
                  <th className="pb-2 font-medium">TT</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recent_orders ?? []).map((o) => (
                  <tr key={o.id} className="border-b border-slate-50">
                    <td className="py-3 font-mono text-xs">{o.order_code}</td>
                    <td className="py-3">{o.customer?.name ?? '—'}</td>
                    <td className="py-3">{formatPrice(o.total_amount)}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-800">
                        {ORDER_STATUS_LABELS[o.status] ?? o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data?.recent_orders?.length && (
              <p className="py-6 text-center text-slate-400">Chưa có đơn hàng</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Leads gần đây</h2>
            <Link to="/admin/leads" className="text-sm text-amber-700 hover:text-amber-800">
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-3">
            {(data?.recent_leads ?? []).map((l) => (
              <div key={l.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <p className="font-medium text-slate-900">{l.name}</p>
                <p className="text-sm text-slate-500">{l.phone}</p>
                <p className="mt-1 text-xs text-slate-400">{formatDate(l.created_at)}</p>
              </div>
            ))}
            {!data?.recent_leads?.length && (
              <p className="py-6 text-center text-slate-400">Chưa có lead</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
