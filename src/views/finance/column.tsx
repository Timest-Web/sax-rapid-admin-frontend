/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/cards/status-badge";
import { PayoutModal } from "./actions";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

// ─── 1. VENDOR WALLET COLUMNS ───
export const walletColumns: ColumnDef<any>[] = [
  {
    header: "Vendor",
    accessorKey: "vendor",
    cell: ({ row }) => (
      <div>
        <p className="font-bold text-zinc-900">{row.original.vendor}</p>
        <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
          {row.original.id}
        </p>
      </div>
    ),
  },
  {
    header: "Available Balance",
    accessorKey: "balance",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-zinc-900">
        {row.original.balance}
      </span>
    ),
  },
  {
    header: "Pending / Escrow",
    accessorKey: "pending",
    cell: ({ row }) => (
      <span className="font-mono text-zinc-500 text-xs">
        {row.original.pending}
      </span>
    ),
  },
  {
    header: "Last Payout",
    accessorKey: "lastPayout",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-zinc-500">
        {row.original.lastPayout}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="text-right">
        <PayoutModal
          vendorName={row.original.vendor}
          balance={row.original.balance}
        />
      </div>
    ),
  },
];

// ─── 2. TRANSACTION LOG COLUMNS ───
export const transactionColumns: ColumnDef<any>[] = [
  {
    header: "Transaction ID",
    accessorKey: "id",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-xs">{row.original.id}</span>
    ),
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }) => {
      const isIn = row.original.amount.includes("+");
      return (
        <div className="flex items-center gap-2">
          <div
            className={`h-6 w-6 rounded-full flex items-center justify-center ${isIn ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100 text-zinc-600"}`}
          >
            {isIn ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
          </div>
          <span className="text-xs font-medium">{row.original.type}</span>
        </div>
      );
    },
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => {
      const isIn = row.original.amount.includes("+");
      return (
        <span
          className={`font-mono font-bold ${isIn ? "text-emerald-600" : "text-zinc-900"}`}
        >
          {row.original.amount}
        </span>
      );
    },
  },
  {
    header: "Parties",
    accessorKey: "from",
    cell: ({ row }) => (
      <div className="text-xs text-zinc-600">
        <span className="font-bold">{row.original.from}</span> →{" "}
        {row.original.to}
      </div>
    ),
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-zinc-400">
        {row.original.date}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      const color =
        status === "Success" || status === "Completed"
          ? "text-emerald-600 bg-emerald-50"
          : "text-amber-600 bg-amber-50";
      return (
        <span
          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-transparent ${color}`}
        >
          {status}
        </span>
      );
    },
  },
];
