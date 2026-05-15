"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminOrderListItem } from "@/src/features/orders/api";

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Dispute: "bg-rose-50 text-rose-700 border-rose-200 font-bold",
  };
  const style = styles[status] ?? "bg-zinc-100 text-zinc-700 border-zinc-200";

  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${style}`}>
      {status}
    </span>
  );
};

const money = (amount: number, currency: string) => {
  const symbol = currency === "NGN" ? "₦" : currency === "ZAR" ? "R" : "";
  return `${symbol}${amount.toLocaleString()}`;
};

export const orderColumns: ColumnDef<AdminOrderListItem>[] = [
  {
    header: "Date",
    accessorKey: "orderId",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {/* <Link
          href={`/admin/orders/${encodeURIComponent(row.original.orderId)}`}
          className="font-mono font-bold text-sm text-zinc-900 hover:text-[#D4AF37] transition-colors"
        >
          #{row.original.orderId}
        </Link> */}
        <span className="text-[10px] text-zinc-800 font-mono uppercase tracking-wider">
          {new Date(row.original.date).toLocaleString()}
        </span>
      </div>
    ),
  },
    {
    header: "Product",
    accessorKey: "productName",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-zinc-700 max-w-55 truncate block">
        {row.original.productName}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    header: "Customer",
    accessorKey: "customerName",
    cell: ({ row }) => (
      <span className="text-xs font-bold text-zinc-800">
        {row.original.customerName?.trim() || "—"}
      </span>
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
    id: "actions",
    cell: ({ row }) => (
      <div className="text-right pr-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-400 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 border-zinc-200 rounded-xl shadow-xl">
            <DropdownMenuItem asChild className="text-xs font-medium cursor-pointer rounded-lg">
              <Link href={`/admin/orders/${encodeURIComponent(row.original.orderId)}`} className="flex items-center w-full">
                <Eye className="mr-2 h-3.5 w-3.5 text-zinc-400" /> View Order
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];