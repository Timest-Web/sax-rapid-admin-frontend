"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { AdminLocation } from "@/src/features/locations/api";
import { StatusBadge } from "@/components/cards/status-badge";
import { MoreHorizontal, Settings, Map, Users, Wallet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function dateLabel(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function money(amount?: number, currency?: string) {
  const a = Number(amount ?? 0);
  return `${currency ?? ""} ${a.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export const getLocationColumns = (opts: {
  onManageStates: (loc: AdminLocation) => void;
  onEdit: (loc: AdminLocation) => void;
}): ColumnDef<AdminLocation>[] => [
  {
    header: "Location",
    accessorKey: "countryName",
    cell: ({ row }) => (
      <div>
        <div className="font-bold text-zinc-900">{row.original.countryName}</div>
        <div className="text-[10px] text-zinc-500 font-mono">{row.original.id}</div>
      </div>
    ),
  },
  {
    header: "Currency",
    accessorKey: "currency",
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.currency ?? "—"}</span>,
  },
  {
    header: "Vendors",
    accessorKey: "vendorCount",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-zinc-700">
        <Users size={14} />
        <span className="font-mono text-xs">{Number(row.original.vendorCount ?? 0)}</span>
      </div>
    ),
  },
  {
    header: "Revenue",
    accessorKey: "revenue",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-zinc-700">
        <Wallet size={14} className="text-amber-500" />
        <span className="font-mono text-xs">{money(row.original.revenue, row.original.currency)}</span>
      </div>
    ),
  },
  {
    header: "Market Status",
    accessorKey: "marketStatus",
    cell: ({ row }) => <StatusBadge status={String(row.original.marketStatus)} />,
  },
  {
    header: "Created",
    accessorKey: "createdAt",
    cell: ({ row }) => <span className="text-xs font-mono text-zinc-500">{dateLabel(row.original.createdAt)}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const loc = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 inline-flex items-center justify-center rounded hover:bg-zinc-100 text-zinc-500">
              <MoreHorizontal size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white border-zinc-200">
            <DropdownMenuItem onClick={() => opts.onManageStates(loc)} className="text-xs cursor-pointer">
              <Map className="mr-2 h-3.5 w-3.5 text-zinc-500" /> Manage States
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => opts.onEdit(loc)} className="text-xs cursor-pointer">
              <Settings className="mr-2 h-3.5 w-3.5 text-zinc-500" /> Edit Location
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];