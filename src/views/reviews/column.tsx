"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/cards/status-badge";
import { 
  MoreHorizontal, 
  Eye, 
  Star, 
  User, 
  Trash2, 
  MessageSquare,
  Store,
  Calendar
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

// --- Types ---
export type Review = {
  id: string;
  customerName: string;
  vendorName: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  status: "active" | "flagged" | "removed";
  avatar: string; // Initials
};

export type VendorRating = {
  id: string;
  vendorName: string;
  category: string;
  avgRating: number;
  totalReviews: number;
  status: "active" | "suspended";
  logo: string; // Initials
};

// --- REVIEW COLUMNS (Moderation) ---
export const reviewColumns: ColumnDef<Review>[] = [
  {
    header: "Customer Identity",
    accessorKey: "customerName",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {/* Avatar Box */}
        <div className="h-10 w-10 rounded-lg bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600 border border-zinc-200">
          {row.original.avatar}
        </div>
        <div>
          <p className="font-bold text-zinc-900 font-display">
            {row.original.customerName}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
            <Calendar size={10} /> {row.original.date}
          </div>
        </div>
      </div>
    ),
  },
  {
    header: "Review Content",
    accessorKey: "rating",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 max-w-[250px]">
        <div className="flex items-center gap-1 text-xs font-bold text-zinc-900">
          <Star size={12} className={cn("fill-current", row.original.rating >= 4 ? "text-sax-gold fill-sax-gold" : "text-zinc-400")} />
          <span>{row.original.rating.toFixed(1)} Rating</span>
        </div>
        <p className="text-[10px] text-zinc-500 truncate font-sans">
          &quot;{row.original.comment}&quot;
        </p>
      </div>
    ),
  },
  {
    header: "Target Vendor",
    accessorKey: "vendorName",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 font-bold text-zinc-900 text-xs">
          <Store size={12} className="text-zinc-400" />
          {row.original.vendorName}
        </div>
        <p className="text-[10px] text-zinc-400 font-mono pl-4">
           {row.original.productName}
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
          <DropdownMenuContent align="end" className="w-48 bg-white border-zinc-200">
            <DropdownMenuLabel className="text-xs font-bold text-black uppercase tracking-wider">
              Moderation
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-100" />
            
            <DropdownMenuItem className="text-xs text-black cursor-pointer flex items-center w-full focus:bg-zinc-50">
              <Eye className="mr-2 h-3.5 w-3.5 text-zinc-500" /> View Full Review
            </DropdownMenuItem>
            
            <DropdownMenuItem className="text-xs text-red-600 cursor-pointer flex items-center w-full focus:bg-red-50 focus:text-red-700">
              <Trash2 className="mr-2 h-3.5 w-3.5" /> Remove Abusive Review
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

// --- VENDOR RATING COLUMNS (Monitoring) ---
export const vendorRatingColumns: ColumnDef<VendorRating>[] = [
  {
    header: "Vendor Identity",
    accessorKey: "vendorName",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-zinc-900 flex items-center justify-center text-xs font-bold text-sax-gold border border-zinc-800">
          {row.original.logo}
        </div>
        <div>
          <p className="font-bold text-zinc-900 font-display">
            {row.original.vendorName}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
            <Store size={10} /> {row.original.category}
          </div>
        </div>
      </div>
    ),
  },
  {
    header: "Performance Metrics",
    accessorKey: "avgRating",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 text-xs font-bold text-zinc-900">
          <Star size={12} className="text-sax-gold fill-sax-gold" />
          {row.original.avgRating.toFixed(1)} / 5.0
        </div>
        <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
          <MessageSquare size={10} />
          {row.original.totalReviews} Total Reviews
        </span>
      </div>
    ),
  },
  {
    header: () => <div className="text-center">Account Status</div>,
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
          <DropdownMenuContent align="end" className="w-48 bg-white border-zinc-200">
             <DropdownMenuLabel className="text-xs font-bold text-black uppercase tracking-wider">
              Manage Ratings
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-100" />
            <DropdownMenuItem className="text-xs text-black cursor-pointer flex items-center w-full focus:bg-zinc-50">
              <Eye className="mr-2 h-3.5 w-3.5 text-zinc-500" /> View History
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];