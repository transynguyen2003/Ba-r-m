import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct } from '../api/products.js';
import { getProductPageAssets } from '../api/siteAssets.js';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ProductImagePlaceholder from '../components/ProductImagePlaceholder.jsx';
import { formatPrice } from '../utils/format.js';

function pickInitialImage(images, fallbackUrl) {
  if (!images?.length) {
    return fallbackUrl ? { url: fallbackUrl, alt_text: null, caption: null } : null;
  }
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  return sorted.find((i) => i.is_primary) || sorted[0];
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [assets, setAssets] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  const fallback = assets.product_detail_fallback_image;
  const ctaAsset = assets.product_detail_cta_image;

  useEffect(() => {
    getProductPageAssets().then(setAssets).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getProduct(slug)
      .then((data) => {
        setProduct(data);
        setActiveImage(pickInitialImage(data.images, null));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (product && !activeImage?.id && !product.images?.length && fallback?.url) {
      setActiveImage({ url: fallback.url, alt_text: fallback.title, caption: fallback.description });
    }
  }, [product, fallback, activeImage?.id]);

  if (loading) return <LoadingSpinner />;
  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <EmptyState title="Không tìm thấy sản phẩm" actionLabel="Danh sách sản phẩm" actionTo="/products" />
      </div>
    );
  }

  const sortedImages = [...(product.images || [])].sort((a, b) => a.sort_order - b.sort_order);
  const displayUrl = activeImage?.url || fallback?.url;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="mb-6 text-sm text-slate-500">
        <Link to="/products" className="hover:text-amber-700">Sản phẩm</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <div className="overflow-hidden rounded-3xl bg-slate-100 shadow-md ring-1 ring-slate-200/80">
            <div className="aspect-square">
              {displayUrl ? (
                <img
                  src={displayUrl}
                  alt={activeImage?.alt_text || product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ProductImagePlaceholder label="Chưa có ảnh sản phẩm" />
              )}
            </div>
          </div>
          {activeImage?.caption && (
            <p className="mt-3 text-center text-sm text-slate-500">{activeImage.caption}</p>
          )}
          {sortedImages.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {sortedImages.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    activeImage?.id === img.id ? 'border-amber-600 ring-2 ring-amber-200' : 'border-slate-200 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.alt_text || product.name} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:py-2">
          {product.category?.name && (
            <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 ring-1 ring-amber-100">
              {product.category.name}
            </span>
          )}
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold text-amber-700">{formatPrice(product.price)}</p>
          <span
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
              product.in_stock ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'bg-red-50 text-red-600 ring-1 ring-red-200'
            }`}
          >
            {product.in_stock ? `Còn hàng · ${product.stock_quantity} sản phẩm` : 'Hết hàng'}
          </span>
          <div className="mt-8 leading-relaxed text-slate-600">
            <p>{product.description || 'Đang cập nhật mô tả sản phẩm.'}</p>
          </div>
          <Link
            to={`/order?product=${product.slug}`}
            className="mt-8 inline-flex w-full justify-center rounded-xl bg-amber-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-amber-600/20 transition hover:bg-amber-700 sm:w-auto"
          >
            Đặt hàng / Tư vấn ngay
          </Link>
        </div>
      </div>

      <section className="mt-16 overflow-hidden rounded-3xl bg-slate-900 shadow-xl">
        <div className="grid lg:grid-cols-2">
          {ctaAsset?.url && (
            <div className="relative hidden min-h-[220px] lg:block">
              <img src={ctaAsset.url} alt={ctaAsset.title || 'Tư vấn rèm'} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-slate-900/30" />
            </div>
          )}
          <div className="flex flex-col justify-center px-8 py-10 sm:px-12">
            <h2 className="text-2xl font-bold text-white">{ctaAsset?.title || 'Cần tư vấn thiết kế rèm?'}</h2>
            <p className="mt-3 text-slate-300">
              {ctaAsset?.description || 'Gửi yêu cầu — đội ngũ Bán Rèm sẽ liên hệ báo giá và tư vấn mẫu phù hợp.'}
            </p>
            <Link
              to={`/order?product=${product.slug}`}
              className="mt-6 inline-flex w-fit rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-400"
            >
              Gửi yêu cầu tư vấn
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
