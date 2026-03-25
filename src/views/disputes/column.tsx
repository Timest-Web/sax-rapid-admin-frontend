"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/cards/status-badge";
import {
  MoreHorizontal,
  Eye,
  User,
  Store,
  AlertCircle,
  Truck,
  RefreshCcw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link"; 


export type Dispute = {
  id: string;
  ticketId: string;
  type: "refund" | "delivery" | "fraud";
  priority: "high" | "medium" | "low";
  buyerName: string;
  vendorName: string;
  amount: string;
  orderId: string;
  date: string;
  status: "open" | "review" | "resolved" | "closed";
};

// ... (Keep getDisputeIcon helper) ...
const getDisputeIcon = (type: string) => {
  switch (type) {
    case "fraud":
      return <AlertCircle size={14} className="text-red-600" />;
    case "delivery":
      return <Truck size={14} className="text-blue-600" />;
    case "refund":
      return <RefreshCcw size={14} className="text-orange-600" />;
    default:
      return <AlertCircle size={14} />;
  }
};

export const disputeColumns: ColumnDef<Dispute>[] = [
  // ... (Keep Case Identity, Parties, Amount, Status columns the same) ...
  {
    header: "Case Identity",
    accessorKey: "ticketId",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center border",
            row.original.priority === "high"
              ? "bg-red-50 border-red-200 text-red-600"
              : "bg-zinc-50 border-zinc-200 text-zinc-500",
          )}
        >
          {getDisputeIcon(row.original.type)}
        </div>
        <div>
          <p className="font-bold text-zinc-900 font-display">
            #{row.original.ticketId}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono uppercase">
            <span>{row.original.type}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-300" />
            <span>{row.original.date}</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    header: "Parties Involved",
    accessorKey: "buyerName",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1.5 border-l-2 border-zinc-100 pl-3">
        <div className="flex items-center gap-2">
          <User size={12} className="text-zinc-400" />
          <span className="text-xs font-medium text-zinc-900">
            {row.original.buyerName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Store size={12} className="text-indigo-400" />
          <span className="text-xs font-medium text-zinc-900">
            {row.original.vendorName}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Disputed Amount",
    accessorKey: "amount",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 font-bold text-zinc-900 font-mono">
          {row.original.amount}
        </div>
        <p className="text-[10px] text-zinc-400 font-mono">
          Order #{row.original.orderId}
        </p>
      </div>
    ),
  },
  {
    header: () => <div className="text-center">Status</div>,
    accessorKey: "status",
    cell: ({ row }) => (
      <div className="text-center">
        <StatusBadge status={row.getValue("status")} />
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
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
            <DropdownMenuLabel className="text-xs font-bold text-black uppercase tracking-wider">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-100" />

            {/* UPDATED: Link to details page */}
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/disputes/${row.original.id}`}
                className="text-xs text-black cursor-pointer flex items-center w-full focus:bg-zinc-50"
              >
                <Eye className="mr-2 h-3.5 w-3.5 text-zinc-500" /> Open Case
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
