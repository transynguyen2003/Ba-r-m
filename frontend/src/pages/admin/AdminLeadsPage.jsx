import { useEffect, useState } from 'react';
import { getAdminLeads } from '../../api/admin.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { formatDate } from '../../utils/format.js';

const statusLabels = {
  new: 'Mới',
  contacted: 'Đã liên hệ',
  converted: 'Chuyển đổi',
  closed: 'Đóng',
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminLeads()
      .then((res) => setLeads(res.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
        <p className="mt-1 text-slate-500">Khách hàng tiềm năng</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Họ tên</th>
                <th className="px-4 py-3 font-medium">SĐT</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{l.name}</td>
                  <td className="px-4 py-3">{l.phone}</td>
                  <td className="px-4 py-3 text-slate-500">{l.email ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-800">
                      {statusLabels[l.status] ?? l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!leads.length && <p className="p-8 text-center text-slate-400">Chưa có lead</p>}
        </div>
      )}
    </div>
  );
}
