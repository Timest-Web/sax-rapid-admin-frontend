"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/cards/status-badge";
import { MoreHorizontal, Edit2, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export type SubscriptionPackage = {
  id: string;
  name: string;
  duration: number;
  amount: number;
  currency: string;
  uploadLimit: number;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
};

interface ColumnActions {
  onEdit: (pkg: SubscriptionPackage) => void;
  onToggleStatus: (id: string) => void;
}

export const getPackageColumns = ({
  onEdit,
  onToggleStatus,
}: ColumnActions): ColumnDef<SubscriptionPackage>[] => [
  {
    header: "Package Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-zinc-900">{row.original.name}</span>
        <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
          {row.original.id}
        </span>
      </div>
    ),
  },
  {
    header: "Limits & Duration",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-zinc-900">
          {row.original.duration} Days Validity
        </span>
        <span className="text-[10px] text-zinc-500 font-mono bg-zinc-100 px-1.5 py-0.5 rounded w-fit">
          Max {row.original.uploadLimit} Uploads
        </span>
      </div>
    ),
  },
  {
    header: "Pricing",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-mono font-bold text-zinc-900">
          {row.original.amount.toLocaleString()}
        </span>
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
          {row.original.currency}
        </span>
      </div>
    ),
  },
  {
    header: "Date Created",
    accessorKey: "createdAt",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-zinc-500">
        {row.original.createdAt}
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
    cell: ({ row }) => {
      const isActive = row.original.status === "active";
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-zinc-200">
              <DropdownMenuItem
                onClick={() => onEdit(row.original)}
                className="text-xs cursor-pointer"
              >
                <Edit2 size={14} className="mr-2 text-zinc-500" /> Edit Package
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onToggleStatus(row.original.id)}
                className={`text-xs cursor-pointer ${
                  isActive ? "text-red-600 focus:text-red-700" : "text-emerald-600 focus:text-emerald-700"
                }`}
              >
                <Power size={14} className="mr-2" />
                {isActive ? "Deactivate Package" : "Activate Package"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];