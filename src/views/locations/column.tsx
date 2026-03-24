"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/cards/status-badge";
import { MoreHorizontal, Settings, Map, Wallet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Country = {
  id: string;
  name: string;
  code: string;
  currency: string;
  gateway: string;
  regions: number;
  status: string;
};

export const countryColumns: ColumnDef<Country>[] = [
  {
    header: "Country",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {/* Flag Placeholder - In real app use a flag library */}
        <div className="h-8 w-10 bg-zinc-100 rounded border border-zinc-200 flex items-center justify-center font-bold text-xs text-zinc-400">
          {row.original.code}
        </div>
        <div>
          <p className="font-bold text-zinc-900 font-display">
            {row.original.name}
          </p>
          <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
            {row.original.id}
          </p>
        </div>
      </div>
    ),
  },
  {
    header: "Finance Config",
    accessorKey: "currency",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <span className="text-zinc-400">Curr:</span> {row.original.currency}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <Wallet size={10} className="text-sax-gold" /> {row.original.gateway}
        </div>
      </div>
    ),
  },
  {
    header: "Geography",
    accessorKey: "regions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Map size={12} className="text-zinc-400" />
        <span className="font-mono text-xs">
          {row.original.regions} Regions
        </span>
      </div>
    ),
  },
  {
    header: "Market Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    cell: () => (
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
            <DropdownMenuItem className="text-xs text-black cursor-pointer">
              <Map className="mr-2 h-3.5 w-3.5 text-zinc-500" /> Manage States
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs text-black cursor-pointer">
              <Settings className="mr-2 h-3.5 w-3.5 text-zinc-500" /> Edit
              Config
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
