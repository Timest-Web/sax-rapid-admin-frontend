"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AdminRole, LoginSession } from "./actions";
import { StatusBadge } from "@/components/cards/status-badge";
import {
  MoreHorizontal,
  Users,
  Lock,
  ShieldCheck,
  Laptop,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- ROLE COLUMNS ---
export const roleColumns: ColumnDef<AdminRole>[] = [
  {
    accessorKey: "name",
    header: "Role Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-zinc-100 rounded flex items-center justify-center text-zinc-500">
          <ShieldCheck size={14} />
        </div>
        <span className="font-bold text-zinc-900">{row.getValue("name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "permissions",
    header: "Access Level",
    cell: ({ row }) => (
      <span className="text-xs bg-zinc-100 px-2 py-1 rounded text-zinc-600 font-mono">
        {row.original.permissions.length} Permissions
      </span>
    ),
  },
  {
    accessorKey: "usersCount",
    header: "Active Users",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-zinc-600">
        <Users size={14} />
        <span className="text-sm font-mono">{row.getValue("usersCount")}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    cell: () => (
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <MoreHorizontal size={16} />
      </Button>
    ),
  },
];

// --- LOGIN LOG COLUMNS ---
export const loginColumns: ColumnDef<LoginSession>[] = [
  {
    accessorKey: "user",
    header: "User Identity",
    cell: ({ row }) => (
      <div>
        <div className="font-bold text-zinc-900">{row.getValue("user")}</div>
        <div className="text-[10px] text-zinc-500">{row.original.role}</div>
      </div>
    ),
  },
  {
    accessorKey: "ip",
    header: "IP Address",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-mono text-zinc-600">{row.getValue("ip")}</span>
        <span className="text-[10px] text-zinc-400 flex items-center gap-1">
          <Globe size={10} /> {row.original.location}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "device",
    header: "Device",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <Laptop size={12} /> {row.getValue("device")}
      </div>
    ),
  },
  {
    accessorKey: "timestamp",
    header: "Time",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.getValue("timestamp")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Result",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
            status === "success"
              ? "bg-emerald-100 text-emerald-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {status}
        </span>
      );
    },
  },
];
