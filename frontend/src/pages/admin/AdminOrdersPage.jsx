import { useEffect, useMemo, useState } from 'react';
import { getAdminOrders, updateAdminOrder } from '../../api/admin.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { ORDER_STATUS_OPTIONS, orderStatusBadgeClass } from '../../constants/orderStatus.js';
import { formatDate, formatPrice } from '../../utils/format.js';

const inputClass =
  'rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const params = useMemo(
    () => ({
      page,
      per_page: 15,
      search: search.trim() || undefined,
      status: statusFilter || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    }),
    [page, search, statusFilter, dateFrom, dateTo],
  );

  const loadOrders = () => {
    setLoading(true);
    getAdminOrders(params)
      .then((res) => {
        setOrders(res.data ?? []);
        setMeta(res.meta ?? null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, [params]);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    setMessage('');
    try {
      const res = await updateAdminOrder(orderId, { status });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: res.data.status } : o)),
      );
      setMessage('Đã cập nhật trạng thái đơn hàng.');
    } catch {
      setMessage('Không thể cập nhật trạng thái. Vui lòng thử lại.');
    } finally {
      setUpdatingId(null);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const lastPage = meta?.last_page ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Đơn hàng</h1>
        <p className="mt-1 text-slate-500">
          Quản lý đơn đặt từ website — tìm kiếm, lọc và cập nhật trạng thái
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <label htmlFor="order-search" className="mb-1 block text-xs font-medium text-slate-500">
              Tìm kiếm (mã đơn, tên, SĐT, email…)
            </label>
            <input
              id="order-search"
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Nhập từ khóa..."
              className={`${inputClass} w-full`}
            />
          </div>
          <div>
            <label htmlFor="order-status" className="mb-1 block text-xs font-medium text-slate-500">
              Trạng thái
            </label>
            <select
              id="order-status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className={`${inputClass} w-full`}
            >
              <option value="">Tất cả trạng thái</option>
              {ORDER_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={resetFilters}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Xóa bộ lọc
            </button>
          </div>
          <div>
            <label htmlFor="date-from" className="mb-1 block text-xs font-medium text-slate-500">
              Từ ngày
            </label>
            <input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className={`${inputClass} w-full`}
            />
          </div>
          <div>
            <label htmlFor="date-to" className="mb-1 block text-xs font-medium text-slate-500">
              Đến ngày
            </label>
            <input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className={`${inputClass} w-full`}
            />
          </div>
        </div>
      </div>

      {message && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          {message}
        </p>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Mã đơn</th>
                  <th className="px-4 py-3 font-medium">Khách hàng</th>
                  <th className="px-4 py-3 font-medium">SĐT</th>
                  <th className="px-4 py-3 font-medium">Tổng</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="px-4 py-3 font-medium">Ngày</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-mono text-xs">{o.order_code}</td>
                    <td className="px-4 py-3">{o.customer?.name ?? '—'}</td>
                    <td className="px-4 py-3">{o.customer?.phone ?? '—'}</td>
                    <td className="px-4 py-3 font-medium text-amber-700">
                      {formatPrice(o.total_amount)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        disabled={updatingId === o.id}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className={`rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium ${orderStatusBadgeClass(o.status)} disabled:opacity-60`}
                      >
                        {ORDER_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!orders.length && (
            <p className="p-8 text-center text-slate-400">Không có đơn hàng phù hợp</p>
          )}
          {lastPage > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
              <span>
                Trang {meta?.current_page ?? page} / {lastPage}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-slate-200 px-3 py-1 disabled:opacity-40"
                >
                  Trước
                </button>
                <button
                  type="button"
                  disabled={page >= lastPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-slate-200 px-3 py-1 disabled:opacity-40"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
