import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../api/posts.js';
import { getFeaturedProducts } from '../api/products.js';
import { getHomePageAssets } from '../api/siteAssets.js';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ProductCard from '../components/ProductCard.jsx';
import PublicAuthButton from '../components/PublicAuthButton.jsx';
import { formatDate } from '../utils/format.js';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [posts, setPosts] = useState([]);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getFeaturedProducts(),
      getPosts({ per_page: 3 }),
      getHomePageAssets(),
    ])
      .then(([productsResult, postsResult, assetsResult]) => {
        if (productsResult.status === 'fulfilled') {
          setFeatured(Array.isArray(productsResult.value) ? productsResult.value : []);
        }
        if (postsResult.status === 'fulfilled') {
          setPosts(postsResult.value?.data ?? []);
        }
        if (assetsResult.status === 'fulfilled') {
          setHero(assetsResult.value?.home_hero_image ?? null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <section className="relative overflow-hidden">
        {hero?.url && (
          <img
            src={hero.url}
            alt={hero.title || 'Banner trang chủ'}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div
          className={`absolute inset-0 ${
            hero?.url
              ? 'bg-gradient-to-br from-amber-50/45 via-white/35 to-slate-50/30'
              : 'bg-gradient-to-br from-amber-50 via-white to-slate-50'
          }`}
        />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">Bán Rèm</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 drop-shadow-sm sm:text-5xl">
              {hero?.title || 'Rèm cửa đẹp cho không gian sống hiện đại'}
            </h1>
            <p className="mt-4 text-lg text-slate-700 drop-shadow-sm">
              {hero?.description
                || 'Tư vấn, thi công và cung cấp rèm vải, rèm cuốn, rèm gỗ chất lượng cao.'}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/products"
                className="rounded-lg bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-700"
              >
                Xem sản phẩm
              </Link>
              <Link
                to="/order"
                className="rounded-lg border border-slate-300 bg-white/90 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm hover:bg-white"
              >
                Đặt hàng / Liên hệ
              </Link>
              <PublicAuthButton className="px-5 py-3" />
            </div>
          </div>
          <div className="rounded-3xl border border-amber-100/80 bg-white/95 p-8 shadow-lg backdrop-blur-[2px]">
            <h2 className="text-xl font-bold text-slate-900">Về thương hiệu</h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Bán Rèm mang đến giải pháp rèm cửa trọn gói — từ tư vấn mẫu mã, đo đạc đến lắp đặt.
              Chúng tôi ưu tiên chất liệu bền, thiết kế tinh tế và dịch vụ tận tâm.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Sản phẩm nổi bật</h2>
            <p className="mt-1 text-slate-500">Các mẫu rèm được khách hàng quan tâm nhất</p>
          </div>
          <Link to="/products" className="text-sm font-medium text-amber-700 hover:text-amber-800">
            Xem tất cả →
          </Link>
        </div>
        {featured.length === 0 ? (
          <EmptyState title="Chưa có sản phẩm nổi bật" actionLabel="Xem sản phẩm" actionTo="/products" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900">Tin tức &amp; PR</h2>
          {posts.length === 0 ? (
            <div className="mt-8">
              <EmptyState title="Chưa có bài viết" actionLabel="Về trang chủ" />
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="rounded-2xl border border-slate-200 p-6 transition hover:border-amber-200 hover:shadow-sm"
                >
                  <p className="text-xs text-slate-500">{formatDate(post.published_at)}</p>
                  <h3 className="mt-2 font-semibold text-slate-900">{post.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="rounded-3xl bg-amber-600 px-8 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold">Cần tư vấn hoặc báo giá?</h2>
          <p className="mt-3 text-amber-100">Gửi yêu cầu — chúng tôi liên hệ trong thời gian sớm nhất.</p>
          <Link
            to="/order"
            className="mt-6 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-50"
          >
            Gửi yêu cầu ngay
          </Link>
        </div>
      </section>
    </>
  );
}
