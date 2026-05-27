export default function StatCard({ label, value, accent = 'amber' }) {
  const accents = {
    amber: 'from-amber-500/10 to-amber-600/5 ring-amber-200/60 text-amber-700',
    slate: 'from-slate-500/10 to-slate-600/5 ring-slate-200/60 text-slate-700',
    emerald: 'from-emerald-500/10 to-emerald-600/5 ring-emerald-200/60 text-emerald-700',
    sky: 'from-sky-500/10 to-sky-600/5 ring-sky-200/60 text-sky-700',
  };

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br p-6 shadow-sm ring-1 ${accents[accent] ?? accents.amber}`}
    >
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
