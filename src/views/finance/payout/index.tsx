/* eslint-disable react-hooks/preserve-manual-memoization */
"use client";

import { useState, useMemo } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { payoutColumns } from "./column";
import { AlertCircle, History, CheckCircle2, Download, Calendar } from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";
import { FilterTabs } from "@/components/tabs/filter-tab";

// ─── RAW DATA (Base NGN) ───
// Using raw numbers so we can multiply by the exchange rate dynamically.
const RAW_PAYOUT_REQUESTS = [
  { id: "PAY-001", vendor: "TechHub Store", rawAmount: 2500000, date: "2024-10-24", status: "Pending", bank: "GTBank ****1234" },
  { id: "PAY-002", vendor: "Fashion Nova", rawAmount: 850000, date: "2024-10-24", status: "Completed", bank: "Zenith ****5678" },
  { id: "PAY-003", vendor: "GameStop NG", rawAmount: 120000, date: "2024-10-23", status: "Failed", bank: "Access ****9012" },
  { id: "PAY-004", vendor: "Home Essentials", rawAmount: 3400000, date: "2024-10-23", status: "Pending", bank: "UBA ****3456" },
  { id: "PAY-005", vendor: "SneakerX", rawAmount: 450000, date: "2024-10-21", status: "Completed", bank: "Fidelity ****7890" },
  { id: "PAY-006", vendor: "Beauty Box", rawAmount: 150000, date: "2024-10-21", status: "Pending", bank: "Stanbic ****1122" },
];

export default function PayoutsView() {
  // --- CURRENCY STATE ---
  const [currency, setCurrency] = useState("NGN");
  const isNGN = currency === "NGN";
  const symbol = isNGN ? "₦" : "R";
  const exchangeRate = isNGN ? 1 : 0.011; // 1 NGN = ~0.011 ZAR

  // --- FILTER STATE ---
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  // --- HELPERS ---
  const formatCurrency = (val: number) => {
    return `${symbol}${(val * exchangeRate).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  // Base Stats (in NGN)
  const totalDisbursedBase = 45200000; 
  const processedToday = 12;

  // --- DYNAMIC DATA COMPUTATION ---
  const processedData = useMemo(() => {
    return RAW_PAYOUT_REQUESTS.map((p) => ({
      ...p,
      amount: formatCurrency(p.rawAmount), // Formats the raw amount dynamically for the table
    })).filter((p) => {
      const matchDate = !filterDate || p.date === filterDate;
      const matchStatus = filterStatus === "all" || p.status.toLowerCase() === filterStatus.toLowerCase();
      return matchDate && matchStatus;
    });
  }, [filterDate, filterStatus, exchangeRate, currency]);

  // Split into Tabs
  const pending = processedData.filter((p) => p.status === "Pending");
  const history = processedData.filter((p) => p.status !== "Pending");

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Finance / Payouts
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* CURRENCY SWITCHER */}
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="h-9 w-24 bg-zinc-50 border-zinc-200 text-xs font-bold text-zinc-700 shadow-sm focus:ring-[#EAB308]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NGN">NGN (₦)</SelectItem>
              <SelectItem value="ZAR">ZAR (R)</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="h-9 text-xs shadow-sm">
            <Download className="mr-2 h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Pending Requests"
            value={String(pending.length)}
            icon={AlertCircle}
            variant="rose"
          />
          <StatCard
            label="Processed Today"
            value={String(processedToday)}
            icon={CheckCircle2}
            variant="cyan"
          />
          <StatCard
            label="Total Disbursed"
            value={formatCurrency(totalDisbursedBase)}
            icon={History}
            variant="emerald"
          />
        </div>

        {/* TABS & FILTERS */}
        <Tabs defaultValue="pending" className="w-full flex flex-col mt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-200 gap-4 md:gap-0 pb-2 md:pb-0">
            <FilterTabs
              tabs={[
                {
                  value: "pending",
                  label: "Queue",
                  count: pending.length,
                  variant: "rose",
                },
                {
                  value: "history",
                  label: "History",
                  count: history.length,
                  variant: "indigo",
                },
              ]}
            />

            {/* GLOBAL FILTERS (Date & Status) */}
            <div className="flex items-center gap-2 pb-2 md:pb-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-9 w-[140px] text-xs bg-white shadow-sm border-zinc-200">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="h-9 pl-9 text-xs w-[150px] bg-white shadow-sm border-zinc-200 text-zinc-600 font-mono"
                />
              </div>

              {(filterStatus !== "all" || filterDate) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs text-zinc-500 hover:text-zinc-900"
                  onClick={() => {
                    setFilterStatus("all");
                    setFilterDate("");
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
            {/* TAB 1: PENDING */}
            <TabsContent value="pending" className="m-0">
              {pending.length > 0 ? (
                <DataTable columns={payoutColumns} data={pending} />
              ) : (
                <div className="p-16 flex flex-col items-center justify-center text-center">
                  <div className="h-12 w-12 rounded-full bg-zinc-50 flex items-center justify-center mb-3">
                    <CheckCircle2 size={24} className="text-zinc-300" />
                  </div>
                  <p className="text-sm font-bold text-zinc-900">All caught up!</p>
                  <p className="text-xs text-zinc-500 mt-1">There are no pending payout requests matching your filters.</p>
                </div>
              )}
            </TabsContent>

            {/* TAB 2: HISTORY */}
            <TabsContent value="history" className="m-0">
              {history.length > 0 ? (
                 <DataTable columns={payoutColumns} data={history} />
              ) : (
                <div className="p-16 flex flex-col items-center justify-center text-center">
                  <div className="h-12 w-12 rounded-full bg-zinc-50 flex items-center justify-center mb-3">
                    <History size={24} className="text-zinc-300" />
                  </div>
                  <p className="text-sm font-bold text-zinc-900">No records found</p>
                  <p className="text-xs text-zinc-500 mt-1">Try adjusting your date or status filters.</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}