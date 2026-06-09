"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { AdminRole } from "@/src/features/roles/api";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Users, ShieldCheck, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function dateLabel(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}

export function getRoleColumns(opts: {
  onEdit: (role: AdminRole) => void;
  onRequestDelete: (role: AdminRole) => void;
}): ColumnDef<AdminRole>[] {
  return [
    {
      accessorKey: "name",
      header: "Role Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-zinc-100 rounded flex items-center justify-center text-zinc-500">
            <ShieldCheck size={14} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-zinc-900">{row.original.name}</span>
            {/* <span className="text-[10px] text-zinc-500">
              {row.original.description ?? "—"}
            </span> */}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => (
        <span className="text-xs bg-zinc-100 px-2 py-1 rounded text-zinc-600 font-mono">
          {(row.original.permissions ?? []).length} Permissions
        </span>
      ),
    },
    {
      accessorKey: "adminCount",
      header: "Admins",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-zinc-600">
          <Users size={14} />
          <span className="text-sm font-mono">{row.original.adminCount}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-xs font-mono text-zinc-600">
          {dateLabel(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={() => opts.onEdit(row.original)}
              className="flex items-center gap-2"
            >
              <Pencil size={14} />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => opts.onRequestDelete(row.original)}
              className="flex items-center gap-2 text-rose-600 focus:text-rose-600"
            >
              <Trash2 size={14} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}