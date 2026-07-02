"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Store, UserCheck, FileText, UserMinus } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { vendorColumns } from "./column";
import { StatCard } from "@/components/cards/stat-card";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { useVendors } from "@/src/features/vendors/hooks";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

export default function VendorsView() {
  const [page] = useState(1);
  const pageSize = 20;

  const vendorsQ = useVendors({ page, pageSize });

  const vendors = vendorsQ.data?.items ?? [];
  const totalCount = vendorsQ.data?.totalCount ?? vendors.length;

  const suspendedVendors = useMemo(
    () => vendors.filter((v) => v.isSuspended === true),
    [vendors],
  );

  const verifiedVendors = useMemo(
    () => vendors.filter((v) => v.verificationStatus === "Verified" && v.isSuspended !== true),
    [vendors],
  );

  const pendingVendors = useMemo(
    () => vendors.filter((v) => v.verificationStatus !== "Verified" && v.isSuspended !== true),
    [vendors],
  );

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Marketplace / Vendors
          </h1>
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Stores"
            value={vendorsQ.isLoading ? "—" : String(totalCount)}
            icon={Store}
            variant="default"
          />
          <StatCard
            label="Verified Vendors"
            value={vendorsQ.isLoading ? "—" : String(verifiedVendors.length)}
            icon={UserCheck}
            variant="emerald"
          />
          <StatCard
            label="KYC Pending"
            value={vendorsQ.isLoading ? "—" : String(pendingVendors.length)}
            icon={FileText}
            variant="amber"
          />
          <StatCard
            label="Suspended Vendors"
            value={vendorsQ.isLoading ? "—" : String(suspendedVendors.length)}
            icon={UserMinus}
            variant="rose"
          />
        </div>

        <Tabs defaultValue="all" className="w-full flex flex-col">
          <div className="flex items-center justify-between">
            <FilterTabs
              tabs={[
                { value: "all", label: "All Stores", count: totalCount, variant: "default" },
                { value: "verified", label: "Verified", count: verifiedVendors.length, variant: "emerald" },
                { value: "pending", label: "Pending KYC", count: pendingVendors.length, variant: "amber" },
                { value: "suspended", label: "Suspended", count: suspendedVendors.length, variant: "rose" },
              ]}
            />
          </div>

          <div>
            {vendorsQ.isLoading ? (
              <TableSkeleton columns={vendorColumns.length} rows={12} withToolbar={false} />
            ) : vendorsQ.isError ? (
              <div className="p-6 text-sm">
                <p className="text-red-600">
                  Failed to load vendors:{" "}
                  {(vendorsQ.error as any)?.response?.data?.message ??
                    (vendorsQ.error as any)?.message ??
                    "Unknown error"}
                </p>
                <button
                  onClick={() => vendorsQ.refetch()}
                  className="mt-3 text-xs font-semibold underline text-zinc-700"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                {vendorsQ.isFetching && (
                  <div className="px-6 py-2 text-[11px] text-zinc-500 border-b border-zinc-100">
                    Refreshing…
                  </div>
                )}

                <TabsContent value="all" className="m-0">
                  <DataTable columns={vendorColumns} data={vendors} />
                </TabsContent>

                <TabsContent value="verified" className="m-0">
                  <DataTable columns={vendorColumns} data={verifiedVendors} />
                </TabsContent>

                <TabsContent value="pending" className="m-0">
                  <DataTable columns={vendorColumns} data={pendingVendors} />
                </TabsContent>

                <TabsContent value="suspended" className="m-0">
                  <DataTable columns={vendorColumns} data={suspendedVendors} />
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </main>
    </div>
  );
}