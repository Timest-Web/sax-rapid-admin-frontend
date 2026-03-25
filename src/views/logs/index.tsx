"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { Button } from "@/components/ui/button";
import { Download, ShieldCheck, Activity, Search } from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";
import { getAuditColumns } from "./column";
import { LogDetailsModal, AuditLog } from "./actions";

// --- DUMMY DATA ---
const AUDIT_LOGS: AuditLog[] = [
  {
    id: "LOG-9921",
    action: "Updated Commission Rate",
    actor: {
      name: "Admin User",
      email: "admin@platform.com",
      role: "Super Admin",
      avatar: "AU",
    },
    category: "finance",
    entity: "Category: Electronics",
    timestamp: "Oct 26, 10:42 AM",
    ipAddress: "192.168.1.45",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    changes: [
      { field: "commission_rate", oldValue: "5.0%", newValue: "5.5%" },
      { field: "min_fee", oldValue: "₦100", newValue: "₦150" },
    ],
  },
  {
    id: "LOG-9922",
    action: "Suspended Vendor Account",
    actor: {
      name: "Sarah Support",
      email: "sarah@platform.com",
      role: "Support",
      avatar: "SS",
    },
    category: "vendor",
    entity: "Vendor: Tech Haven",
    timestamp: "Oct 26, 09:15 AM",
    ipAddress: "10.0.0.12",
    userAgent: "Chrome/118.0.0.0 Safari/537.36",
    changes: [
      { field: "status", oldValue: "active", newValue: "suspended" },
      {
        field: "suspension_reason",
        oldValue: "null",
        newValue: "'Repeated counterfeit items'",
      },
    ],
  },
  {
    id: "LOG-9923",
    action: "API Key Generated",
    actor: {
      name: "System",
      email: "system@bot",
      role: "System",
      avatar: "SY",
    },
    category: "security",
    entity: "Integration: Google Maps",
    timestamp: "Oct 25, 11:30 PM",
    ipAddress: "127.0.0.1",
    userAgent: "System/Internal-Worker",
    changes: undefined, // No specific field diff for generation events often
  },
  {
    id: "LOG-9924",
    action: "Changed Payout Schedule",
    actor: {
      name: "Admin User",
      email: "admin@platform.com",
      role: "Super Admin",
      avatar: "AU",
    },
    category: "system",
    entity: "Global Settings",
    timestamp: "Oct 25, 04:20 PM",
    ipAddress: "192.168.1.45",
    userAgent: "Mozilla/5.0 (Macintosh)",
    changes: [
      { field: "payout_frequency", oldValue: "weekly", newValue: "bi-weekly" },
    ],
  },
];

export default function AuditLogsView() {
  const [logs] = useState<AuditLog[]>(AUDIT_LOGS);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handlers
  const handleViewLog = (log: AuditLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const auditColumns = getAuditColumns({ onView: handleViewLog });

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
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Events (Today)"
            value="1,204"
            icon={Activity}
            variant="default"
          />
          <StatCard
            label="Critical Security Alerts"
            value="0"
            icon={ShieldCheck}
            variant="emerald"
          />
          <StatCard
            label="Admin Actions"
            value="24"
            icon={Search}
            variant="indigo"
          />
        </div>

        {/* TABS & FILTERS */}
        <Tabs defaultValue="all" className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                {
                  value: "all",
                  label: "All Events",
                  count: logs.length,
                  variant: "default",
                },
                {
                  value: "security",
                  label: "Security",
                  count: logs.filter((l) => l.category === "security").length,
                  variant: "rose",
                },
                {
                  value: "finance",
                  label: "Finance",
                  count: logs.filter((l) => l.category === "finance").length,
                  variant: "emerald",
                },
              ]}
            />
          </div>

          {/* TAB 1: ALL LOGS */}
          <TabsContent value="all">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <DataTable columns={auditColumns} data={logs} />
            </div>
          </TabsContent>

          {/* TAB 2: SECURITY */}
          <TabsContent value="security">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <DataTable
                columns={auditColumns}
                data={logs.filter((l) => l.category === "security")}
              />
            </div>
          </TabsContent>

          {/* TAB 3: FINANCE */}
          <TabsContent value="finance">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <DataTable
                columns={auditColumns}
                data={logs.filter((l) => l.category === "finance")}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* DETAIL MODAL */}
      <LogDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        log={selectedLog}
      />
    </div>
  );
}
