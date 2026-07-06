"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Bell, Eye, Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NotificationDto } from "@/src/features/notifications/api";

function dateLabel(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}

function ReadPill({ isRead }: { isRead: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
        isRead
          ? "border-zinc-200 bg-zinc-100 text-zinc-600"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }`}
    >
      {isRead ? "Read" : "Unread"}
    </span>
  );
}

export const notificationColumns = (opts: {
  onView: (n: NotificationDto) => void;
  onDelete: (id: string) => void;
}): ColumnDef<NotificationDto>[] => [
  {
    accessorKey: "title",
    header: "Notification",
    cell: ({ row }) => (
      <div className="max-w-[520px]">
        <div className="font-bold text-zinc-900">{row.original.title}</div>
        <div className="text-[10px] text-zinc-500 line-clamp-2">
          {row.original.body}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded bg-zinc-100 text-zinc-600 flex items-center justify-center border border-zinc-200">
          <Bell size={12} />
        </div>
        <span className="text-xs font-mono text-zinc-700">
          {row.original.type}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "isRead",
    header: "Status",
    cell: ({ row }) => <ReadPill isRead={row.original.isRead} />,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-zinc-500">
        {dateLabel(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => opts.onView(row.original)}
          title="View"
        >
          <Eye className="text-zinc-400 hover:text-zinc-900" size={16} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => opts.onDelete(row.original.id)}
          title="Delete"
        >
          <Trash2 className="text-zinc-400 hover:text-rose-600" size={16} />
        </Button>
      </div>
    ),
  },
];