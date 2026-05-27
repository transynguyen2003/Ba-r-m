import { Link } from 'react-router-dom';
import ProductImagePlaceholder from './ProductImagePlaceholder.jsx';
import { formatPrice } from '../utils/format.js';

export default function ProductCard({ product, fallbackImageUrl = null }) {
  const imageUrl = product.thumbnail_url || fallbackImageUrl;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg hover:ring-amber-100"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <ProductImagePlaceholder />
        )}
        {product.category?.name && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-amber-800 shadow-sm backdrop-blur">
            {product.category.name}
          </span>
        )}
        {!product.in_stock && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white shadow">
            Hết hàng
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 group-hover:text-amber-800">
          {product.name}
        </h3>
        <p className="mt-3 text-xl font-bold text-amber-700">{formatPrice(product.price)}</p>
        <p className="mt-auto pt-3 text-sm font-medium text-amber-600 opacity-0 transition group-hover:opacity-100">
          Xem chi tiết →
        </p>
      </div>
    </Link>
  );
}
