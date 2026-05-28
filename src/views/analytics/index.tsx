/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Activity, ShoppingBag, CreditCard, ShoppingCart, Tags, Package, Store, Users } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { StatCard } from "@/components/cards/stat-card";

// IMPORTANT: these charts must accept API data (see note below)
import { RevenueTrendChart, OrdersBarChart } from "./charts";

// Analytics hooks (from the endpoints you provided)
import {
  useDashboardStats,
  useMonthlyRevenue,
  useMonthlyOrders,
  useTopProducts,
  useRecentAdminOrders,
} from "@/src/features/analytics/hooks";

function TabTrigger({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <TabsTrigger
      value={value}
      className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500 data-[state=active]:bg-zinc-900 data-[state=active]:text-[#D4AF37] transition-all hover:text-zinc-900 data-[state=active]:hover:text-[#D4AF37]"
    >
      {label}
    </TabsTrigger>
  );
}

function money(amount: number, currency: string) {
  const symbol =
    currency === "NGN" ? "₦" : currency === "ZAR" ? "R" : currency === "USD" ? "$" : "";
  return `${symbol}${Number(amount ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function monthName(m: number) {
  return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m - 1] ?? `M${m}`;
}

function computePresetRange(preset: "7d" | "30d" | "ytd"): DateRange {
  const now = new Date();
  if (preset === "7d") {
    const from = new Date();
    from.setDate(now.getDate() - 7);
    return { from, to: now };
  }
  if (preset === "ytd") {
    const from = new Date(now.getFullYear(), 0, 1);
    return { from, to: now };
  }
  // "30d"
  const from = new Date();
  from.setDate(now.getDate() - 30);
  return { from, to: now };
}

export default function AnalyticsView() {
  const [currency, setCurrency] = useState("NGN");

  // time controls (only what backend supports: dateFrom/dateTo)
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "ytd" | "custom">("30d");

  const [date, setDate] = useState<DateRange | undefined>(computePresetRange("30d"));

  // keep date in sync with presets
  useEffect(() => {
    if (timeRange === "custom") return;
    setDate(computePresetRange(timeRange));
  }, [timeRange]);

  const dateFrom = date?.from?.toISOString();
  const dateTo = date?.to?.toISOString();

  // ---- Queries (only endpoints provided) ----
  const statsQ = useDashboardStats({ currency, dateFrom, dateTo });
  const monthlyRevenueQ = useMonthlyRevenue({ currency, dateFrom, dateTo });
  const monthlyOrdersQ = useMonthlyOrders({ dateFrom, dateTo });

  const topProductsQ = useTopProducts({
    pageNumber: 1,
    pageSize: 20,
    dateFrom,
    dateTo,
  });

  const recentOrdersQ = useRecentAdminOrders({
    currency,
    pageNumber: 1,
    pageSize: 20,
    dateFrom,
    dateTo,
  });

  // ---- Chart data mapping ----
  const revenueChartData = useMemo(() => {
    return (monthlyRevenueQ.data ?? []).map((p) => ({
      name: `${monthName(p.month)} ${p.year}`,
      revenue: p.totalRevenue,
    }));
  }, [monthlyRevenueQ.data]);

  const ordersChartData = useMemo(() => {
    return (monthlyOrdersQ.data ?? []).map((p) => ({
      name: `${monthName(p.month)} ${p.year}`,
      orders: p.orderCount,
    }));
  }, [monthlyOrdersQ.data]);

  const stats = statsQ.data;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm uppercase tracking-widest text-zinc-900 font-bold font-display">
            Analytics & Reports
          </h1>
        </div>

        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger className="h-9 w-28 bg-zinc-50 border-zinc-200 text-xs font-bold text-zinc-700 shadow-sm focus:ring-zinc-900 rounded-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NGN">NGN (₦)</SelectItem>
            <SelectItem value="ZAR">ZAR (R)</SelectItem>
          </SelectContent>
        </Select>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-8 mt-2">
        {/* Controls & Date range */}
        <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-zinc-200">
          <div className="flex items-center gap-4 px-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Analysis Period:
            </span>

            <div className="flex gap-2 items-center">
              <Select value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
                <SelectTrigger className="w-50 h-10 bg-zinc-50 border-zinc-200 rounded-xl font-mono text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              {timeRange === "custom" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-10 px-4 rounded-xl border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 text-xs",
                        !date && "text-zinc-400",
                      )}
                    >
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {date?.from
                        ? date.to
                          ? `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
                          : format(date.from, "LLL dd, y")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden border-zinc-200 shadow-xl" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>

        {/* Stat cards (backend-provided only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Overview (Visits)" value={statsQ.isLoading ? "—" : String(stats?.visits ?? 0)} icon={Activity} variant="default" />
          <StatCard label="Products" value={statsQ.isLoading ? "—" : String(stats?.products ?? 0)} icon={ShoppingBag} variant="indigo" />
          <StatCard label="Revenue" value={statsQ.isLoading ? "—" : money(stats?.revenue ?? 0, stats?.currency ?? currency)} icon={CreditCard} variant="emerald" />
          <StatCard label="Orders" value={statsQ.isLoading ? "—" : String(stats?.orders ?? 0)} icon={ShoppingCart} variant="cyan" />
          <StatCard label="Categories" value={statsQ.isLoading ? "—" : String(stats?.categories ?? 0)} icon={Tags} variant="gold" />
          <StatCard label="Stock Lvl" value={statsQ.isLoading ? "—" : String(stats?.stockLevel ?? 0)} icon={Package} variant="violet" />
          <StatCard label="Vendors" value={statsQ.isLoading ? "—" : String(stats?.vendors ?? 0)} icon={Store} variant="rose" />
          <StatCard label="Customers" value={statsQ.isLoading ? "—" : String(stats?.customers ?? 0)} icon={Users} variant="amber" />
        </div>

        {/* Tabs (backend-provided only) */}
        <Tabs defaultValue="overview" className="w-full flex flex-col mt-4">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-zinc-200/50 p-1 h-12 rounded-full inline-flex gap-1 overflow-x-auto whitespace-nowrap">
              <TabTrigger value="overview" label="Overview" />
              <TabTrigger value="revenue" label="Revenue" />
              <TabTrigger value="orders" label="Orders" />
              <TabTrigger value="products" label="Top Products" />
            </TabsList>
          </div>

          {/* Overview */}
          <TabsContent value="overview" className="m-0 space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Revenue Trend
                </h3>

                <div className="mt-4">
                  {monthlyRevenueQ.isLoading ? (
                    <div className="text-sm text-zinc-500">Loading revenue…</div>
                  ) : monthlyRevenueQ.isError ? (
                    <div className="text-sm text-rose-600">Failed to load revenue chart.</div>
                  ) : (
                    <RevenueTrendChart
                      symbol={currency === "NGN" ? "₦" : "R"}
                      data={revenueChartData}
                    />
                  )}
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Top Products (Units Sold)
                </h3>

                <div className="mt-4 space-y-3">
                  {topProductsQ.isLoading ? (
                    <div className="text-sm text-zinc-500">Loading…</div>
                  ) : topProductsQ.isError ? (
                    <div className="text-sm text-rose-600">Failed to load top products.</div>
                  ) : (
                    (topProductsQ.data ?? []).slice(0, 6).map((p) => (
                      <div
                        key={p.productId}
                        className="flex items-center justify-between border border-zinc-200 rounded-xl p-3 bg-zinc-50/40"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-zinc-900 truncate">
                            {p.productName}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-mono">
                            SKU: {p.sku}
                          </p>
                        </div>
                        <p className="font-mono font-bold text-zinc-900">
                          {p.unitsSold}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Revenue */}
          <TabsContent value="revenue" className="m-0 animate-in fade-in">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Monthly Revenue
              </h3>

              <div className="mt-4">
                {monthlyRevenueQ.isLoading ? (
                  <div className="text-sm text-zinc-500">Loading…</div>
                ) : monthlyRevenueQ.isError ? (
                  <div className="text-sm text-rose-600">Failed to load revenue.</div>
                ) : (
                  <RevenueTrendChart
                    symbol={currency === "NGN" ? "₦" : "R"}
                    data={revenueChartData}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders" className="m-0 space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Monthly Order Volume
                </h3>

                <div className="mt-4">
                  {monthlyOrdersQ.isLoading ? (
                    <div className="text-sm text-zinc-500">Loading…</div>
                  ) : monthlyOrdersQ.isError ? (
                    <div className="text-sm text-rose-600">Failed to load order chart.</div>
                  ) : (
                    <OrdersBarChart data={ordersChartData} />
                  )}
                </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
                <div className="p-8 pb-4 flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">
                    Recent Orders
                  </h3>
                </div>

                {recentOrdersQ.isLoading ? (
                  <div className="px-8 pb-8 text-sm text-zinc-500">Loading…</div>
                ) : recentOrdersQ.isError ? (
                  <div className="px-8 pb-8 text-sm text-rose-600">Failed to load recent orders.</div>
                ) : (
                  <div className="overflow-x-auto px-8 pb-8">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 font-mono">
                          <th className="py-4 pl-0">Order</th>
                          <th className="py-4">Customer</th>
                          <th className="py-4">Product</th>
                          <th className="py-4">Amount</th>
                          <th className="py-4 text-right pr-0">Date</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-medium text-zinc-600">
                        {(recentOrdersQ.data ?? []).map((o) => (
                          <tr key={o.orderId} className="border-b border-zinc-50 last:border-0">
                            <td className="py-4 pl-0 font-mono font-bold text-zinc-900">
                              {o.orderNumber}
                            </td>
                            <td className="py-4">{o.customerName?.trim() || "—"}</td>
                            <td className="py-4">{o.productName}</td>
                            <td className="py-4 font-mono font-bold text-zinc-900">
                              {money(o.amount, o.currency)}
                            </td>
                            <td className="py-4 pr-0 text-right font-mono text-zinc-400 text-xs">
                              {new Date(o.date).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Top Products */}
          <TabsContent value="products" className="m-0 animate-in fade-in">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-6">
                Top Performing Products
              </h3>

              {topProductsQ.isLoading ? (
                <div className="text-sm text-zinc-500">Loading…</div>
              ) : topProductsQ.isError ? (
                <div className="text-sm text-rose-600">Failed to load top products.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 font-mono">
                      <th className="py-4 pl-0">Product</th>
                      <th className="py-4">SKU</th>
                      <th className="py-4 text-right pr-0">Units Sold</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-medium text-zinc-600">
                    {(topProductsQ.data ?? []).map((p) => (
                      <tr key={p.productId} className="border-b border-zinc-50 last:border-0">
                        <td className="py-4 pl-0 font-bold text-zinc-900">{p.productName}</td>
                        <td className="py-4 font-mono text-zinc-500">{p.sku}</td>
                        <td className="py-4 pr-0 text-right font-mono font-bold text-zinc-900">{p.unitsSold}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}