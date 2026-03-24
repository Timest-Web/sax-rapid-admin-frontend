"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/cards/status-badge";
import {
  MoreHorizontal,
  Mail,
  Eye,
  ShieldBan,
  RefreshCw,
  MapPin,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Define the Data Shape
export type Buyer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  orders: number;
  totalSpent: string;
  status: string;
  lastActive: string;
  avatar: string;
};

export const columns: ColumnDef<Buyer>[] = [
  {
    header: "User Details",
    accessorKey: "name", // Used for filtering
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600 border border-zinc-200">
            {user.avatar}
          </div>
          <div>
            <p className="font-bold text-zinc-900 font-display">{user.name}</p>
            <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
              {user.id}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    header: "Contact Info",
    accessorKey: "email",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-zinc-600 text-xs">
            <Mail size={10} className="text-zinc-400" /> {user.email}
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            {user.phone}
          </span>
        </div>
      );
    },
  },
  {
    header: "Location",
    accessorKey: "location",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-zinc-600 text-xs bg-zinc-50 w-fit px-2 py-1 rounded border border-zinc-100">
        <MapPin size={10} className="text-zinc-400" />
        {row.getValue("location")}
      </div>
    ),
  },
  {
    header: () => <div className="text-right">Stats</div>,
    accessorKey: "totalSpent",
    cell: ({ row }) => (
      <div className="text-right">
        <p className="font-bold text-zinc-900 font-mono">
          {row.original.totalSpent}
        </p>
        <p className="text-[10px] text-zinc-400 font-mono">
          {row.original.orders} Orders
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
        <p className="text-[9px] text-zinc-400 mt-1 font-mono">
          {row.original.lastActive}
        </p>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({row}) => {
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors">
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white text-black border-zinc-200"
            >
              <DropdownMenuLabel className="text-xs text-zinc-400 uppercase tracking-wider">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-100" />
              <DropdownMenuItem className="text-xs cursor-pointer ">
              <Link className="flex gap-1" href={`/admin/buyers/${row.original.id}`}>
                <Eye className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                <p> View Profile</p>
              </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs cursor-pointer">
                <RefreshCw className="mr-2 h-3.5 w-3.5 text-zinc-500" /> Reset
                Password
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-100" />
              <DropdownMenuItem className="text-xs cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50">
                <ShieldBan className="mr-2 h-3.5 w-3.5" /> Suspend Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
