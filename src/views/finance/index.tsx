/* eslint-disable react-hooks/preserve-manual-memoization */
"use client";

import { useState, useMemo } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Download,
  Activity,
  Calendar,
} from "lucide-react";
import { GatewayConfigModal } from "./actions"; // Assuming this exists in your project
import { StatCard } from "@/components/cards/stat-card";
import { walletColumns, transactionColumns } from "./column";

// ─── RAW DATA (Base NGN) ───
// We use raw numbers here so we can multiply by the exchange rate dynamically.
const RAW_FINANCE_STATS = {
  totalRevenue: 45000000,
  platformCommission: 4500000,
  pendingPayouts: 1200000,
  netProfit: 11025000,
};

const RAW_VENDOR_WALLETS = [
  { id: "1", vendor: "TechHub Store", rawBalance: 2500000, status: "active", lastActive: "2024-10-24" },
  { id: "2", vendor: "Fashion Nova", rawBalance: 850000, status: "active", lastActive: "2024-10-23" },
  { id: "3", vendor: "GameStop NG", rawBalance: 120000, status: "frozen", lastActive: "2024-10-20" },
  { id: "4", vendor: "Home Essentials", rawBalance: 3400000, status: "active", lastActive: "2024-10-24" },
];

const RAW_TRANSACTIONS = [
  { id: "TXN-001", vendor: "TechHub Store", type: "Sale", rawAmount: 120000, status: "completed", date: "2024-10-24" },
  { id: "TXN-002", vendor: "Fashion Nova", type: "Payout", rawAmount: 500000, status: "pending", date: "2024-10-24" },
  { id: "TXN-003", vendor: "GameStop NG", type: "Refund", rawAmount: 45000, status: "completed", date: "2024-10-23" },
  { id: "TXN-004", vendor: "Home Essentials", type: "Sale", rawAmount: 850000, status: "completed", date: "2024-10-23" },
  { id: "TXN-005", vendor: "TechHub Store", type: "Sale", rawAmount: 250000, status: "failed", date: "2024-10-22" },
];

export default function FinancePage() {
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

  // --- DYNAMIC DATA COMPUTATION ---
  // 1. Wallets (Filtered & Formatted)
  const displayWallets = useMemo(() => {
    return RAW_VENDOR_WALLETS.filter((w) => {
      const matchStatus = filterStatus === "all" || w.status === filterStatus;
      return matchStatus;
    }).map((w) => ({
      ...w,
      balance: formatCurrency(w.rawBalance), // Replaces raw amount with formatted string for the table
    }));
  }, [filterStatus, exchangeRate, currency]);

  // 2. Transactions (Filtered & Formatted)
  const displayTransactions = useMemo(() => {
    return RAW_TRANSACTIONS.filter((t) => {
      const matchStatus = filterStatus === "all" || t.status === filterStatus;
      const matchDate = !filterDate || t.date === filterDate;
      return matchStatus && matchDate;
    }).map((t) => ({
      ...t,
      amount: formatCurrency(t.rawAmount), // Replaces raw amount with formatted string for the table
    }));
  }, [filterStatus, filterDate, exchangeRate, currency]);

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Finance & Payments
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
            <Download className="mr-2 h-3.5 w-3.5" /> Export Audit Log
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* TOP METRICS (PLATFORM WALLET) */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Platform Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Revenue"
              value={formatCurrency(RAW_FINANCE_STATS.totalRevenue)}
              icon={TrendingUp}
              variant="emerald"
            />
            <StatCard
              label="Commission Earned"
              value={formatCurrency(RAW_FINANCE_STATS.platformCommission)}
              icon={Wallet}
              variant="cyan"
            />
            <StatCard
              label="Pending Payouts"
              value={formatCurrency(RAW_FINANCE_STATS.pendingPayouts)}
              icon={Activity}
              variant="gold"
            />
            <div className="bg-zinc-900 text-white p-5 rounded-xl shadow-sm flex flex-col justify-center gap-2 border border-zinc-800">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#EAB308]">
                Net Profit
              </p>
              <p className="text-2xl font-bold font-mono tracking-tight">
                {formatCurrency(RAW_FINANCE_STATS.netProfit)}
              </p>
            </div>
          </div>
        </section>

        {/* MAIN TABS */}
        <div className="space-y-4">
          <Tabs defaultValue="transactions" className="w-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 gap-4 md:gap-0">
              <TabsList className="bg-transparent p-0 h-12 justify-start">
                <TabItem value="transactions" label="Transaction Log" />
                <TabItem value="wallets" label="Vendor Wallets" />
                <TabItem value="gateways" label="Payment Gateways" />
              </TabsList>

              {/* GLOBAL FILTERS (Date & Status) */}
              <div className="flex items-center gap-2 pb-2 md:pb-0">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-9 w-[140px] text-xs bg-white shadow-sm border-zinc-200">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed / Frozen</SelectItem>
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

            {/* TAB 1: TRANSACTIONS */}
            <TabsContent value="transactions" className="mt-6">
              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
                <DataTable
                  columns={transactionColumns}
                  data={displayTransactions}
                />
              </div>
            </TabsContent>

            {/* TAB 2: VENDOR WALLETS */}
            <TabsContent value="wallets" className="mt-6">
              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
                <DataTable
                  columns={walletColumns}
                  data={displayWallets}
                />
              </div>
            </TabsContent>

            {/* TAB 3: GATEWAY SETTINGS */}
            <TabsContent value="gateways" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Paystack Card */}
                <GatewayCard
                  name="Paystack"
                  status="Active"
                  transactions="4,200"
                  volume={formatCurrency(85000000)}
                />

                {/* PayFast Card */}
                <GatewayCard
                  name="PayFast"
                  status="Active"
                  transactions="1,150"
                  volume={formatCurrency(4500000)}
                />

                {/* Stripe (Disabled) */}
                <div className="bg-zinc-50 border border-dashed border-zinc-300 rounded-xl p-6 flex flex-col items-center justify-center text-center opacity-70 min-h-[14rem]">
                  <CreditCard className="h-10 w-10 text-zinc-300 mb-3" />
                  <h3 className="font-bold text-zinc-900">Stripe</h3>
                  <p className="text-xs text-zinc-500 mb-4">
                    International payments (USD)
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

// ─── LOCAL COMPONENTS ───

function TabItem({ value, label }: { value: string; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="rounded-none border-b-2 border-transparent px-6 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 data-[state=active]:border-[#EAB308] data-[state=active]:text-zinc-900 data-[state=active]:bg-transparent transition-all"
    >
      {label}
    </TabsTrigger>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GatewayCard({ name, status, transactions, volume }: any) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col justify-between min-h-[14rem]">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-zinc-100 rounded-lg flex items-center justify-center font-black text-sm text-zinc-600">
            {name[0]}
          </div>
          <div>
            <h3 className="font-bold text-lg text-zinc-900">{name}</h3>
            <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              {status}
            </span>
          </div>
        </div>
        <GatewayConfigModal name={name} />
      </div>

      <div className="space-y-3 mt-6">
        <div className="flex justify-between text-xs items-center">
          <span className="text-zinc-500 font-bold uppercase tracking-wider">Monthly Volume</span>
          <span className="font-mono font-bold text-zinc-900 text-sm">{volume}</span>
        </div>
        <div className="flex justify-between text-xs items-center">
          <span className="text-zinc-500 font-bold uppercase tracking-wider">Transactions</span>
          <span className="font-mono font-bold text-zinc-900 text-sm">
            {transactions}
          </span>
        </div>
        <div className="w-full bg-zinc-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div className="bg-[#EAB308] h-full w-[70%]" />
        </div>
      </div>
    </div>
  );
}