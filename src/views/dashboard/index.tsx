/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { StatCard } from "@/components/cards/stat-card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Search,
  Bell,
  Users,
  Store,
  ShoppingBag,
  ShoppingCart,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useDashboard } from "@/src/features/dashboard/hooks/useDashboard";
import { useDashboardGraph } from "@/src/features/dashboard/hooks/useDashboard";
import { useRecentOrders } from "@/src/features/dashboard/hooks/useDashboard";
import { useRecentTransactions } from "@/src/features/dashboard/hooks/useDashboard";
import type { DashboardCurrency } from "@/src/features/dashboard/api";
import { DataTable } from "@/components/ui/data-table/data-table";

import {
  recentOrdersColumns,
  recentTransactionsColumns,
  type RecentOrderRow,
  type RecentTransactionRow,
} from "./column";

function dateLabel(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function money(amount: number, currency: string) {
  return `${currency} ${Number(amount ?? 0).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
}

const CustomTooltip = ({ active, payload, label, prefix }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 p-3 rounded-lg shadow-xl border border-zinc-800">
        <p className="text-zinc-500 text-[10px] font-mono mb-1 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-emerald-400 text-sm font-bold font-mono">
          {prefix}
          {Number(payload[0].value ?? 0).toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardView() {
  const {
    data: dashboard,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useDashboard();

  const [currency, setCurrency] = useState<DashboardCurrency>("NGN");
  const [year, setYear] = useState<number>(new Date().getFullYear());

  // Year options (last 5 years incl current)
  const yearOptions = useMemo(() => {
    const now = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => now - i);
  }, []);

  // Graph + Recent data (currency/year driven)
  const graphQ = useDashboardGraph(currency, year);

  const recentOrdersQ = useRecentOrders({
    currency,
    pageNumber: 1,
    pageSize: 10,
  });

  const recentTxQ = useRecentTransactions({
    currency,
    pageNumber: 1,
    pageSize: 10,
  });

  const revenueSeries = useMemo(() => {
    const rev = graphQ.data?.revenue ?? [];
    return rev.map((m) => ({ name: m.monthName, revenue: m.amount }));
  }, [graphQ.data?.revenue]);

  const ordersSeries = useMemo(() => {
    const ord = graphQ.data?.orders ?? [];
    return ord.map((m) => ({ name: m.monthName, orders: m.count }));
  }, [graphQ.data?.orders]);

  const totalRevenueForYear = useMemo(() => {
    return (graphQ.data?.revenue ?? []).reduce(
      (sum, m) => sum + Number(m.amount ?? 0),
      0,
    );
  }, [graphQ.data?.revenue]);

  const totalOrdersForYear = useMemo(() => {
    return (graphQ.data?.orders ?? []).reduce(
      (sum, m) => sum + Number(m.count ?? 0),
      0,
    );
  }, [graphQ.data?.orders]);

  const recentOrdersRows = useMemo<RecentOrderRow[]>(() => {
    const rows = recentOrdersQ.data ?? [];
    return rows.map((o) => ({
      orderId: String(o.orderId),
      orderNumber: String(o.orderNumber ?? "—"),
      customerName: String(o.customerName ?? ""),
      productName: String(o.productName ?? ""),
      amount: Number(o.amount ?? 0),
      currency: String(o.currency ?? currency),
      status: String(o.status ?? "—"),
      date: String(o.date ?? ""),
    }));
  }, [recentOrdersQ.data, currency]);

  const recentTransactionsRows = useMemo<RecentTransactionRow[]>(() => {
    const rows = recentTxQ.data ?? [];
    return rows.map((t) => ({
      orderId: String(t.orderId ?? "—"),
      customerName: String(t.customerName ?? ""),
      productName: String(t.productName ?? ""),
      amount: Number(t.amount ?? 0),
      currency: String(t.currency ?? currency),
      date: String(t.date ?? ""),
    }));
  }, [recentTxQ.data, currency]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm uppercase tracking-widest text-zinc-900 font-bold font-display">
            Dashboard Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* CURRENCY */}
          <Select
            value={currency}
            onValueChange={(v) => setCurrency(v as DashboardCurrency)}
          >
            <SelectTrigger className="h-9 w-24 bg-zinc-50 border-zinc-200 text-xs font-bold text-zinc-700 shadow-sm focus:ring-zinc-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NGN">NGN</SelectItem>
              <SelectItem value="ZAR">ZAR</SelectItem>
            </SelectContent>
          </Select>

          {/* YEAR */}
          <Select
            value={String(year)}
            onValueChange={(v) => setYear(Number(v))}
          >
            <SelectTrigger className="h-9 w-24 bg-zinc-50 border-zinc-200 text-xs font-bold text-zinc-700 shadow-sm focus:ring-zinc-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* <div className="hidden md:flex items-center px-3 h-9 bg-zinc-50 border border-zinc-200 w-64 rounded-md focus-within:border-zinc-400 transition-colors">
            <Search size={14} className="text-zinc-400" />
            <input
              className="bg-transparent border-none outline-none text-xs ml-2 w-full text-zinc-900 placeholder-zinc-400 font-mono"
              placeholder="SEARCH METRICS..."
            />
          </div> */}

          <button className="h-9 w-9 flex items-center justify-center border border-zinc-200 bg-white rounded-md hover:bg-zinc-50 transition shadow-sm">
            <Bell size={16} className="text-zinc-500" />
          </button>

          <div className="h-9 w-9 bg-zinc-900 text-white flex items-center justify-center font-bold text-xs rounded-md shadow-sm">
            SA
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8 max-w-7xl mx-auto mt-4">
        {isError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl p-4 flex items-center justify-between">
            <span>Failed to load dashboard metrics.</span>
            <button
              onClick={() => refetch()}
              className="text-xs font-bold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* METRICS */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Users"
              value={
                isLoading ? "—" : (dashboard?.totalUsers ?? 0).toLocaleString()
              }
              icon={Users}
              variant="gold"
              link="/admin/buyers"
            />
            <StatCard
              label="Total Vendors"
              value={
                isLoading
                  ? "—"
                  : (dashboard?.totalVendors ?? 0).toLocaleString()
              }
              icon={Store}
              variant="cyan"
              link="/admin/vendors"
            />
            <StatCard
              label="Total Products"
              value={
                isLoading
                  ? "—"
                  : (dashboard?.totalProducts ?? 0).toLocaleString()
              }
              icon={ShoppingBag}
              variant="indigo"
              link="/admin/products"
            />
            <StatCard
              label="Total Orders"
              value={
                isLoading ? "—" : (dashboard?.totalOrders ?? 0).toLocaleString()
              }
              icon={ShoppingCart}
              variant="emerald"
              link="/admin/orders"
            />
          </div>

          {isFetching && (
            <div className="mt-3 text-[11px] text-zinc-500 font-mono">
              Updating metrics…
            </div>
          )}
        </section>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Revenue • {currency} • {year}
                </h3>
                <h2 className="text-3xl font-bold text-zinc-900 mt-1 font-mono tracking-tight">
                  {graphQ.isLoading
                    ? "—"
                    : money(totalRevenueForYear, currency)}
                </h2>

                {dashboard?.generatedAt && (
                  <p className="text-[10px] text-zinc-400 font-mono mt-1">
                    Generated:{" "}
                    {new Date(dashboard.generatedAt).toLocaleString()}
                  </p>
                )}
              </div>

              <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-400 transition">
                <MoreHorizontal size={16} />
              </button>
            </div>

            <div className="h-75 w-full">
              {graphQ.isLoading ? (
                <div className="h-full flex items-center justify-center text-sm text-zinc-500">
                  Loading revenue graph…
                </div>
              ) : graphQ.isError ? (
                <div className="h-full flex items-center justify-center text-sm text-rose-600">
                  Failed to load revenue graph.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueSeries}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f4f4f5"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fontFamily: "monospace",
                        fill: "#a1a1aa",
                      }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fontFamily: "monospace",
                        fill: "#a1a1aa",
                      }}
                      width={80}
                    />
                    <Tooltip
                      content={(props) => (
                        <CustomTooltip {...props} prefix={`${currency} `} />
                      )}
                    />

                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
            <div className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Orders • {year}
              </h3>

              <div className="flex items-center gap-2 mt-1">
                <h2 className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
                  {graphQ.isLoading ? "—" : totalOrdersForYear.toLocaleString()}
                </h2>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ArrowUpRight size={10} /> —
                </span>
              </div>
            </div>

            <div className="h-75 w-full">
              {graphQ.isLoading ? (
                <div className="h-full flex items-center justify-center text-sm text-zinc-500">
                  Loading orders graph…
                </div>
              ) : graphQ.isError ? (
                <div className="h-full flex items-center justify-center text-sm text-rose-600">
                  Failed to load orders graph.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ordersSeries}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f4f4f5"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 10,
                        fontFamily: "monospace",
                        fill: "#a1a1aa",
                      }}
                      dy={10}
                    />
                    <Tooltip
                      content={(props) => (
                        <CustomTooltip {...props} prefix={""} />
                      )}
                      cursor={{ fill: "#f4f4f5", radius: 8 }}
                    />
                    <Bar
                      dataKey="orders"
                      fill="#18181b"
                      radius={[6, 6, 6, 6]}
                      barSize={18}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="overflow-hidden">
          <div className="p-8 pb-4 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">
              Recent Orders ({currency})
            </h3>
          </div>

          <div className="px-8 pb-8">
            {recentOrdersQ.isLoading ? (
              <div className="py-6 text-sm text-zinc-500">
                Loading recent orders…
              </div>
            ) : recentOrdersQ.isError ? (
              <div className="py-6 text-sm text-rose-600">
                Failed to load recent orders.
              </div>
            ) : (
              <DataTable<RecentOrderRow, unknown>
                columns={recentOrdersColumns}
                data={recentOrdersRows}
              />
            )}
          </div>
        </div>
        {/* Recent Transactions */}
        <div className="overflow-hidden">
          <div className="p-8 pb-4 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">
              Recent Transactions ({currency})
            </h3>
          </div>

          <div className="px-8 pb-8">
            {recentTxQ.isLoading ? (
              <div className="py-6 text-sm text-zinc-500">
                Loading recent transactions…
              </div>
            ) : recentTxQ.isError ? (
              <div className="py-6 text-sm text-rose-600">
                Failed to load recent transactions.
              </div>
            ) : (
              <DataTable<RecentTransactionRow, unknown>
                columns={recentTransactionsColumns}
                data={recentTransactionsRows}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
