type StatusBadgeProps = {
  status: string;
  styles?: Record<string, string>;
  fallbackStyle?: string;
  className?: string;
};

const defaultStyles: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Inactive: "bg-zinc-100 text-zinc-500 border-zinc-200",
  Suspended: "bg-rose-50 text-rose-700 border-rose-200",
  Processing: "bg-sax-gold text-zinc-900 border-sax-gold/60",
  Shipped: "bg-blue-50 text-blue-700 border-blue-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Frozen: "bg-rose-50 text-rose-700 border-rose-200",
};

export function StatusBadge({
  status,
  styles = {},
  fallbackStyle = "bg-zinc-100 text-zinc-600 border-zinc-200",
  className = "",
}: StatusBadgeProps) {
  const mergedStyles = {
    ...defaultStyles,
    ...styles,
  };

  const style = mergedStyles[status] || fallbackStyle;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${style} ${className}`}
    >
      {status}
    </span>
  );
}