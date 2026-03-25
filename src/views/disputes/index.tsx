"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Scale, AlertTriangle, ShieldAlert, History } from "lucide-react";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { disputeColumns, Dispute } from "./column";
import { StatCard } from "@/components/cards/stat-card";

// --- DUMMY DATA ---
const ACTIVE_DISPUTES: Dispute[] = [
  {
    id: "1",
    ticketId: "DSP-2024-001",
    type: "fraud",
    priority: "high",
    buyerName: "Michael Scott",
    vendorName: "Dunder Mifflin Paper",
    amount: "₦450,000",
    orderId: "ORD-9921",
    date: "2 hrs ago",
    status: "open",
  },
  {
    id: "2",
    ticketId: "DSP-2024-002",
    type: "delivery",
    priority: "medium",
    buyerName: "Pam Beesly",
    vendorName: "Art Supplies Co",
    amount: "₦12,500",
    orderId: "ORD-8821",
    date: "5 hrs ago",
    status: "open",
  },
  {
    id: "3",
    ticketId: "DSP-2024-003",
    type: "refund",
    priority: "low",
    buyerName: "Jim Halpert",
    vendorName: "Sports Gear Hub",
    amount: "₦45,000",
    orderId: "ORD-7721",
    date: "1 day ago",
    status: "review",
  },
  {
    id: "4",
    ticketId: "DSP-2024-004",
    type: "refund",
    priority: "low",
    buyerName: "Stanley Hudson",
    vendorName: "Pretzel Day Inc",
    amount: "₦5,000",
    orderId: "ORD-6621",
    date: "1 day ago",
    status: "review",
  },
];

const RESOLVED_HISTORY: Dispute[] = [
  {
    id: "5",
    ticketId: "DSP-2023-882",
    type: "delivery",
    priority: "medium",
    buyerName: "Dwight Schrute",
    vendorName: "Beet Farms",
    amount: "₦22,000",
    orderId: "ORD-1120",
    date: "Oct 20",
    status: "resolved",
  },
];

export default function DisputeResolutionView() {
  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
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
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Active Cases"
            value="4"
            icon={Scale}
            variant="default"
          />
          <StatCard
            label="Funds in Escrow"
            value="₦512,500"
            icon={AlertTriangle}
            variant="gold"
          />
          <StatCard
            label="Fraud Alerts"
            value="1"
            icon={ShieldAlert}
            variant="rose" // Urgent color
          />
        </div>

        {/* TABS */}
        <Tabs defaultValue="open" className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                {
                  value: "open",
                  label: "Open Disputes",
                  count: 4,
                  variant: "rose",
                },
                {
                  value: "history",
                  label: "Resolution History",
                  count: 128,
                  variant: "indigo",
                },
              ]}
            />
          </div>

          {/* TAB 1: OPEN DISPUTES */}
          <TabsContent value="open">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="font-bold text-sm text-zinc-700">
                  Priority Queue
                </h3>
                <div className="text-xs text-zinc-500 flex gap-2 items-center">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>1 High Priority Case requires attention</span>
                </div>
              </div>
              <DataTable columns={disputeColumns} data={ACTIVE_DISPUTES} />
            </div>
          </TabsContent>

          {/* TAB 2: HISTORY */}
          <TabsContent value="history">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h3 className="font-bold text-sm text-zinc-700">
                  Past Resolutions
                </h3>
                <div className="text-xs text-zinc-500 flex gap-2 items-center">
                  <History size={14} />
                  <span>Showing last 30 days</span>
                </div>
              </div>
              <DataTable columns={disputeColumns} data={RESOLVED_HISTORY} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
