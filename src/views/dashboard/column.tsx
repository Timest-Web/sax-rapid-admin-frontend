"use client";

import { StatusBadge } from "@/components/cards/status-badge";
import type { ColumnDef } from "@tanstack/react-table";

function dateLabel(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function money(amount: number, currency: string) {
  return `${currency} ${Number(amount ?? 0).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
}

export type RecentOrderRow = {
  orderId: string;
  orderNumber: string;
  customerName: string;
  productName: string;
  amount: number;
  currency: string;
  status: string;
  date: string; // ISO string
};

export const recentOrdersColumns: ColumnDef<RecentOrderRow>[] = [
  {
    header: "Order",
    accessorKey: "orderNumber",
    cell: ({ row }) => (
      <div>
        <p className="font-mono font-bold text-zinc-900">
          {row.original.orderNumber}
        </p>
        <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
          {row.original.orderId}
        </p>
      </div>
    ),
  },
  {
    header: "Customer",
    accessorKey: "customerName",
    cell: ({ row }) => <span>{row.original.customerName || "—"}</span>,
  },
  {
    header: "Product",
    accessorKey: "productName",
    cell: ({ row }) => <span>{row.original.productName || "—"}</span>,
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
//   {
//     header: "Status",
//     accessorKey: "status",
//     cell: ({ row }) => <StatusBadge status={row.original.status} />,
//   },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-zinc-400">
        {dateLabel(row.original.date)}
      </span>
    ),
  },
];

export type RecentTransactionRow = {
  orderId: string;
  customerName: string;
  productName: string;
  amount: number;
  currency: string;
  date: string; // ISO string
};

export const recentTransactionsColumns: ColumnDef<RecentTransactionRow>[] = [
  {
    header: "Order",
    accessorKey: "orderId",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-zinc-900">
        {row.original.orderId}
      </span>
    ),
  },
  {
    header: "Customer",
    accessorKey: "customerName",
    cell: ({ row }) => <span>{row.original.customerName || "—"}</span>,
  },
  {
    header: "Product",
    accessorKey: "productName",
    cell: ({ row }) => <span>{row.original.productName || "—"}</span>,
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
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-zinc-400">
        {dateLabel(row.original.date)}
      </span>
    ),
  },
];
