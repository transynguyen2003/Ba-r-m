import { Link } from 'react-router-dom';

export default function EmptyState({ title, description, actionLabel, actionTo = '/' }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
      {actionLabel && (
        <Link
          to={actionTo}
          className="mt-6 inline-flex rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
