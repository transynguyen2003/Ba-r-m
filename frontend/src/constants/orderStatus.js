export const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Chưa thực hiện' },
  { value: 'completed', label: 'Đã thực hiện' },
  { value: 'cancelled', label: 'Hủy' },
];

export const ORDER_STATUS_LABELS = Object.fromEntries(
  ORDER_STATUS_OPTIONS.map((o) => [o.value, o.label]),
);

export function orderStatusBadgeClass(status) {
  switch (status) {
    case 'completed':
      return 'bg-emerald-50 text-emerald-800';
    case 'cancelled':
      return 'bg-red-50 text-red-700';
    default:
      return 'bg-amber-50 text-amber-800';
  }
}
