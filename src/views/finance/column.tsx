"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PayoutModal, ToggleFreezeButton } from "./actions";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

export type VendorWalletRow = {
  vendorId: string;
  vendorName: string;
  balance: string;
  pending: string;
  lastPayout: string; // always string
  status: string;     // e.g. "Active" | "Frozen" | "Inactive"
  rawBalance: number;
  currency: string;
};

export type FinanceTransactionRow = {
  id: string;
  type: string;
  amount: string; // includes + or -
  from: string;
  to: string;
  date: string;
  status: string; // e.g. "Paid" | "Pending" | "Refunded" | "Completed"
};


function StatusPill({ status }: { status: string }) {
  const raw = String(status ?? "");
  const s = raw.trim();

  const key = s.toLowerCase();

  const style =
    key === "active" || key === "paid" || key === "completed" || key === "success"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : key === "pending"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : key === "refunded" || key === "cancelled" || key === "canceled" || key === "failed"
          ? "bg-rose-50 text-rose-700 border-rose-200"
          : key === "frozen" || key === "suspended"
            ? "bg-rose-50 text-rose-700 border-rose-200"
            : "bg-zinc-100 text-zinc-600 border-zinc-200";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${style}`}
      title={raw}
    >
      {s || "—"}
    </span>
  );
}

function isFrozen(status: string) {
  return String(status ?? "").trim().toLowerCase() === "frozen";
}

// ─── 1) VENDOR WALLET COLUMNS ───
export const walletColumns: ColumnDef<VendorWalletRow>[] = [
  {
    header: "Vendor",
    accessorKey: "vendorName",
    cell: ({ row }) => (
      <div>
        <p className="font-bold text-zinc-900">{row.original.vendorName}</p>
        <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
          {row.original.vendorId}
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
    cell: ({ row }) => <StatusPill status={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2">
        <ToggleFreezeButton
          vendorId={row.original.vendorId}
          currentStatus={row.original.status}
        />

        <PayoutModal
          vendorId={row.original.vendorId}
          vendorName={row.original.vendorName}
          balanceText={row.original.balance}
          maxAmount={row.original.rawBalance}
          currency={row.original.currency}
          disabled={isFrozen(row.original.status)}
        />
      </div>
    ),
  },
];

// ─── 2) TRANSACTION LOG COLUMNS ───
export const transactionColumns: ColumnDef<FinanceTransactionRow>[] = [
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
            className={`h-6 w-6 rounded-full flex items-center justify-center ${
              isIn
                ? "bg-emerald-100 text-emerald-600"
                : "bg-zinc-100 text-zinc-600"
            }`}
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
          className={`font-mono font-bold ${
            isIn ? "text-emerald-600" : "text-zinc-900"
          }`}
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
        <span className="font-bold">{row.original.from}</span> → {row.original.to}
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
    cell: ({ row }) => <StatusPill status={row.original.status} />,
  },
];