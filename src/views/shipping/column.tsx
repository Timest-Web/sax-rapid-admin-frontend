"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DeliveryProvider } from "./types";
import { StatusBadge } from "@/components/cards/status-badge";
import { MoreHorizontal, Trash, Truck, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Exporting as a function so we can pass the delete handler from the main view
export const getProviderColumns = (
  onDelete: (id: string) => void
): ColumnDef<DeliveryProvider>[] => [
  {
    accessorKey: "name",
    header: "Provider",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
          {row.original.logo}
        </div>
        <div>
          <div className="font-bold text-zinc-900">{row.getValue("name")}</div>
          <div className="text-[10px] text-zinc-500 flex items-center gap-1">
            {row.original.type === "integrated" ? (
              <>
                <Wifi size={10} className="text-emerald-500" /> API Connected
              </>
            ) : (
              <>
                <WifiOff size={10} className="text-zinc-400" /> Manual Entry
              </>
            )}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "activeShipments",
    header: "Active Load",
    cell: ({ row }) => (
      <div className="font-mono text-zinc-900 flex items-center gap-2">
        <Truck size={14} className="text-zinc-400" />
        {row.getValue("activeShipments")}
      </div>
    ),
  },
  {
    accessorKey: "rating",
    header: "Performance",
    cell: ({ row }) => (
      <span className="font-mono text-sm">
        {Number(row.getValue("rating")).toFixed(1)} / 5.0
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const provider = row.original;
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => onDelete(provider.id)} 
                className="text-red-600 focus:text-red-700 cursor-pointer"
              >
                <Trash size={14} className="mr-2" /> Remove Partner
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];