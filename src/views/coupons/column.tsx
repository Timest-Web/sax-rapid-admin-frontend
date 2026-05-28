/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Edit, Trash2, Copy, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import type { CouponListItem } from "@/src/features/coupons/api";

function formatExpiry(iso: string) {
  // API sometimes returns "0001-01-01T00:00:00" meaning "no expiry"
  if (!iso || iso.startsWith("0001-01-01")) return "—";
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

function typeLabel(discountType: string) {
  const t = String(discountType);
  if (t.toLowerCase().includes("percent")) return "Percentage";
  return "Fixed Amount";
}

function storeLabel(scope: string) {
  return scope === "Global" ? "All Stores" : scope; // "Vendor" etc
}

export type CouponRow = CouponListItem;

export function makeCouponColumns(opts: {
  onEdit: (coupon: CouponRow) => void;
  onDelete: (couponId: string) => void;
}): ColumnDef<CouponRow>[] {
  return [
    {
      header: "Coupon Code",
      accessorKey: "code",
      cell: ({ row }) => {
        const copyToClipboard = async () => {
          await navigator.clipboard.writeText(row.original.code);
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
      accessorKey: "discountType",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-zinc-800">
            {typeLabel(row.original.discountType) === "Percentage"
              ? `${row.original.value}% OFF`
              : `₦${row.original.value.toLocaleString()}`}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
            {row.original.discountType}
          </span>
        </div>
      ),
    },
    {
      header: "Store / Scope",
      accessorKey: "scope",
      cell: ({ row }) => (
        <span className="text-xs font-medium text-zinc-700">
          {storeLabel(row.original.scope)}
        </span>
      ),
    },
    {
      header: "Usage Limit",
      id: "usage",
      cell: ({ row }) => {
        const limit = row.original.usageLimit;
        const count = row.original.usedCount;
        const isUnlimited = limit === null;

        return (
          <div className="flex flex-col gap-1.5 w-24">
            <span className="text-xs font-mono text-zinc-600">
              {count} / {isUnlimited ? "∞" : limit}
            </span>
          </div>
        );
      },
    },
    {
      header: "Expiry Date",
      accessorKey: "expiryDate",
      cell: ({ row }) => (
        <span className="text-xs font-mono text-zinc-600">
          {formatExpiry(row.original.expiryDate)}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const s = row.original.status as any;
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
            <DropdownMenuContent align="end" className="w-40 border-zinc-200 rounded-xl shadow-xl">
              <DropdownMenuItem
                className="text-xs font-medium cursor-pointer rounded-lg"
                onSelect={() => opts.onEdit(row.original)}
              >
                <Edit className="mr-2 h-3.5 w-3.5 text-zinc-400" /> Edit Coupon
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-zinc-100" />

              <DropdownMenuItem
                className="text-xs font-bold text-rose-600 cursor-pointer rounded-lg"
                onSelect={() => opts.onDelete(row.original.id)}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
}