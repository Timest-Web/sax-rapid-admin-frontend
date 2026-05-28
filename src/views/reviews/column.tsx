"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/cards/status-badge";
import { MoreHorizontal, Eye, Star, Flag, Store, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type ReviewRow = {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  productId: string;
  isVerifiedPurchase: boolean;

  // local-only
  status: "active" | "flagged";
  avatar: string;
};

export type VendorRatingRow = {
  vendorId: string;
  vendorName: string;
  rating: number;
  totalProducts: number;
  totalRevenue: number;
  currency: string;
  status: string;
  verificationStatus: string;
  storeCity?: string | null;
  storeState?: string | null;
  email: string;
};

export function makeReviewColumns(opts: {
  onFlag: (reviewId: string) => void;
}): ColumnDef<ReviewRow>[] {
  return [
    {
      header: "Customer Identity",
      accessorKey: "userName",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600 border border-zinc-200">
            {row.original.avatar}
          </div>
          <div>
            <p className="font-bold text-zinc-900 font-display">
              {row.original.userName}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
              <Calendar size={10} /> {new Date(row.original.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Review Content",
      accessorKey: "rating",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 max-w-[320px]">
          <div className="flex items-center gap-1 text-xs font-bold text-zinc-900">
            <Star
              size={12}
              className={cn(
                "fill-current",
                row.original.rating >= 4
                  ? "text-sax-gold fill-sax-gold"
                  : "text-zinc-400",
              )}
            />
            <span>{row.original.rating.toFixed(1)} Rating</span>
            {row.original.isVerifiedPurchase && (
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                Verified
              </span>
            )}
          </div>
          <p className="text-[10px] text-zinc-500 truncate font-sans">
            &quot;{row.original.comment}&quot;
          </p>
        </div>
      ),
    },
    {
      header: "Product",
      accessorKey: "productId",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 font-bold text-zinc-900 text-xs">
            <Store size={12} className="text-zinc-400" />
            <span className="text-zinc-500">Vendor:</span> —
          </div>
          <p className="text-[10px] text-zinc-400 font-mono pl-4">
            Product ID: {row.original.productId}
          </p>
        </div>
      ),
    },
//     {
//       header: () => <div className="text-center">Status</div>,
//       accessorKey: "status",
//          cell: ({ row }) => (
//   <StatusBadge
//     status={row.original.status}
//     styles={{
//       Pending: "bg-amber-50 text-amber-700 border-amber-200",

//       Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",

//       Active: "bg-emerald-50 text-emerald-700 border-emerald-200",

//       Failed: "bg-rose-50 text-rose-700 border-rose-200",

//       Rejected: "bg-rose-50 text-rose-700 border-rose-200",

//       "On Hold": "bg-blue-50 text-blue-700 border-blue-200",
//     }}
//   />
// ),
//     },
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

            <DropdownMenuContent align="end" className="w-52 bg-white border-zinc-200">
              <DropdownMenuLabel className="text-xs font-bold text-black uppercase tracking-wider">
                Moderation
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-100" />

              <DropdownMenuItem className="text-xs text-black cursor-pointer flex items-center w-full focus:bg-zinc-50">
                <Eye className="mr-2 h-3.5 w-3.5 text-zinc-500" /> View Full Review
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-xs text-amber-700 cursor-pointer flex items-center w-full focus:bg-amber-50"
                onSelect={() => opts.onFlag(row.original.id)}
              >
                <Flag className="mr-2 h-3.5 w-3.5" /> Flag Review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
}

export const vendorRatingColumns: ColumnDef<VendorRatingRow>[] = [
  {
    header: "Vendor Identity",
    accessorKey: "vendorName",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <p className="font-bold text-zinc-900 font-display">
          {row.original.vendorName}
        </p>
        <p className="text-[10px] text-zinc-400 font-mono">
          {row.original.email}
        </p>
        <p className="text-[10px] text-zinc-500 font-mono">
          {row.original.storeCity ?? "—"}{row.original.storeState ? `, ${row.original.storeState}` : ""}
        </p>
      </div>
    ),
  },
  {
    header: "Rating / Metrics",
    accessorKey: "rating",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 text-xs font-bold text-zinc-900">
          <Star size={12} className="text-sax-gold fill-sax-gold" />
          {Number(row.original.rating ?? 0).toFixed(1)} / 5.0
        </div>
        <span className="text-[10px] text-zinc-400 font-mono">
          {row.original.totalProducts} products • {row.original.currency} {Number(row.original.totalRevenue ?? 0).toLocaleString()} revenue
        </span>
      </div>
    ),
  },
  {
    header: () => <div className="text-center">Account Status</div>,
    accessorKey: "status",
    cell: ({ row }) => (
      <div className="text-center">
        <StatusBadge status={row.original.status || "—"} />
      </div>
    ),
  },
];