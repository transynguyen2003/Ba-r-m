export default function LoadingSpinner({ label = 'Đang tải...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
