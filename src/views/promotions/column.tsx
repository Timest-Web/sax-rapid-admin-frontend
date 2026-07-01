"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { CampaignListItem } from "@/src/features/promotions/api";
import { StatusBadge } from "@/components/cards/status-badge";
import { MoreHorizontal, PauseCircle, PlayCircle, Ban } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function dateRangeLabel(a?: string, b?: string) {
  const fmt = (x?: string) => (x ? new Date(x).toLocaleDateString() : "—");
  return `${fmt(a)} - ${fmt(b)}`;
}

export function getCampaignColumns(opts: {
  onStatus: (campaign: CampaignListItem, status: string) => void;
}): ColumnDef<CampaignListItem>[] {
  return [
    {
      header: "Campaign",
      accessorKey: "name",
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-zinc-900 text-sm">{row.original.name}</p>
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
            {row.original.campaignId} • {row.original.adType}
          </p>
        </div>
      ),
    },
    {
      header: "Vendor",
      accessorKey: "vendorName",
      cell: ({ row }) => (
        <span className="text-xs font-medium">{row.original.vendorName ?? "—"}</span>
      ),
    },
    {
      header: "Duration",
      id: "duration",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-zinc-500">
          {dateRangeLabel(row.original.startDate, row.original.endDate)}
        </span>
      ),
    },
    {
      header: "Budget",
      accessorKey: "budget",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-zinc-700">
          {row.original.currency} {Number(row.original.budget ?? 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Impressions",
      accessorKey: "impressions",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-zinc-700">
          {Number(row.original.impressions ?? 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Status",
      id: "status",
      cell: ({ row }) => <StatusBadge status={row.original.status?.name ?? "—"} />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-zinc-100 text-zinc-400">
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => opts.onStatus(row.original, "Active")}
              >
                <PlayCircle className="mr-2 h-3.5 w-3.5" />
                Activate
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-xs cursor-pointer"
                onClick={() => opts.onStatus(row.original, "Paused")}
              >
                <PauseCircle className="mr-2 h-3.5 w-3.5" />
                Pause
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-xs text-rose-600 cursor-pointer"
                onClick={() => opts.onStatus(row.original, "Ended")}
              >
                <Ban className="mr-2 h-3.5 w-3.5" />
                End
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
}