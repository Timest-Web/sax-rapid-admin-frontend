"use client";

import { useMemo, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { Button } from "@/components/ui/button";
import { Download, ShieldCheck, Activity, User } from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";
import { getAuditColumns } from "./column";
import { AuditLog, LogDetailsModal } from "./actions";
import { useAuditLogs, useAuditLogStats } from "@/src/features/logs/hooks";
import { mapAuditLogDtoToUi } from "@/src/features/logs/mapper";

export default function AuditLogsView() {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statsQ = useAuditLogStats();
  const logsQ = useAuditLogs({
    PageNumber: 1,
    PageSize: 200,
  });

  const logs = useMemo<AuditLog[]>(() => {
    return (logsQ.data ?? []).map(mapAuditLogDtoToUi);
  }, [logsQ.data]);

  // Tabs are normalized categories (security/finance/vendor/system)
  const counts = useMemo(() => {
    const c = {
      all: logs.length,
      security: 0,
      finance: 0,
      vendor: 0,
      system: 0,
    };
    for (const l of logs) c[l.category] += 1;
    return c;
  }, [logs]);

  // Handlers
  const handleViewLog = (log: AuditLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const auditColumns = useMemo(
    () => getAuditColumns({ onView: handleViewLog }),
    [],
  );

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Platform / System Audit Logs
          </h1>
        </div>
        <Button variant="outline" size="sm" className="gap-2 text-xs">
          <Download size={14} /> Export CSV
        </Button>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-8">
        {/* STATS (from endpoint) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Events (Today)"
            value={
              statsQ.isLoading
                ? "—"
                : (statsQ.data?.totalLogsToday ?? 0).toLocaleString()
            }
            icon={Activity}
            variant="default"
          />
          <StatCard
            label="Critical Events"
            value={
              statsQ.isLoading
                ? "—"
                : (statsQ.data?.criticalEventsCount ?? 0).toLocaleString()
            }
            icon={ShieldCheck}
            variant="emerald"
          />
          <StatCard
            label="Top Actor"
            value={statsQ.isLoading ? "—" : (statsQ.data?.topActor ?? "—")}
            icon={User}
            variant="indigo"
          />
        </div>

        {/* TABS & TABLE */}
        <Tabs defaultValue="all" className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                {
                  value: "all",
                  label: "All Events",
                  count: counts.all,
                  variant: "default",
                },
                {
                  value: "security",
                  label: "Security",
                  count: counts.security,
                  variant: "rose",
                },
                {
                  value: "finance",
                  label: "Finance",
                  count: counts.finance,
                  variant: "emerald",
                },
                {
                  value: "vendor",
                  label: "Vendor",
                  count: counts.vendor,
                  variant: "indigo",
                },
                {
                  value: "system",
                  label: "System",
                  count: counts.system,
                  variant: "default",
                },
              ]}
            />
          </div>

          {/* ALL */}
          <TabsContent value="all">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <DataTable columns={auditColumns} data={logs} />
            </div>
          </TabsContent>

          {/* SECURITY */}
          <TabsContent value="security">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <DataTable
                columns={auditColumns}
                data={logs.filter((l) => l.category === "security")}
              />
            </div>
          </TabsContent>

          {/* FINANCE */}
          <TabsContent value="finance">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <DataTable
                columns={auditColumns}
                data={logs.filter((l) => l.category === "finance")}
              />
            </div>
          </TabsContent>

          {/* VENDOR */}
          <TabsContent value="vendor">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <DataTable
                columns={auditColumns}
                data={logs.filter((l) => l.category === "vendor")}
              />
            </div>
          </TabsContent>

          {/* SYSTEM */}
          <TabsContent value="system">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <DataTable
                columns={auditColumns}
                data={logs.filter((l) => l.category === "system")}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <LogDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        log={selectedLog}
      />
    </div>
  );
}
