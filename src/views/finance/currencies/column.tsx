"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { BadgeCheck } from "lucide-react";
import { CurrencyFormModal } from "./actions";
import type { CurrencyRow } from "./mapper";

export const currencyColumns: ColumnDef<CurrencyRow>[] = [
  {
    header: "Currency",
    accessorKey: "code",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 bg-zinc-100 rounded flex items-center justify-center font-bold text-zinc-600 border border-zinc-200">
          {row.original.symbol}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-zinc-900">{row.original.code}</p>
            {row.original.isDefault && (
              <BadgeCheck size={14} className="text-sax-gold" />
            )}
          </div>
          <p className="text-[10px] text-zinc-400 font-mono uppercase">
            {row.original.name}
          </p>
        </div>
      </div>
    ),
  },
  {
    header: "Exchange Rate (Base USD)",
    accessorKey: "rate",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-zinc-900">
        {Number(row.original.rate ?? 0).toFixed(2)}
      </span>
    ),
  },
  {
    header: "Region",
    accessorKey: "region",
    cell: ({ row }) => (
      <span className="text-xs text-zinc-600">{row.original.region || "—"}</span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <span
        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
          row.original.isActive
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-zinc-50 text-zinc-500 border-zinc-200"
        }`}
      >
        {row.original.isActive ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CurrencyFormModal initialData={row.original} />,
  },
];