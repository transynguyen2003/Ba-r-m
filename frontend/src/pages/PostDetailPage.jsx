import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPost } from '../api/posts.js';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { formatDate } from '../utils/format.js';

export default function PostDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    getPost(slug)
      .then(setPost)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner />;
  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState title="Không tìm thấy bài viết" actionLabel="Tin tức" actionTo="/blog" />
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link to="/blog" className="text-sm font-medium text-amber-700 hover:text-amber-800">← Tin tức</Link>
      <p className="mt-4 text-sm text-slate-500">{formatDate(post.published_at)}</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">{post.title}</h1>
      {post.excerpt && <p className="mt-4 text-lg text-slate-600">{post.excerpt}</p>}
      <div
        className="prose prose-slate mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
