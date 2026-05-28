/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./column";
import { StatCard } from "@/components/cards/stat-card";
import { Users, UserPlus } from "lucide-react";

import { useBuyers } from "@/src/features/buyers/hooks";
import { useBuyerStats } from "@/src/features/buyers/hooks";
import { StatsAndTableSkeleton } from "@/components/skeletons/stat-table";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

export default function BuyersView() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const pageNumber = 1;
  const pageSize = 20;

  const statsQ = useBuyerStats();
  const listQ = useBuyers({ pageNumber, pageSize, currency: "NGN" });

  const buyers = listQ.data ?? [];

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      <PageHeader
        title="User Management / Buyers"
        actionLabel="Add New Buyer"
        // No endpoint provided -> disable or remove
        onAction={() => setIsAddModalOpen(true)}
        icon={UserPlus}
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Buyers"
            value={statsQ.isLoading ? "—" : String(statsQ.data?.totalBuyers ?? 0)}
            variant="gold"
            icon={Users}
          />
          <StatCard
            label="New This Month"
            value={statsQ.isLoading ? "—" : String(statsQ.data?.newThisMonth ?? 0)}
            variant="emerald"
            icon={Users}
          />
          <StatCard
            label="Active Now"
            value={statsQ.isLoading ? "—" : String(statsQ.data?.activeNow ?? 0)}
            variant="cyan"
            icon={Users}
          />
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-4">
          {listQ.isLoading ? (
             <TableSkeleton />
          ) : listQ.isError ? (
            <div className="p-6 text-sm">
              <p className="text-red-600">
                Failed to load buyers:{" "}
                {(listQ.error as any)?.response?.data?.message ??
                  (listQ.error as any)?.message ??
                  "Unknown error"}
              </p>
              <button
                onClick={() => listQ.refetch()}
                className="mt-3 text-xs font-semibold underline text-zinc-700"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              {listQ.isFetching && (
                <div className="px-6 py-2 text-[11px] text-zinc-500 border-b border-zinc-100">
                  Refreshing…
                </div>
              )}
              <DataTable columns={columns} data={buyers} />
            </>
          )}
        </div>
      </main>

      {/* If you keep the modal, clearly mark it as not wired */}
      {/* Ideally remove it completely until endpoint exists */}
    </div>
  );
}