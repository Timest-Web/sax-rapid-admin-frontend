"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Clock, Globe, Laptop, Key } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// ─── 1. SIMPLE ORDER COLUMNS ───
export type Order = {
  id: string;
  date: string;
  items: number;
  total: string;
  status: string;
};

// Component to dynamically grab the buyerId from the URL for the link
const OrderActionLink = ({ orderId }: { orderId: string }) => {
  const params = useParams();
  const buyerId = Array.isArray(params?.id) ? params.id[0] : params?.id || "";

  return (
    <Link href={`/admin/buyers/${buyerId}/orders/${orderId}`}>
      <button className="p-1.5 border border-zinc-200 text-zinc-500 hover:bg-zinc-900 hover:text-white transition-colors rounded">
        <Eye size={14} />
      </button>
    </Link>
  );
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
    cell: ({ row }) => <OrderActionLink orderId={row.original.id} />,
  },
];

// ─── 2. ACTIVITY LOG COLUMNS ───
export type ActivityLog = {
  id: string;
  action: string;
  ipLocation: string;
  browser: string;
  timestamp: string;
};

export const activityColumns: ColumnDef<ActivityLog>[] = [
  {
    header: "Action",
    accessorKey: "action",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-zinc-50 border border-zinc-200 rounded flex items-center justify-center text-zinc-500">
          <Key size={14} />
        </div>
        <span className="font-bold text-xs text-zinc-900">{row.original.action}</span>
      </div>
    ),
  },
  {
    header: "IP Address / Location",
    accessorKey: "ipLocation",
    cell: ({ row }) => {
      const [ip, loc] = row.original.ipLocation.split("/");
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-xs text-zinc-900">{ip}</span>
          <div className="flex items-center gap-1 text-[10px] text-zinc-500">
            <Globe size={10} /> {loc}
          </div>
        </div>
      );
    },
  },
  {
    header: "Browser & OS",
    accessorKey: "browser",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-xs text-zinc-600">
        <Laptop size={14} className="text-zinc-400" />
        {row.original.browser}
      </div>
    ),
  },
  {
    header: "Timestamp",
    accessorKey: "timestamp",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
        <Clock size={12} />
        {row.original.timestamp}
      </div>
    ),
  },
];