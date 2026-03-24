"use client";

import { ColumnDef } from "@tanstack/react-table";
import { OrderStatusBadge } from "@/components/cards/status-badge";
import { Eye, MoreHorizontal, Ban } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Order = {
  id: string;
  customer: string;
  vendor: string;
  date: string;
  total: string;
  status: string;
  payment: string;
  items: number;
};

export const orderColumns: ColumnDef<Order>[] = [
  {
    header: "Order ID",
    accessorKey: "id",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-zinc-900">
        {row.original.id}
      </span>
    ),
  },
  {
    header: "Customer",
    accessorKey: "customer",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-xs text-zinc-900">
          {row.original.customer}
        </span>
        <span className="text-[10px] text-zinc-500">
          {row.original.items} items
        </span>
      </div>
    ),
  },
  {
    header: "Vendor",
    accessorKey: "vendor",
    cell: ({ row }) => (
      <span className="text-xs text-zinc-600">{row.original.vendor}</span>
    ),
  },
  {
    header: "Total",
    accessorKey: "total",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-zinc-900">
        {row.original.total}
      </span>
    ),
  },
  {
    header: "Payment",
    accessorKey: "payment",
    cell: ({ row }) => (
      <span
        className={`text-[10px] font-mono font-bold uppercase ${row.original.payment === "Paid" ? "text-emerald-600" : "text-rose-600"}`}
      >
        {row.original.payment}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 border-zinc-200">
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/orders/${row.original.id}`}
                className="text-xs cursor-pointer flex items-center w-full"
              >
                <Eye className="mr-2 h-3.5 w-3.5 text-zinc-500" /> View Order
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs text-rose-600 cursor-pointer">
              <Ban className="mr-2 h-3.5 w-3.5" /> Cancel Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
