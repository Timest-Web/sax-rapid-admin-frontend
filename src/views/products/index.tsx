/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { productColumns } from "./column";
import { StatCard } from "@/components/cards/stat-card";
import { FilterTabs } from "@/components/tabs/filter-tab";
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Filter,
} from "lucide-react";
import {
  useAdminProductCount,
  useAdminProducts,
} from "@/src/features/products/hooks";

export default function ProductsView() {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "rejected">(
    "all",
  );

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 20;

  // TODO: map your UI selects to real API params (categoryId, vendorId, etc)
  // For now only tab -> status filter:
  const status =
    activeTab === "pending"
      ? "Pending"
      : activeTab === "rejected"
        ? "Rejected"
        : undefined;

  const query = {
    pageNumber,
    pageSize,
    status,
    // categoryId,
    // vendorId,
    // dateFrom,
    // dateTo,
  };

  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminProducts(query);

  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  // Example: live count from current page only; for true counts per status, you’d fetch counts separately.
  const liveOnPage = useMemo(
    () => items.filter((p) => p.status === "Active").length,
    [items],
  );
  const pendingOnPage = useMemo(
    () => items.filter((p) => p.status === "Pending").length,
    [items],
  );

  const allCountQ = useAdminProductCount(undefined);
  const pendingCountQ = useAdminProductCount("Pending");
  const rejectedCountQ = useAdminProductCount("Rejected");

  const allCount = allCountQ.data ?? 0;
  const pendingCount = pendingCountQ.data ?? 0;
  const rejectedCount = rejectedCountQ.data ?? 0;

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Marketplace / Products
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs font-bold uppercase tracking-wider"
          >
            Export List
          </Button>
          <Button
            size="sm"
            className="h-9 text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white hover:bg-[#D4AF37] hover:text-black transition-colors"
          >
            <Plus className="mr-2 h-3.5 w-3.5" /> Add New Product
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Inventory"
            value={isLoading ? "—" : String(totalCount)}
            icon={Package}
            variant="gold"
          />
          <StatCard
            label="Moderation Queue (page)"
            value={isLoading ? "—" : String(pendingOnPage)}
            icon={AlertTriangle}
            variant="rose"
          />
          <StatCard
            label="Live Products (page)"
            value={isLoading ? "—" : String(liveOnPage)}
            icon={CheckCircle2}
            variant="emerald"
          />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v as any);
            setPageNumber(1);
          }}
          className="w-full flex flex-col"
        >
          <div className="flex items-center justify-between">
            <FilterTabs
              tabs={[
                {
                  value: "all",
                  label: "All Inventory",
                  count: allCount,
                  variant: "emerald",
                },
                {
                  value: "pending",
                  label: "Pending",
                  count: pendingCount,
                  variant: "amber",
                },
                {
                  value: "rejected",
                  label: "Rejected",
                  count: rejectedCount,
                  variant: "rose",
                },
              ]}
            />
          </div>

          <div className="mt-4 bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-zinc-200 bg-zinc-50/50 flex flex-wrap gap-3 items-center">
              <div className="flex items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest mr-2">
                <Filter className="mr-2 h-3.5 w-3.5" /> Filters:
              </div>
              {/* keep your selects here, just map to query params */}
            </div>

            {isLoading ? (
              <div className="p-6 text-sm text-zinc-500">Loading products…</div>
            ) : isError ? (
              <div className="p-6 text-sm">
                <p className="text-rose-600 font-semibold">
                  Failed to load products:{" "}
                  {(error as any)?.response?.data?.message ??
                    (error as any)?.message ??
                    "Unknown error"}
                </p>
                <button
                  onClick={() => refetch()}
                  className="mt-3 text-xs font-semibold underline text-zinc-700"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                {isFetching && (
                  <div className="px-6 py-2 text-[11px] text-zinc-500 border-b border-zinc-100">
                    Refreshing…
                  </div>
                )}

                <TabsContent value={activeTab} className="m-0">
                  <DataTable columns={productColumns} data={items} />
                </TabsContent>

                {/* Simple pagination controls (optional) */}
                {/* <div className="flex items-center justify-between p-4 border-t border-zinc-200 text-xs">
                  <span className="text-zinc-500">
                    Page {data?.pageNumber ?? pageNumber} of {data?.totalPages ?? "—"} • {totalCount} total
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!data?.hasPreviousPage}
                      onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                    >
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!data?.hasNextPage}
                      onClick={() => setPageNumber((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div> */}
              </>
            )}
          </div>
        </Tabs>
      </main>
    </div>
  );
}
