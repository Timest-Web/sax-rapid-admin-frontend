"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/status-badge";
import { MoreHorizontal, Eye, Star, Store } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export type Vendor = {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  status: string;
  rating: number;
  totalSales: string;
  products: number;
  logo: string;
};

export const vendorColumns: ColumnDef<Vendor>[] = [
  {
    header: "Store Identity",
    accessorKey: "storeName",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-zinc-900 flex items-center justify-center text-xs font-bold text-sax-gold border border-zinc-800">
          {row.original.logo}
        </div>
        <div>
          <p className="font-bold text-zinc-900 font-display">
            {row.original.storeName}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
            <Store size={10} /> {row.original.ownerName}
          </div>
        </div>
      </div>
    ),
  },
  {
    header: "Performance",
    accessorKey: "rating",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 text-xs font-bold text-zinc-900">
          <Star size={12} className="text-sax-gold fill-sax-gold" />
          {row.original.rating > 0 ? row.original.rating.toFixed(1) : "N/A"}
        </div>
        <span className="text-[10px] text-zinc-400 font-mono">
          {row.original.products} Products
        </span>
      </div>
    ),
  },
  {
    header: () => <div className="text-right">Financials</div>,
    accessorKey: "totalSales",
    cell: ({ row }) => (
      <div className="text-right">
        <p className="font-bold text-zinc-900 font-mono">
          {row.original.totalSales}
        </p>
        <p className="text-[10px] text-zinc-400 font-mono">Total Revenue</p>
      </div>
    ),
  },
  {
    header: () => <div className="text-center">Status</div>,
    accessorKey: "status",
    cell: ({ row }) => (
      <div className="text-center">
        <StatusBadge status={row.getValue("status")} />
      </div>
    ),
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
          <DropdownMenuContent
            align="end"
            className="w-48 bg-white border-zinc-200"
          >
            <DropdownMenuLabel className="text-xs font-bold text-black uppercase tracking-wider">
              Manage Store
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-100" />
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/vendors/${row.original.id}`}
                className="text-xs text-black cursor-pointer flex items-center w-full focus:bg-zinc-50"
              >
                <Eye className="mr-2 h-3.5 w-3.5 text-zinc-500" /> View Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
