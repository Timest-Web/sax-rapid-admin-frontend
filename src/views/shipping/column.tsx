"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ShippingPartner } from "@/src/features/shipping/api";
import { StatusBadge } from "@/components/cards/status-badge";
import { MoreHorizontal, Trash2, Edit, Truck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function getProviderColumns(opts: {
  onEdit: (p: ShippingPartner) => void;
  onDelete: (p: ShippingPartner) => void;
}): ColumnDef<ShippingPartner>[] {
  return [
    {
      accessorKey: "name",
      header: "Partner",
      cell: ({ row }) => {
        const p = row.original;
        const logo = (p.name ?? "LP").slice(0, 2).toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
              {logo}
            </div>
            <div>
              <div className="font-bold text-zinc-900">{p.name}</div>
              <div className="text-[10px] text-zinc-500 font-mono">
                {p.partnerType || "—"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "activeLoad",
      header: "Active Load",
      cell: ({ row }) => (
        <div className="font-mono text-zinc-900 flex items-center gap-2">
          <Truck size={14} className="text-zinc-400" />
          {Number(row.original.activeLoad ?? 0).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-zinc-700">
          <Star size={14} className="text-amber-500" />
          <span className="font-mono text-sm">
            {Number(row.original.rating ?? 0).toFixed(1)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={String(row.original.status ?? "—")} />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const p = row.original;

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => opts.onEdit(p)} className="cursor-pointer text-xs">
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => opts.onDelete(p)}
                  className="cursor-pointer text-xs text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}