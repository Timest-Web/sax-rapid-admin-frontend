"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

export type Order = {
  id: string;
  date: string;
  items: number;
  total: string;
  status: string;
};

export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-zinc-900">
        {row.original.id}
      </span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="font-mono text-zinc-500 text-xs">
        {row.original.date}
      </span>
    ),
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => (
      <span className="font-mono text-zinc-500">{row.original.items}</span>
    ),
  },
  {
    accessorKey: "total",
    header: "Total Amount",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-zinc-900">
        {row.original.total}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const color =
        status === "Delivered"
          ? "text-emerald-600 bg-emerald-50 border-emerald-100"
          : status === "Cancelled"
            ? "text-rose-600 bg-rose-50 border-rose-100"
            : "text-amber-600 bg-amber-50 border-amber-100";

      return (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${color}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: () => (
      <button className="p-1.5 border border-zinc-200 hover:bg-zinc-900 hover:text-white transition-colors rounded">
        <Eye size={14} />
      </button>
    ),
  },
];
