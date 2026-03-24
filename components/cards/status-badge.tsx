export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Inactive: "bg-zinc-100 text-zinc-500 border-zinc-200",
    Suspended: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const style = styles[status] || styles.Inactive;

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${style}`}>
      {status}
    </span>
  );
}

export function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Processing: "bg-sax-gold text-zinc-900 border-sax-gold/60",
    Shipped: "bg-blue-50 text-blue-700 border-blue-200",
    Pending: "bg-zinc-100 text-zinc-500 border-zinc-200",
    Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
    Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const style = styles[status] || styles.Inactive;

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${style}`}>
      {status}
    </span>
  );
}