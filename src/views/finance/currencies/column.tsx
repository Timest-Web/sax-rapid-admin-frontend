/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CurrencyFormModal } from "./actions";
import { BadgeCheck } from "lucide-react";

export const currencyColumns: ColumnDef<any>[] = [
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
        {row.original.rate.toFixed(2)}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <span
        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${row.original.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-zinc-50 text-zinc-500 border-zinc-200"}`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CurrencyFormModal initialData={row.original} />,
  },
];
