"use client";

import { ColumnDef } from "@tanstack/react-table";
import { NotificationLog } from "./actions";
import { StatusBadge } from "@/components/cards/status-badge";
import { Mail, MessageSquare, Bell, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export const notificationColumns: ColumnDef<NotificationLog>[] = [
  {
    accessorKey: "title",
    header: "Message Details",
    cell: ({ row }) => (
      <div>
        <div className="font-bold text-zinc-900">{row.getValue("title")}</div>
        <div className="text-[10px] text-zinc-500 truncate max-w-[200px]">
          {row.original.message}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "target",
    header: "Audience",
    cell: ({ row }) => {
      const target = row.getValue("target") as string;
      return (
        <div className="flex items-center gap-2">
          <div className="bg-zinc-100 p-1 rounded text-zinc-500">
            <Users size={12} />
          </div>
          <div>
            <span className="text-xs font-bold capitalize text-zinc-700">
              {target}
            </span>
            <p className="text-[10px] text-zinc-400 font-mono">
              {row.original.recipientCount} Recipients
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "channels",
    header: "Channels",
    cell: ({ row }) => (
      <div className="flex gap-1">
        {row.original.channels.includes("email") && (
          <span
            className="h-6 w-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100"
            title="Email"
          >
            <Mail size={12} />
          </span>
        )}
        {row.original.channels.includes("sms") && (
          <span
            className="h-6 w-6 rounded bg-green-50 text-green-600 flex items-center justify-center border border-green-100"
            title="SMS"
          >
            <MessageSquare size={12} />
          </span>
        )}
        {row.original.channels.includes("in_app") && (
          <span
            className="h-6 w-6 rounded bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100"
            title="In-App"
          >
            <Bell size={12} />
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "sentAt",
    header: "Date Sent",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-zinc-500">
        {row.getValue("sentAt")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Delivery",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Eye className="text-zinc-400 hover:text-zinc-900" size={16} />
      </Button>
    ),
  },
];
