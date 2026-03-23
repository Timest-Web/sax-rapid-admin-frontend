/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/status-badge";
import { PayoutReviewModal } from "@/components/payout-modal";

export const payoutColumns: ColumnDef<any>[] = [
  {
    header: "Request ID",
    accessorKey: "id",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-xs text-zinc-500">
        {row.original.id}
      </span>
    ),
  },
  {
    header: "Vendor",
    accessorKey: "vendor",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-zinc-900 text-sm">
          {row.original.vendor}
        </span>
        <span className="text-[10px] text-zinc-500 font-mono">
          {row.original.bank}
        </span>
      </div>
    ),
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-zinc-900">
        {row.original.amount}
      </span>
    ),
  },
  {
    header: "Requested Date",
    accessorKey: "date",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-zinc-500">
        {row.original.date}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // Only show review button if Pending
      if (row.original.status === "Pending") {
        return <PayoutReviewModal request={row.original} />;
      }
      return null;
    },
  },
];
