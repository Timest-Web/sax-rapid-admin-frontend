"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { CmsPageListItem } from "@/src/features/cms/api";
import { StatusBadge } from "@/components/cards/status-badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Eye, Trash2, FileCode, Clock } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function dateLabel(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function getPageColumns(opts: {
  onEdit: (p: CmsPageListItem) => void;
  onDelete: (p: CmsPageListItem) => void;
  onView: (p: CmsPageListItem) => void;
}): ColumnDef<CmsPageListItem>[] {
  return [
    {
      accessorKey: "title",
      header: "Page Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-zinc-100 flex items-center justify-center text-zinc-400">
            <FileCode size={14} />
          </div>
          <div>
            <div className="font-bold text-zinc-900">{row.original.title}</div>
            <div className="text-[10px] text-zinc-500 font-mono">
              {row.original.slug}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "updatedAt",
      header: "Last Updated",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <Clock size={12} /> {dateLabel(row.original.updatedAt)}
        </div>
      ),
    },
    {
      accessorKey: "authorName",
      header: "Author",
      cell: ({ row }) => (
        <span className="text-xs text-zinc-700">{row.original.authorName ?? "—"}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={String(row.original.status ?? "—")} />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal size={16} className="text-zinc-400" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => opts.onView(row.original)}>
              <Eye className="mr-2 h-4 w-4" /> Preview
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => opts.onEdit(row.original)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => opts.onDelete(row.original)}
              className="text-rose-600 focus:text-rose-600 focus:bg-rose-50"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}