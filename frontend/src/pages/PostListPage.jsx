import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getPosts } from '../api/posts.js';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { formatDate } from '../utils/format.js';

export default function PostListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const page = Number(searchParams.get('page') ?? 1);

  useEffect(() => {
    setLoading(true);
    getPosts({ page })
      .then((res) => {
        setPosts(res.data ?? []);
        setMeta(res.meta);
      })
      .finally(() => setLoading(false));
  }, [page, searchParams]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Tin tức &amp; PR</h1>
      <p className="mt-2 text-slate-500">Cập nhật từ Bán Rèm</p>

      {loading ? (
        <LoadingSpinner />
      ) : posts.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Chưa có bài viết" />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-amber-200 hover:shadow-md"
              >
                <p className="text-xs text-slate-500">{formatDate(post.published_at)}</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">{post.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{post.excerpt}</p>
              </Link>
            ))}
          </div>
          {meta && meta.last_page > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSearchParams({ page: String(p) })}
                  className={`rounded-lg px-3 py-1 text-sm font-medium ${
                    p === meta.current_page ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'
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
  );
}
