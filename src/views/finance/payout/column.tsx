"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/cards/status-badge";
import type { WithdrawalRequest } from "@/src/features/withdrawals/api";
import { PayoutReviewModal } from "./modal";

function money(amount: number, currency: string) {
  const symbol = currency === "NGN" ? "₦" : currency === "ZAR" ? "R" : currency === "USD" ? "$" : "";
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

export const payoutColumns: ColumnDef<WithdrawalRequest>[] = [
  {
    header: "Request ID",
    accessorKey: "id",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-xs text-zinc-500">
        {row.original.id.slice(0, 8)}
      </span>
    ),
  },
  {
    header: "Vendor",
    accessorKey: "vendorName",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-zinc-900 text-sm">
          {row.original.vendorName}
        </span>
        <span className="text-[10px] text-zinc-500 font-mono">
          {row.original.bankName} • {row.original.accountNumber}
        </span>
      </div>
    ),
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-zinc-900">
        {money(row.original.amount, row.original.currency)}
      </span>
    ),
  },
  {
    header: "Requested",
    accessorKey: "createdAt",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-zinc-500">
        {dateLabel(row.original.createdAt)}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
   cell: ({ row }) => (
  <StatusBadge
    status={row.original.status}
    styles={{
      Pending: "bg-amber-50 text-amber-700 border-amber-200",

      Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",

      Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",

      Failed: "bg-rose-50 text-rose-700 border-rose-200",

      Rejected: "bg-rose-50 text-rose-700 border-rose-200",

      "On Hold": "bg-blue-50 text-blue-700 border-blue-200",
    }}
  />
),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      if (String(row.original.status).toLowerCase() === "pending") {
        return <PayoutReviewModal request={row.original} />;
      }
      return null;
    },
  },
];