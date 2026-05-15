"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Clock, Globe, Laptop, ShoppingCart } from "lucide-react";
import Link from "next/link";

import type { BuyerActivityEvent, BuyerOrder } from "@/src/features/buyers/api";

// ---------- Helpers ----------
function money(amount: number, currency: string) {
  const symbol = currency === "NGN" ? "₦" : currency === "ZAR" ? "R" : "";
  return `${symbol}${Number(amount ?? 0).toLocaleString()}`;
}

function dateLabel(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}

function OrderStatusPill({ status }: { status: string }) {
  const s = String(status || "").toLowerCase();
  const color =
    s.includes("delivered") || s.includes("completed")
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : s.includes("cancel") || s.includes("fail")
        ? "text-rose-700 bg-rose-50 border-rose-200"
        : "text-amber-700 bg-amber-50 border-amber-200";

  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${color}`}
    >
      {status}
    </span>
  );
}

// ---------- Buyer Orders Columns (GET /api/customers/{id}/orders) ----------
// We export a factory so BuyerDetailsView can open a dialog (no order-details endpoint)
export function makeOrderColumns(opts?: {
  onView?: (order: BuyerOrder) => void; // preferred (open dialog)
  viewHref?: (order: BuyerOrder) => string; // optional fallback (navigate)
}): ColumnDef<BuyerOrder>[] {
  return [
    {
      accessorKey: "orderId",
      header: "Order ID",
      cell: ({ row }) => (
        <span className="font-mono font-bold text-zinc-900">
          {row.original.orderId}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="font-mono text-zinc-500 text-xs">
          {dateLabel(row.original.date)}
        </span>
      ),
    },
    {
      id: "itemsCount",
      header: "Items",
      cell: ({ row }) => {
        const items = row.original.items ?? [];
        const count = items.length;

        return (
          <div className="flex items-center gap-2 text-zinc-600">
            <ShoppingCart size={14} className="text-zinc-400" />
            <div className="flex flex-col leading-tight">
              <span className="font-mono text-xs">{count}</span>
              <span className="text-[10px] text-zinc-400 max-w-[260px] truncate">
                {items.join(", ") || "—"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => (
        <span className="font-mono font-bold text-zinc-900">
          {money(row.original.totalAmount, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <OrderStatusPill status={row.original.status} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const order = row.original;

        // 1) Dialog view (recommended)
        if (opts?.onView) {
          return (
            <button
              type="button"
              onClick={() => opts.onView!(order)}
              className="p-1.5 border border-zinc-200 text-zinc-500 hover:bg-zinc-900 hover:text-white transition-colors rounded"
              title="View order"
            >
              <Eye size={14} />
            </button>
          );
        }

        // 2) Navigation fallback (if you ever bring back a page)
        if (opts?.viewHref) {
          const href = opts.viewHref(order);
          return (
            <Link href={href} title="View order">
              <button
                type="button"
                className="p-1.5 border border-zinc-200 text-zinc-500 hover:bg-zinc-900 hover:text-white transition-colors rounded"
              >
                <Eye size={14} />
              </button>
            </Link>
          );
        }

        return null;
      },
    },
  ];
}

// ---------- Buyer Activity Columns (GET /api/customers/{id}/activity) ----------
export const activityColumns: ColumnDef<BuyerActivityEvent>[] = [
  {
    header: "Event",
    accessorKey: "eventType",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-zinc-50 border border-zinc-200 rounded flex items-center justify-center text-zinc-500">
          <Clock size={14} />
        </div>
        <span className="font-bold text-xs text-zinc-900">
          {row.original.eventType}
        </span>
      </div>
    ),
  },
  {
    header: "IP Address",
    accessorKey: "ipAddress",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-xs text-zinc-900">
          {row.original.ipAddress || "—"}
        </span>
        <div className="flex items-center gap-1 text-[10px] text-zinc-500">
          <Globe size={10} /> IP
        </div>
      </div>
    ),
  },
  {
    header: "User Agent",
    accessorKey: "userAgent",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-xs text-zinc-600">
        <Laptop size={14} className="text-zinc-400" />
        <span
          className="max-w-[320px] truncate"
          title={row.original.userAgent}
        >
          {row.original.userAgent || "—"}
        </span>
      </div>
    ),
  },
  {
    header: "Timestamp",
    accessorKey: "timestamp",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
        <Clock size={12} />
        {dateLabel(row.original.timestamp)}
      </div>
    ),
  },
];