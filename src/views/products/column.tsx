/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/status-badge";
import { ProductSheet } from "./product_sheet";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const productColumns: ColumnDef<any>[] = [
  {
    header: "Product",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3 py-1">
        <div className="h-10 w-10 bg-zinc-100 rounded border border-zinc-200 shrink-0" />
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
    cell: ({ row }) => <ProductActionCell product={row.original} />,
  },
];

// Helper to manage sheet state per row
const ProductActionCell = ({ product }: { product: any }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-zinc-100 text-zinc-400 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setOpen(true)}
              className="text-xs cursor-pointer"
            >
              <Eye className="mr-2 h-3.5 w-3.5" /> Inspect / Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs text-rose-600 cursor-pointer">
              <Trash2 className="mr-2 h-3.5 w-3.5" /> Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ProductSheet product={product} open={open} onOpenChange={setOpen} />
    </>
  );
};
