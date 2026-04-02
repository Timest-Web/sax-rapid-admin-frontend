"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type Coupon = {
  id: string;
  code: string;
  type: "Percentage" | "Fixed Amount";
  amount: number;
  store: string;
  usageCount: number;
  usageLimit: number | null; // null means unlimited
  expiryDate: string;
  status: "Active" | "Expired" | "Draft";
};

export const couponColumns: ColumnDef<Coupon>[] = [
  {
    header: "Coupon Code",
    accessorKey: "code",
    cell: ({ row }) => {
      const copyToClipboard = () => {
        navigator.clipboard.writeText(row.original.code);
        toast.success("Coupon code copied!");
      };

      return (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-sm text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200">
            {row.original.code}
          </span>
          <button
            onClick={copyToClipboard}
            className="text-zinc-400 hover:text-[#D4AF37] transition-colors"
            title="Copy Code"
          >
            <Copy size={14} />
          </button>
        </div>
      );
    },
  },
  {
    header: "Type & Amount",
    accessorKey: "type",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-zinc-800">
          {row.original.type === "Percentage"
            ? `${row.original.amount}% OFF`
            : `₦${row.original.amount.toLocaleString()}`}
        </span>
        <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
          {row.original.type}
        </span>
      </div>
    ),
  },
  {
    header: "Store / Vendor",
    accessorKey: "store",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-zinc-700">
        {row.original.store}
      </span>
    ),
  },
  {
    header: "Usage Limit",
    accessorKey: "usage",
    cell: ({ row }) => {
      const limit = row.original.usageLimit;
      const count = row.original.usageCount;
      const isUnlimited = limit === null;
      const percentage = isUnlimited ? 0 : (count / limit) * 100;

      return (
        <div className="flex flex-col gap-1.5 w-24">
          <span className="text-xs font-mono text-zinc-600">
            {count} / {isUnlimited ? "∞" : limit}
          </span>
          {!isUnlimited && (
            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  percentage >= 100 ? "bg-rose-500" : "bg-[#D4AF37]",
                )}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          )}
        </div>
      );
    },
  },
  {
    header: "Expiry Date",
    accessorKey: "expiryDate",
    cell: ({ row }) => (
      <span className="text-xs font-mono text-zinc-600">
        {row.original.expiryDate}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const s = row.original.status;
      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
            s === "Active"
              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
              : s === "Expired"
                ? "bg-rose-50 text-rose-600 border-rose-200"
                : "bg-zinc-100 text-zinc-600 border-zinc-200",
          )}
        >
          {s === "Active" && <CheckCircle2 size={12} />}
          {s === "Expired" && <XCircle size={12} />}
          {s}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="text-right pr-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 text-zinc-400 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 border-zinc-200 rounded-xl shadow-xl"
          >
            <DropdownMenuItem className="text-xs font-medium cursor-pointer rounded-lg">
              <Edit className="mr-2 h-3.5 w-3.5 text-zinc-400" /> Edit Coupon
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-100" />
            <DropdownMenuItem className="text-xs font-bold text-rose-600 cursor-pointer rounded-lg">
              <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
