"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Ban } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Updated Order type
export type Order = {
  id: string; 
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Failed" | "On-Hold" | "Dispute" | string;
  customer: string;
  location: string; // NEW
  products: string[]; 
  itemsSold: number;
  netSales: string;
  vendorEarning: string; // NEW
  vendor: string;
};

// Premium Status Badge
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Processing: "bg-amber-50 text-amber-600 border-amber-200",
    Shipped: "bg-blue-50 text-blue-600 border-blue-200",
    Delivered: "bg-emerald-50 text-emerald-600 border-emerald-200",
    Failed: "bg-rose-50 text-rose-600 border-rose-200",
    "On-Hold": "bg-zinc-100 text-zinc-600 border-zinc-200",
    Dispute: "bg-red-50 text-red-600 border-red-200 font-bold",
  };

  const style = styles[status] || styles["On-Hold"];

  return (
    <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border", style)}>
      {status}
    </span>
  );
};

export const orderColumns: ColumnDef<Order>[] = [
  {
    header: "Order ID & Date",
    accessorKey: "id",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <Link
          href={`/admin/orders/${row.original.id}`}
          className="font-mono font-bold text-sm text-zinc-900 group-hover:text-[#D4AF37] transition-colors"
        >
          #{row.original.id}
        </Link>
        <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
          {row.original.date}
        </span>
      </div>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    header: "Customer & Location",
    accessorKey: "customer",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-zinc-800">{row.original.customer}</span>
        <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
          {row.original.location}
        </span>
      </div>
    ),
  },
  {
    header: "Products",
    accessorKey: "products",
    cell: ({ row }) => {
      const products = row.original.products;
      const firstProduct = products[0] || "Unknown Item";
      const extraCount = products.length - 1;

      return (
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs font-medium text-zinc-700 max-w-[160px] truncate" title={firstProduct}>
            {firstProduct}
          </span>
          {extraCount > 0 && (
            <span className="text-[10px] font-bold bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded-sm uppercase tracking-widest">
              +{extraCount} more ({row.original.itemsSold} items)
            </span>
          )}
        </div>
      );
    },
  },
  {
    header: "Financials",
    accessorKey: "netSales",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center gap-4 text-xs">
          <span className="text-zinc-500">Gross:</span>
          <span className="font-mono font-bold text-zinc-900">{row.original.netSales}</span>
        </div>
        <div className="flex justify-between items-center gap-4 text-[10px] uppercase tracking-widest">
          <span className="text-zinc-400">Vendor:</span>
          <span className="font-mono font-bold text-emerald-600">{row.original.vendorEarning}</span>
        </div>
      </div>
    ),
  },
  {
    header: "Vendor",
    accessorKey: "vendor",
    cell: ({ row }) => (
      <span className="text-xs font-bold text-zinc-700 bg-zinc-50 border border-zinc-100 px-2 py-1 rounded-md">
        {row.original.vendor}
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
              <Link href={`/admin/orders/${row.original.id}`} className="flex items-center w-full">
                <Eye className="mr-2 h-3.5 w-3.5 text-zinc-400" /> View Order
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-100" />
            <DropdownMenuItem className="text-xs font-bold text-rose-600 cursor-pointer rounded-lg">
              <Ban className="mr-2 h-3.5 w-3.5" /> Cancel Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];