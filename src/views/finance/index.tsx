/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/preserve-manual-memoization */
"use client";

import { useMemo, useState } from "react";
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

import { StatCard } from "@/components/cards/stat-card";
import { walletColumns, transactionColumns, VendorWalletRow, FinanceTransactionRow } from "./column";
import { GatewayConfigModal } from "./actions";

import {
  useFinanceStats,
  useFinanceTransactions,
  useVendorWallets,
  usePaymentGateways,
} from "@/src/features/finance/hooks";
import { VendorWalletDto } from "@/src/features/finance/api";

function toIsoDayRange(date: string) {
  const from = new Date(`${date}T00:00:00.000Z`).toISOString();
  const to = new Date(`${date}T23:59:59.999Z`).toISOString();
  return { from, to };
}

function mapUiToTxnStatus(ui: string) {
  if (ui === "completed") return "Paid";
  if (ui === "pending") return "Pending";
  if (ui === "failed") return "Refunded";
  return undefined;
}

function mapUiToWalletStatus(ui: string) {
  if (ui === "failed") return "Frozen";
  return undefined;
}

function humanizeType(s: string) {
  return String(s || "").replace(/([a-z])([A-Z])/g, "$1 $2"); // OrderPayment -> Order Payment
}

function isCredit(type: string) {
  const t = String(type || "").toLowerCase();
  if (t.includes("orderpayment")) return true;
  if (t.includes("commission")) return true;
  if (t.includes("payout")) return false;
  if (t.includes("refund")) return false;
  return true;
}

export default function FinancePage() {

  const [currency, setCurrency] = useState("NGN");

  const symbol = currency === "NGN" ? "₦" : "R";

  const formatCurrency = (val: number) => {
    return `${symbol}${val.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  // Filters (shared UI)
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");

  const dayRange = filterDate ? toIsoDayRange(filterDate) : null;

  // ---- Queries ----
  const statsQuery = useFinanceStats({
    currency,
    dateFrom: dayRange?.from,
    dateTo: dayRange?.to,
  });

  const transactionsQuery = useFinanceTransactions({
    currency,
    pageNumber: 1,
    pageSize: 50,
    status: filterStatus === "all" ? undefined : mapUiToTxnStatus(filterStatus),
    dateFrom: dayRange?.from,
    dateTo: dayRange?.to,
  });

  const walletsQuery = useVendorWallets({
    currency,
    pageNumber: 1,
    pageSize: 50,
    status:
      filterStatus === "all" ? undefined : mapUiToWalletStatus(filterStatus),
    startDate: dayRange?.from,
    endDate: dayRange?.to,
  });

  const gatewaysQuery = usePaymentGateways({
    currency,
    dateFrom: dayRange?.from,
    dateTo: dayRange?.to,
  });

  // ---- Map backend -> table rows ----
const displayWallets = useMemo<VendorWalletRow[]>(() => {
  const data = walletsQuery.data ?? [];
  return data.map((w) => ({
    vendorId: w.vendorId,
    vendorName: w.vendorName,
    rawBalance: w.walletBalance,
    balance: formatCurrency(w.walletBalance),
    pending: formatCurrency(w.pendingBalance),
    lastPayout: w.lastPayoutDate ? w.lastPayoutDate.substring(0, 10) : "—",
    status: String(w.status ?? "").toLowerCase(),
    currency: w.currency,
  }));
}, [walletsQuery.data, currency]);

const displayTransactions = useMemo<FinanceTransactionRow[]>(() => {
  const data = transactionsQuery.data ?? [];

  return data.map((t) => {
    const credit = String(t.type).toLowerCase().includes("orderpayment");
    const signedAmount = `${credit ? "+" : "-"}${formatCurrency(t.amount)}`;

    return {
      id: t.transactionId,
      type: String(t.type ?? ""),
      amount: signedAmount,
      from: credit ? (t.userName || "Customer") : "Platform",
      to: credit ? "Platform" : (t.userName || "Customer"),
      date: t.date ? t.date.substring(0, 10) : "—", // ✅ always string
      status: t.status === "Paid" ? "Completed" : String(t.status ?? ""),
    };
  });
}, [transactionsQuery.data, currency]);

  const gatewayCards = useMemo(() => {
    const data = gatewaysQuery.data ?? [];
    return data.map((g: { gatewayName: any; status: any; transactionCount: { toLocaleString: () => any; }; monthlyVolume: number; }) => ({
      name: g.gatewayName,
      status: g.status,
      transactions: g.transactionCount.toLocaleString(),
      volume: formatCurrency(g.monthlyVolume),
    }));
  }, [gatewaysQuery.data, currency]);

  const stats = statsQuery.data;

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
            <SelectTrigger className="h-9 w-24 bg-zinc-50 border-zinc-200 text-xs font-bold text-zinc-700 shadow-sm focus:ring-sax-gold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NGN">NGN (₦)</SelectItem>
              <SelectItem value="ZAR">ZAR (R)</SelectItem>
            </SelectContent>
          </Select>

          {/* <Button variant="outline" size="sm" className="h-9 text-xs shadow-sm">
            <Download className="mr-2 h-3.5 w-3.5" /> Export Audit Log
          </Button> */}
        </div>
      </header>

      <main className="p-6 max-w-400 mx-auto space-y-6">
        {/* TOP METRICS */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Platform Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              label="Total Revenue"
              value={formatCurrency(stats?.totalRevenue ?? 0)}
              icon={TrendingUp}
              variant="emerald"
            />
            <StatCard
              label="Commission Earned"
              value={formatCurrency(stats?.commissionEarned ?? 0)}
              icon={Wallet}
              variant="cyan"
            />
            <StatCard
              label="Pending Payouts"
              value={formatCurrency(stats?.pendingPayouts ?? 0)}
              icon={Activity}
              variant="gold"
            />

            <div className="bg-zinc-900 text-white p-5 rounded-xl shadow-sm flex flex-col justify-center gap-2 border border-zinc-800">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sax-gold">
                Net Profit
              </p>
              <p className="text-2xl font-bold font-mono tracking-tight">
                {formatCurrency(stats?.netProfit ?? 0)}
              </p>
            </div>
          </div>

          {statsQuery.isError && (
            <p className="text-xs text-red-600">
              Failed to load finance stats.
            </p>
          )}
        </section>

        {/* MAIN TABS */}
        <div className="space-y-4">
          <Tabs defaultValue="transactions" className="w-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 gap-4 md:gap-0">
              <TabsList className="bg-transparent p-0 h-12 justify-start">
                <TabTrigger value="transactions" label="Transaction Log" />
                <TabTrigger value="wallets" label="Vendor Wallets" />
                <TabTrigger value="gateways" label="Payment Gateways" />
              </TabsList>

              {/* GLOBAL FILTERS */}
              <div className="flex items-center gap-2 pb-2 md:pb-0">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-9 w-35 text-xs bg-white shadow-sm border-zinc-200">
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

            {/* TAB 1: TRANSACTIONS */}
            <TabsContent value="transactions" className="mt-6">
              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
                {(transactionsQuery.isLoading ||
                  transactionsQuery.isFetching) && (
                  <div className="p-4 text-xs text-zinc-500">
                    Loading transactions…
                  </div>
                )}
                {transactionsQuery.isError && (
                  <div className="p-4 text-xs text-red-600">
                    Failed to load transactions.
                  </div>
                )}
                <DataTable
                  columns={transactionColumns}
                  data={displayTransactions}
                />
              </div>
            </TabsContent>

            {/* TAB 2: VENDOR WALLETS */}
            <TabsContent value="wallets" className="mt-6">
              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
                {(walletsQuery.isLoading || walletsQuery.isFetching) && (
                  <div className="p-4 text-xs text-zinc-500">
                    Loading vendor wallets…
                  </div>
                )}
                {walletsQuery.isError && (
                  <div className="p-4 text-xs text-red-600">
                    Failed to load vendor wallets.
                  </div>
                )}
                <DataTable columns={walletColumns} data={displayWallets} />
              </div>
            </TabsContent>

            {/* TAB 3: GATEWAYS */}
            <TabsContent value="gateways" className="mt-6">
              {(gatewaysQuery.isLoading || gatewaysQuery.isFetching) && (
                <div className="p-4 text-xs text-zinc-500">
                  Loading gateways…
                </div>
              )}
              {gatewaysQuery.isError && (
                <div className="p-4 text-xs text-red-600">
                  Failed to load gateways.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gatewayCards.map((g: { name: any; status: any; transactions: any; volume: any; }) => (
                  <GatewayCard
                    key={g.name}
                    name={g.name}
                    status={g.status}
                    transactions={g.transactions}
                    volume={g.volume}
                  />
                ))}

                {/* Stripe placeholder */}
                <div className="bg-zinc-50 border border-dashed border-zinc-300 rounded-xl p-6 flex flex-col items-center justify-center text-center opacity-70 min-h-56">
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

function TabTrigger({
  value,
  label,
  hasPulse = false,
}: {
  value: string;
  label: string;
  hasPulse?: boolean;
}) {
  return (
    <TabsTrigger
      value={value}
      className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500 data-[state=active]:bg-zinc-900 data-[state=active]:text-[#D4AF37] transition-all hover:text-zinc-900 data-[state=active]:hover:text-[#D4AF37] flex items-center gap-2"
    >
      {label}
      {hasPulse && (
        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
      )}
    </TabsTrigger>
  );
}

function GatewayCard({ name, status, transactions, volume }: any) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col justify-between min-h-56">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-zinc-100 rounded-lg flex items-center justify-center font-black text-sm text-zinc-600">
            {name?.[0] ?? "G"}
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
          <span className="text-zinc-500 font-bold uppercase tracking-wider">
            Monthly Volume
          </span>
          <span className="font-mono font-bold text-zinc-900 text-sm">
            {volume}
          </span>
        </div>
        <div className="flex justify-between text-xs items-center">
          <span className="text-zinc-500 font-bold uppercase tracking-wider">
            Transactions
          </span>
          <span className="font-mono font-bold text-zinc-900 text-sm">
            {transactions}
          </span>
        </div>
        <div className="w-full bg-zinc-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div className="bg-sax-gold h-full w-[70%]" />
        </div>
      </div>
    </div>
  );
}
