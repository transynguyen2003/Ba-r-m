import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  deleteProductImage,
  getAdminCategories,
  getAdminProduct,
  updateAdminProduct,
  updateProductImageMeta,
  uploadProductImage,
} from '../../api/admin.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { getImageFileFromClipboardEvent } from '../../utils/clipboardImage.js';

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200';

export default function AdminProductEditPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [pasteHint, setPasteHint] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([getAdminProduct(id), getAdminCategories()])
      .then(([p, cats]) => {
        setProduct(p);
        setCategories(cats);
        setForm({
          category_id: p.category_id,
          name: p.name,
          slug: p.slug,
          description: p.description ?? '',
          price: p.price,
          stock_quantity: p.stock_quantity,
          is_featured: p.is_featured,
          is_active: p.is_active,
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  useEffect(() => {
    const onPaste = async (event) => {
      if (!product) return;
      const file = getImageFileFromClipboardEvent(event);
      if (!file) return;

      event.preventDefault();
      setPasteHint('Đang upload ảnh từ clipboard...');
      const fd = new FormData();
      fd.append('image', file);
      fd.append('is_primary', product.images?.length ? '0' : '1');
      setUploading(true);
      try {
        await uploadProductImage(id, fd);
        setPasteHint('Đã upload ảnh từ clipboard.');
        load();
      } catch {
        setPasteHint('Upload từ clipboard thất bại. Thử lại hoặc dùng nút Upload ảnh.');
      } finally {
        setUploading(false);
        setTimeout(() => setPasteHint(''), 2500);
      }
    };

    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [id, product]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const updated = await updateAdminProduct(id, {
        ...form,
        category_id: Number(form.category_id),
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity),
        is_featured: Boolean(form.is_featured),
        is_active: Boolean(form.is_active),
      });
      setProduct(updated);
      setMessage('Đã lưu sản phẩm.');
    } catch {
      setMessage('Lưu thất bại.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    fd.append('is_primary', product.images?.length ? '0' : '1');
    setUploading(true);
    try {
      await uploadProductImage(id, fd);
      load();
    } catch {
      setMessage('Upload ảnh thất bại. Kiểm tra backend và thử lại.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleImageMeta = async (imageId, field, value) => {
    await updateProductImageMeta(imageId, { [field]: value });
    load();
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Xóa ảnh này?')) return;
    await deleteProductImage(imageId);
    load();
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return <p className="text-slate-500">Không tìm thấy sản phẩm.</p>;

  const images = [...(product.images ?? [])].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/products" className="text-sm text-amber-700 hover:text-amber-800">
          ← Danh sách
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Sửa: {product.name}</h1>
      </div>

      {message && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-900">Thông tin cơ bản</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-slate-600">Danh mục</label>
              <select
                className={inputClass}
                value={form.category_id ?? ''}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">Tên</label>
              <input className={inputClass} value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">Slug</label>
              <input className={inputClass} value={form.slug ?? ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-600">Mô tả</label>
              <textarea
                className={`${inputClass} min-h-[120px]`}
                value={form.description ?? ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm text-slate-600">Giá</label>
                <input
                  type="number"
                  className={inputClass}
                  value={form.price ?? ''}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-slate-600">Tồn kho</label>
                <input
                  type="number"
                  className={inputClass}
                  value={form.stock_quantity ?? ''}
                  onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(form.is_featured)}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              />
              Nổi bật
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(form.is_active)}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              Hiển thị trên website
            </label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
          >
            {saving ? 'Đang lưu...' : 'Lưu thông tin'}
          </button>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Ảnh sản phẩm</h2>
            <label className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
              {uploading ? 'Đang tải...' : 'Upload ảnh'}
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>

          <div className="mb-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="font-medium text-slate-900">Tip:</span> Bạn có thể <span className="font-semibold">copy ảnh</span> rồi
            <span className="font-semibold"> Ctrl+V</span> trực tiếp tại trang này để upload.
            {pasteHint ? <span className="ml-2 text-amber-700">{pasteHint}</span> : null}
          </div>

          <div className="space-y-4">
            {images.map((img) => (
              <div key={img.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="flex gap-4">
                  <img src={img.url} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover ring-1 ring-slate-200" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="primary"
                        checked={img.is_primary}
                        onChange={() => handleImageMeta(img.id, 'is_primary', true)}
                      />
                      Ảnh chính
                    </label>
                    <input
                      className={inputClass}
                      placeholder="Alt text"
                      defaultValue={img.alt_text ?? ''}
                      onBlur={(e) => {
                        if (e.target.value !== (img.alt_text ?? '')) {
                          handleImageMeta(img.id, 'alt_text', e.target.value);
                        }
                      }}
                    />
                    <input
                      className={inputClass}
                      placeholder="Caption"
                      defaultValue={img.caption ?? ''}
                      onBlur={(e) => {
                        if (e.target.value !== (img.caption ?? '')) {
                          handleImageMeta(img.id, 'caption', e.target.value);
                        }
                      }}
                    />
                    <input
                      type="number"
                      className={inputClass}
                      defaultValue={img.sort_order}
                      onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (v !== img.sort_order) handleImageMeta(img.id, 'sort_order', v);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Xóa ảnh
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!images.length && <p className="text-sm text-slate-400">Chưa có ảnh. Upload ảnh đầu tiên.</p>}
          </div>
        </section>
      </form>
    </div>
  );
}
