/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/status-badge";
import { MoreHorizontal, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const adColumns: ColumnDef<any>[] = [
  {
    header: "Campaign",
    accessorKey: "product",
    cell: ({ row }) => (
      <div>
        <p className="font-bold text-zinc-900 text-sm">
          {row.original.product}
        </p>
        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
          {row.original.package}
        </p>
      </div>
    ),
  },
  {
    header: "Vendor",
    accessorKey: "vendor",
    cell: ({ row }) => (
      <span className="text-xs font-medium">{row.original.vendor}</span>
    ),
  },
  {
    header: "Duration",
    accessorKey: "start",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-zinc-500">
        {row.original.start} - {row.original.end}
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
    cell: () => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-zinc-100 text-zinc-400">
              <MoreHorizontal size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-xs text-rose-600 cursor-pointer">
              <Ban className="mr-2 h-3 w-3" /> Terminate Ad
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
