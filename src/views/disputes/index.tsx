"use client";

import { useMemo } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Scale, AlertTriangle, ShieldAlert, History } from "lucide-react";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { disputeColumns, type Dispute } from "./column";
import { StatCard } from "@/components/cards/stat-card";

import { useDisputes, useDisputeStats } from "@/src/features/disputes/hooks";
import { toDisputeRow } from "@/src/features/disputes/mapper";

export default function DisputeResolutionView() {
  const { data: stats } = useDisputeStats();

  const { data: list = [], isLoading } = useDisputes({
    currency: "NGN",
    pageNumber: 1,
    pageSize: 20,
  });

  const rows: Dispute[] = useMemo(() => list.map(toDisputeRow), [list]);

  const openRows = useMemo(
    () => rows.filter((r) => r.status === "open" || r.status === "review"),
    [rows],
  );

  const resolvedRows = useMemo(
    () => rows.filter((r) => r.status === "resolved" || r.status === "closed"),
    [rows],
  );

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Platform / Dispute Resolution
          </h1>
        </div>
      </header>

      <main className="p-6 max-w-400 mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Active Cases"
            value={`${stats?.activeCases ?? openRows.length}`}
            icon={Scale}
            variant="default"
          />
          <StatCard
            label="Funds in Escrow"
            value={
              stats?.fundsInEscrow != null
                ? `${stats.currency ?? "NGN"} ${stats.fundsInEscrow.toLocaleString()}`
                : "—"
            }
            icon={AlertTriangle}
            variant="gold"
          />
          <StatCard
            label="Fraud Alerts"
            value={`${stats?.fraudAlerts ?? 0}`}
            icon={ShieldAlert}
            variant="rose"
          />
        </div>

        <Tabs defaultValue="open" className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                {
                  value: "open",
                  label: "Open Disputes",
                  count: openRows.length,
                  variant: "rose",
                },
                {
                  value: "history",
                  label: "Resolution History",
                  count: resolvedRows.length,
                  variant: "indigo",
                },
              ]}
            />
          </div>

          <TabsContent value="open">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="font-bold text-sm text-zinc-700">
                  Priority Queue
                </h3>
                <div className="text-xs text-zinc-500">
                  {isLoading ? "Loading..." : `${openRows.length} open cases`}
                </div>
              </div>
              <DataTable columns={disputeColumns} data={openRows} />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="font-bold text-sm text-zinc-700">
                  Past Resolutions
                </h3>
                <div className="text-xs text-zinc-500 flex gap-2 items-center">
                  <History size={14} />
                  <span>Showing current page</span>
                </div>
              </div>
              <DataTable columns={disputeColumns} data={resolvedRows} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}