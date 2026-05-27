import { useEffect, useState } from 'react';
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from '../../api/admin.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [newForm, setNewForm] = useState({
    name: '',
    slug: '',
    sort_order: 0,
    is_active: true,
  });

  const load = () => {
    setLoading(true);
    getAdminCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await createAdminCategory({
        ...newForm,
        sort_order: Number(newForm.sort_order),
      });
      setMessage('Đã thêm danh mục.');
      setNewForm({ name: '', slug: '', sort_order: 0, is_active: true });
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Thêm danh mục thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSave = async (cat, fields) => {
    setSavingId(cat.id);
    setMessage('');
    try {
      await updateAdminCategory(cat.id, fields);
      setMessage('Đã lưu danh mục.');
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Lưu thất bại.');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (cat) => {
    if ((cat.products_count ?? 0) > 0) {
      setMessage('Không thể xóa danh mục đang có sản phẩm.');
      return;
    }
    if (!window.confirm(`Xóa danh mục "${cat.name}"?`)) return;
    setMessage('');
    try {
      await deleteAdminCategory(cat.id);
      setMessage('Đã xóa danh mục.');
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Xóa danh mục thất bại.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Danh mục</h1>
        <p className="mt-1 text-slate-500">Thêm, sửa, xóa danh mục sản phẩm</p>
      </div>

      {message && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {message}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Thêm danh mục mới</h2>
        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <input
            className={inputClass}
            placeholder="Tên danh mục"
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
          <input
            type="number"
            min={0}
            className={inputClass}
            placeholder="Thứ tự"
            value={newForm.sort_order}
            onChange={(e) => setNewForm({ ...newForm, sort_order: e.target.value })}
          />
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
            className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
          >
            {submitting ? 'Đang thêm...' : 'Thêm danh mục'}
          </button>
        </form>
      </section>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <CategoryRow
              key={cat.id}
              cat={cat}
              saving={savingId === cat.id}
              onSave={handleSave}
              onDelete={handleDelete}
              inputClass={inputClass}
            />
          ))}
          {!categories.length && <p className="text-center text-slate-400">Chưa có danh mục</p>}
        </div>
      )}
    </div>
  );
}

function CategoryRow({ cat, saving, onSave, onDelete, inputClass }) {
  const [name, setName] = useState(cat.name);
  const [slug, setSlug] = useState(cat.slug);
  const [isActive, setIsActive] = useState(cat.is_active);
  const [sortOrder, setSortOrder] = useState(cat.sort_order);

  useEffect(() => {
    setName(cat.name);
    setSlug(cat.slug);
    setIsActive(cat.is_active);
    setSortOrder(cat.sort_order);
  }, [cat]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs text-slate-500">Tên</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Slug</label>
          <input className={inputClass} value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Thứ tự</label>
          <input
            type="number"
            className={inputClass}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Hiển thị
          </label>
          <button
            type="button"
            disabled={saving}
            onClick={() =>
              onSave(cat, {
                name,
                slug,
                is_active: isActive,
                sort_order: Number(sortOrder),
              })
            }
            className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-60"
          >
            {saving ? '...' : 'Lưu'}
          </button>
          <button
            type="button"
            onClick={() => onDelete(cat)}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400">{cat.products_count ?? 0} sản phẩm</p>
    </div>
  );
}
