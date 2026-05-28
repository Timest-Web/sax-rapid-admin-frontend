/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
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
import {
  AlertCircle,
  History,
  CheckCircle2,
  Download,
  Calendar as CalendarIcon,
  Table,
} from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";
import { FilterTabs } from "@/components/tabs/filter-tab";

import { payoutColumns } from "./column";
import {
  useWithdrawals,
  useWithdrawalStats,
} from "@/src/features/withdrawals/hooks";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

function startEndOfDayISO(dateOnly: string) {
  if (!dateOnly) return { dateFrom: undefined, dateTo: undefined };
  const from = new Date(`${dateOnly}T00:00:00.000Z`).toISOString();
  const to = new Date(`${dateOnly}T23:59:59.999Z`).toISOString();
  return { dateFrom: from, dateTo: to };
}

function money(amount: number, currency: string) {
  const symbol =
    currency === "NGN"
      ? "₦"
      : currency === "ZAR"
        ? "R"
        : currency === "USD"
          ? "$"
          : "";
  return `${symbol}${Number(amount ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function PayoutsView() {
  const [currency, setCurrency] = useState("NGN");
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  const { dateFrom, dateTo } = startEndOfDayISO(filterDate);

  const statsQ = useWithdrawalStats(currency);

  // Queue = Pending only
  const pendingQ = useWithdrawals({
    currency,
    status: "Pending",
    dateFrom,
    dateTo,
    pageNumber: 1,
    pageSize: 20,
  });

  // History = everything (optionally filtered by status)
  const historyQ = useWithdrawals({
    currency,
    status: filterStatus === "all" ? undefined : filterStatus,
    dateFrom,
    dateTo,
    pageNumber: 1,
    pageSize: 20,
  });

  const pending = pendingQ.data ?? [];

  const history = useMemo(() => {
    const rows = historyQ.data ?? [];
    // If "all", remove pending to keep it truly history
    if (filterStatus === "all") {
      return rows.filter((r) => String(r.status).toLowerCase() !== "pending");
    }
    return rows;
  }, [historyQ.data, filterStatus]);

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Finance / Payouts
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="h-9 w-24 bg-zinc-50 border-zinc-200 text-xs font-bold text-zinc-700 shadow-sm focus:ring-sax-gold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NGN">NGN (₦)</SelectItem>
              <SelectItem value="ZAR">ZAR (R)</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs shadow-sm"
            disabled
          >
            <Download className="mr-2 h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-400 mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Pending Requests"
            value={
              statsQ.isLoading ? "—" : String(statsQ.data?.pendingRequests ?? 0)
            }
            icon={AlertCircle}
            variant="rose"
          />
          <StatCard
            label="Processed Today"
            value={
              statsQ.isLoading ? "—" : String(statsQ.data?.processedToday ?? 0)
            }
            icon={CheckCircle2}
            variant="cyan"
          />
          <StatCard
            label="Total Disbursed"
            value={
              statsQ.isLoading
                ? "—"
                : money(
                    statsQ.data?.totalDisbursed ?? 0,
                    statsQ.data?.currency ?? currency,
                  )
            }
            icon={History}
            variant="emerald"
          />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as any)}
          className="w-full flex flex-col mt-4"
        >
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

            <div className="flex items-center gap-2 pb-2 md:pb-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-9 w-40 text-xs bg-white shadow-sm border-zinc-200">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="h-9 pl-9 text-xs w-37.5 bg-white shadow-sm border-zinc-200 text-zinc-600 font-mono"
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
            <TabsContent value="pending" className="m-0">
              {pendingQ.isLoading ? (
                <TableSkeleton columns={payoutColumns.length} rows={12} withToolbar={false} />
              ) : pendingQ.isError ? (
                <div className="p-6 text-sm text-rose-600">
                  Failed to load pending requests.
                </div>
              ) : pending.length > 0 ? (
                <DataTable columns={payoutColumns} data={pending} />
              ) : (
                <div className="p-16 flex flex-col items-center justify-center text-center">
                  <div className="h-12 w-12 rounded-full bg-zinc-50 flex items-center justify-center mb-3">
                    <CheckCircle2 size={24} className="text-zinc-300" />
                  </div>
                  <p className="text-sm font-bold text-zinc-900">
                    All caught up!
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    There are no pending payout requests matching your filters.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="m-0">
              {historyQ.isLoading ? (
                <TableSkeleton columns={payoutColumns.length} rows={12} withToolbar={false} />
              ) : historyQ.isError ? (
                <div className="p-6 text-sm text-rose-600">
                  Failed to load payout history.
                </div>
              ) : history.length > 0 ? (
                <DataTable columns={payoutColumns} data={history} />
              ) : (
                <div className="p-16 flex flex-col items-center justify-center text-center">
                  <div className="h-12 w-12 rounded-full bg-zinc-50 flex items-center justify-center mb-3">
                    <History size={24} className="text-zinc-300" />
                  </div>
                  <p className="text-sm font-bold text-zinc-900">
                    No records found
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Try adjusting your date or status filters.
                  </p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
