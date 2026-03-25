"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AuditLog } from "./actions";
import {
  Eye,
  ShieldAlert,
  BadgeDollarSign,
  Store,
  ServerCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Helper for Category Icons/Colors
const getCategoryBadge = (category: string) => {
  switch (category) {
    case "security":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded w-fit border border-red-100">
          <ShieldAlert size={12} /> Security
        </div>
      );
    case "finance":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit border border-emerald-100">
          <BadgeDollarSign size={12} /> Finance
        </div>
      );
    case "vendor":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit border border-blue-100">
          <Store size={12} /> Vendor
        </div>
      );
    case "system":
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-zinc-600 bg-zinc-100 px-2 py-1 rounded w-fit border border-zinc-200">
          <ServerCog size={12} /> System
        </div>
      );
    default:
      return category;
  }
};

interface ColumnProps {
  onView: (log: AuditLog) => void;
}

export const getAuditColumns = ({
  onView,
}: ColumnProps): ColumnDef<AuditLog>[] => [
  {
    accessorKey: "action",
    header: "Activity",
    cell: ({ row }) => (
      <div>
        <div className="font-bold text-zinc-900">{row.getValue("action")}</div>
        <div className="text-[10px] text-zinc-500 font-mono">
          Target: {row.original.entity}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "actor",
    header: "Actor",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
          {row.original.actor.avatar}
        </div>
        <div>
          <p className="text-xs font-bold text-zinc-700">
            {row.original.actor.name}
          </p>
          <p className="text-[10px] text-zinc-400">{row.original.actor.role}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => getCategoryBadge(row.getValue("category")),
  },
  {
    accessorKey: "timestamp",
    header: "Date & Time",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-zinc-500">
        {row.getValue("timestamp")}
      </span>
    ),
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-zinc-400">
        {row.getValue("ipAddress")}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900"
        onClick={() => onView(row.original)}
      >
        <Eye size={16} />
      </Button>
    ),
  },
];
