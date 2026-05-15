"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/cards/status-badge";
import { MoreHorizontal, Eye } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminProductListItem } from "@/src/features/products/api";
import { useQueryClient } from "@tanstack/react-query";
import { productKeys } from "@/src/features/products/key";
import { getProductById } from "@/src/features/products/api";

function ActionsCell({ id }: { id: string }) {
  const qc = useQueryClient();

  return (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-zinc-100 text-zinc-400 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="border-zinc-200">
          <DropdownMenuItem asChild className="text-xs cursor-pointer">
            <Link
              href={`/admin/products/${id}`}
              onMouseEnter={() => {
                qc.prefetchQuery({
                  queryKey: productKeys.detail(id),
                  queryFn: () => getProductById(id),
                  staleTime: 60_000,
                });
              }}
              className="flex items-center w-full"
            >
              <Eye className="mr-2 h-3.5 w-3.5 text-zinc-500" /> Inspect / Edit
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ProductStatusPill({ status }: { status: string }) {
  const s = String(status || "").toLowerCase();

  const cls =
    s === "active"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : s === "pending"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : s === "rejected"
          ? "bg-rose-50 text-rose-700 border-rose-200"
          : "bg-zinc-50 text-zinc-700 border-zinc-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${cls}`}
    >
      {status}
    </span>
  );
}

export const productColumns: ColumnDef<AdminProductListItem>[] = [
  {
    header: "Product",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="py-1">
        <p className="font-bold text-zinc-900 font-display line-clamp-1 w-64">
          {row.original.name}
        </p>
        <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
          {row.original.categoryName}
        </p>
      </div>
    ),
  },
  {
    header: "Vendor",
    accessorKey: "vendorName",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-zinc-600">
        {row.original.vendorName}
      </span>
    ),
  },
  {
    header: "Price",
    accessorKey: "basePrice",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-zinc-900">
        ₦{row.original.basePrice.toLocaleString()}
      </span>
    ),
  },
  {
    header: "Stock",
    accessorKey: "stockQuantity",
    cell: ({ row }) => (
      <span className="font-mono text-zinc-500 text-xs">
        {row.original.stockQuantity} Units
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <ProductStatusPill status={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell id={row.original.id} />,
  },
];
