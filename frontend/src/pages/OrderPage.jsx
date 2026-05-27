import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { submitOrder } from '../api/orders.js';
import { getProduct, getProducts } from '../api/products.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { formatPrice } from '../utils/format.js';

const initialForm = {
  customer_name: '',
  phone: '',
  email: '',
  address: '',
  product_slug: '',
  quantity: 1,
  notes: '',
};

export default function OrderPage() {
  const [searchParams] = useSearchParams();
  const productSlug = searchParams.get('product') ?? '';

  const [form, setForm] = useState({ ...initialForm, product_slug: productSlug });
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    Promise.all([
      getProducts({ per_page: 100 }),
      productSlug ? getProduct(productSlug).catch(() => null) : Promise.resolve(null),
    ])
      .then(([listRes, product]) => {
        setProducts(listRes.data ?? []);
        if (product) setSelectedProduct(product);
      })
      .finally(() => setLoading(false));
  }, [productSlug]);

  useEffect(() => {
    if (!form.product_slug) {
      setSelectedProduct(null);
      return;
    }
    const found = products.find((p) => p.slug === form.product_slug);
    if (found) {
      setSelectedProduct(found);
      return;
    }
    getProduct(form.product_slug).then(setSelectedProduct).catch(() => setSelectedProduct(null));
  }, [form.product_slug, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setSuccess(null);
    try {
      const result = await submitOrder(form);
      setSuccess(result);
      setForm({ ...initialForm });
      setSelectedProduct(null);
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors ?? {});
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Đặt hàng / Liên hệ</h1>
      <p className="mt-2 text-slate-500">Điền thông tin — chúng tôi sẽ liên hệ xác nhận đơn hàng.</p>

      {success && (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6 text-green-800">
          <p className="font-semibold">{success.message}</p>
          <p className="mt-2 text-sm">Mã đơn: <strong>{success.data.order_code}</strong></p>
          <p className="text-sm">Tổng tiền: {formatPrice(success.data.total_amount)}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Sản phẩm *</label>
          <select
            name="product_slug"
            value={form.product_slug}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
          >
            <option value="">Chọn sản phẩm</option>
            {products.map((p) => (
              <option key={p.id} value={p.slug}>{p.name}</option>
            ))}
          </select>
          {errors.product_slug && <p className="mt-1 text-xs text-red-500">{errors.product_slug[0]}</p>}
        </div>

        {selectedProduct && (
          <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Giá: {formatPrice(selectedProduct.price)} ·{' '}
            {selectedProduct.in_stock ? 'Còn hàng' : 'Hết hàng'}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Họ tên *</label>
            <input name="customer_name" value={form.customer_name} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" />
            {errors.customer_name && <p className="mt-1 text-xs text-red-500">{errors.customer_name[0]}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Số điện thoại *</label>
            <input name="phone" value={form.phone} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone[0]}</p>}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Địa chỉ</label>
          <textarea name="address" value={form.address} onChange={handleChange} rows={2} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Số lượng *</label>
          <input type="number" name="quantity" min={1} max={99} value={form.quantity} onChange={handleChange} required className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" />
          {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity[0]}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Ghi chú</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200" />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-amber-600 py-3 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
        >
          {submitting ? 'Đang gửi...' : 'Gửi đơn hàng'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Hoặc <Link to="/products" className="font-medium text-amber-700 hover:underline">chọn sản phẩm</Link> trước khi đặt.
      </p>
    </div>
  );
}
