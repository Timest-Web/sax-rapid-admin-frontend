/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/cards/status-badge";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";

export const productColumns: ColumnDef<any>[] = [
  {
    header: "Product",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3 py-1">
        <Image src={row.original.image} alt={row.original.name} width={40} height={40} className="h-10 w-10 rounded border border-zinc-200 shrink-0 object-cover" />
        <div>
          <p className="font-bold text-zinc-900 font-display line-clamp-1 w-48">
            {row.original.name}
          </p>
          <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
            {row.original.category}
          </p>
        </div>
      </div>
    ),
  },
  {
    header: "Vendor",
    accessorKey: "vendor",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-zinc-600">
        {row.original.vendor}
      </span>
    ),
  },
  {
    header: "Price",
    accessorKey: "price",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-zinc-900">
        {row.original.price}
      </span>
    ),
  },
  {
    header: "Stock",
    accessorKey: "stock",
    cell: ({ row }) => (
      <span className="font-mono text-zinc-500 text-xs">
        {row.original.stock} Units
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-zinc-100 text-zinc-400 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-zinc-200">
            {/* Navigates directly to the comprehensive edit page */}
            <DropdownMenuItem asChild className="text-xs cursor-pointer">
              <Link href={`/admin/products/${row.original.id}`} className="flex items-center w-full">
                <Eye className="mr-2 h-3.5 w-3.5 text-zinc-500" /> Inspect / Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-100" />
            <DropdownMenuItem className="text-xs text-rose-600 cursor-pointer">
              <Trash2 className="mr-2 h-3.5 w-3.5" /> Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];