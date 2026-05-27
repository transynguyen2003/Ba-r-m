import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { createAdminProduct, deleteAdminProduct, getAdminCategories, getAdminProducts } from '../../api/admin.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { formatPrice } from '../../utils/format.js';

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [newForm, setNewForm] = useState({
    category_id: '',
    name: '',
    slug: '',
    price: '',
    stock_quantity: 0,
    description: '',
    is_featured: false,
    is_active: true,
  });

  const params = useMemo(() => ({
    page,
    per_page: 10,
    search: search || undefined,
    category_id: categoryId || undefined,
    min_price: minPrice || undefined,
    max_price: maxPrice || undefined,
  }), [page, search, categoryId, minPrice, maxPrice]);

  const loadProducts = () => {
    setLoading(true);
    getAdminProducts(params)
      .then((res) => {
        setProducts(res.data ?? []);
        setMeta(res.meta ?? null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getAdminCategories().then((data) => {
      setCategories(data);
      if (!newForm.category_id && data.length) {
        setNewForm((prev) => ({ ...prev, category_id: String(data[0].id) }));
      }
    });
  }, []);

  useEffect(() => {
    loadProducts();
  }, [params]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await createAdminProduct({
        ...newForm,
        category_id: Number(newForm.category_id),
        price: Number(newForm.price),
        stock_quantity: Number(newForm.stock_quantity),
      });
      setMessage('Đã thêm sản phẩm mới.');
      setNewForm((prev) => ({
        ...prev,
        name: '',
        slug: '',
        price: '',
        stock_quantity: 0,
        description: '',
        is_featured: false,
      }));
      setPage(1);
      loadProducts();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa sản phẩm này?')) return;
    await deleteAdminProduct(id);
    setMessage('Đã xóa sản phẩm.');
    loadProducts();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sản phẩm</h1>
        <p className="mt-1 text-slate-500">Thêm, xóa, sửa và tìm kiếm sản phẩm</p>
      </div>

      {message && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {message}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Thêm sản phẩm mới</h2>
        <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            className={inputClass}
            placeholder="Tên sản phẩm"
            value={newForm.name}
            onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
            required
          />
          <input
            className={inputClass}
            placeholder="Slug (tùy chọn)"
            value={newForm.slug}
            onChange={(e) => setNewForm({ ...newForm, slug: e.target.value })}
          />
          <select
            className={inputClass}
            value={newForm.category_id}
            onChange={(e) => setNewForm({ ...newForm, category_id: e.target.value })}
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            className={inputClass}
            type="number"
            min={0}
            step="0.01"
            placeholder="Giá"
            value={newForm.price}
            onChange={(e) => setNewForm({ ...newForm, price: e.target.value })}
            required
          />
          <input
            className={inputClass}
            type="number"
            min={0}
            placeholder="Tồn kho"
            value={newForm.stock_quantity}
            onChange={(e) => setNewForm({ ...newForm, stock_quantity: e.target.value })}
            required
          />
          <input
            className={`${inputClass} md:col-span-2`}
            placeholder="Mô tả"
            value={newForm.description}
            onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={newForm.is_featured}
              onChange={(e) => setNewForm({ ...newForm, is_featured: e.target.checked })}
            />
            Nổi bật
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={newForm.is_active}
              onChange={(e) => setNewForm({ ...newForm, is_active: e.target.checked })}
            />
            Hiển thị
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
          >
            {submitting ? 'Đang thêm...' : 'Thêm sản phẩm'}
          </button>
        </form>
      </section>

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-4">
        <input
          className={inputClass}
          placeholder="Tìm kiếm gần giống..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          className={inputClass}
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          className={inputClass}
          type="number"
          min={0}
          placeholder="Giá tối thiểu"
          value={minPrice}
          onChange={(e) => {
            setMinPrice(e.target.value);
            setPage(1);
          }}
        />
        <input
          className={inputClass}
          type="number"
          min={0}
          placeholder="Giá tối đa"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            setPage(1);
          }}
        />
      </section>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Ảnh</th>
                <th className="px-4 py-3 font-medium">Tên</th>
                <th className="px-4 py-3 font-medium">Danh mục</th>
                <th className="px-4 py-3 font-medium">Giá</th>
                <th className="px-4 py-3 font-medium">Hiển thị</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    {p.thumbnail_url ? (
                      <img src={p.thumbnail_url} alt="" className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                  <td className="px-4 py-3 text-slate-600">{p.category?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-amber-700">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        p.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {p.is_active ? 'Bật' : 'Tắt'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/products/${p.id}`}
                        className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
                      >
                        Sửa
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!products.length && <p className="p-8 text-center text-slate-400">Chưa có sản phẩm</p>}
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`min-w-[2.5rem] rounded-xl px-3 py-2 text-sm font-medium transition ${
                p === meta.current_page
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-amber-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
