import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCategories } from '../api/categories.js';
import { getProductPriceRange, getProducts } from '../api/products.js';
import { getProductPageAssets } from '../api/siteAssets.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ProductCard from '../components/ProductCard.jsx';
import PublicAuthButton from '../components/PublicAuthButton.jsx';
export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [assets, setAssets] = useState({});
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') ?? '');

  const category = searchParams.get('category') ?? '';
  const page = Number(searchParams.get('page') ?? 1);
  const sort = searchParams.get('sort') ?? '';

  const hero = assets.product_list_hero_image;
  const emptyAsset = assets.product_list_empty_image;
  const fallbackThumb = assets.product_detail_fallback_image?.url;

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    getProductPageAssets().then(setAssets).catch(() => {});
    getProductPriceRange().then(setPriceRange).catch(() => {});
  }, []);

  useEffect(() => {
    setSearch(searchParams.get('search') ?? '');
    setMinPrice(searchParams.get('min_price') ?? '');
    setMaxPrice(searchParams.get('max_price') ?? '');
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    getProducts({
      search: searchParams.get('search') || undefined,
      category: category || undefined,
      min_price: searchParams.get('min_price') || undefined,
      max_price: searchParams.get('max_price') || undefined,
      sort: searchParams.get('sort') || undefined,
      page,
      per_page: 12,
    })
      .then((res) => {
        setProducts(res.data ?? []);
        setMeta(res.meta);
      })
      .finally(() => setLoading(false));
  }, [searchParams, category, page]);

  const applyFilters = (e) => {
    e.preventDefault();
    const next = new URLSearchParams();
    if (search.trim()) next.set('search', search.trim());
    if (category) next.set('category', category);
    if (minPrice !== '' && Number(minPrice) >= 0) next.set('min_price', minPrice);
    if (maxPrice !== '' && Number(maxPrice) >= 0) next.set('max_price', maxPrice);
    if (sort) next.set('sort', sort);
    setSearchParams(next);
  };

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden bg-slate-900">
        {hero?.url && (
          <img src={hero.url} alt={hero.title || 'Banner sản phẩm'} className="absolute inset-0 h-full w-full object-cover opacity-75" />
        )}
        <div
          className={`absolute inset-0 ${
            hero?.url
              ? 'bg-gradient-to-r from-slate-900/70 via-slate-900/50 to-amber-900/25'
              : 'bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-amber-900/40'
          }`}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-300">Bộ sưu tập rèm</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold text-white drop-shadow-md sm:text-4xl lg:text-5xl">
            {hero?.title || 'Sản phẩm rèm cửa cao cấp'}
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-200 sm:text-lg">
            {hero?.description || 'Khám phá mẫu rèm vải, rèm cuốn, rèm gỗ — tư vấn và báo giá miễn phí.'}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/order"
              className="inline-flex rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-amber-400"
            >
              Nhận tư vấn miễn phí
            </Link>
            <PublicAuthButton className="border-amber-300/50 bg-amber-500/20 px-6 py-3 text-amber-100 hover:bg-amber-500/30 hover:text-white" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <form
          onSubmit={applyFilters}
          className="-mt-8 relative z-10 mb-10 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto] lg:items-end"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Tìm kiếm</label>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tên sản phẩm..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <div className="sm:w-52">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Danh mục</label>
            <select
              value={category}
              onChange={(e) => {
                const next = new URLSearchParams(searchParams);
                if (e.target.value) next.set('category', e.target.value);
                else next.delete('category');
                next.delete('page');
                setSearchParams(next);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Giá từ (VNĐ)
            </label>
            <input
              type="number"
              min={0}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder={priceRange.min ? String(Math.floor(priceRange.min)) : '0'}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Giá đến (VNĐ)
            </label>
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder={priceRange.max ? String(Math.floor(priceRange.max)) : '0'}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <div className="sm:w-52">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Sắp xếp</label>
            <select
              value={sort}
              onChange={(e) => {
                const next = new URLSearchParams(searchParams);
                if (e.target.value) next.set('sort', e.target.value);
                else next.delete('sort');
                next.delete('page');
                setSearchParams(next);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
            >
              <option value="">Mới nhất</option>
              <option value="price_asc">Giá thấp đến cao</option>
              <option value="price_desc">Giá cao đến thấp</option>
              <option value="name_asc">Tên A → Z</option>
              <option value="name_desc">Tên Z → A</option>
            </select>
          </div>
          <button type="submit" className="rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700">
            Lọc sản phẩm
          </button>
        </form>

        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            {emptyAsset?.url ? (
              <img src={emptyAsset.url} alt={emptyAsset.title || 'Không có sản phẩm'} className="mx-auto mb-6 max-h-48 rounded-2xl object-contain" />
            ) : null}
            <h3 className="text-xl font-semibold text-slate-900">{emptyAsset?.title || 'Không tìm thấy sản phẩm'}</h3>
            <p className="mt-2 text-slate-500">{emptyAsset?.description || 'Thử đổi từ khóa hoặc danh mục khác.'}</p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setMinPrice('');
                setMaxPrice('');
                setSearchParams({});
              }}
              className="mt-6 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-700"
            >
              Xem tất cả
            </button>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-slate-500">{meta?.total ?? products.length} sản phẩm</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} fallbackImageUrl={fallbackThumb} />
              ))}
            </div>
            {meta && meta.last_page > 1 && (
              <div className="mt-10 flex flex-wrap justify-center gap-2">
                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.set('page', String(p));
                      setSearchParams(next);
                    }}
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
          </>
        )}
      </div>
    </div>
  );
}
