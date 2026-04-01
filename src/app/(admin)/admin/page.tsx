/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
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

// ─── DATA ───
const RAW_REVENUE_DATA = [
  { name: "Mon", revenue: 1500000 },
  { name: "Tue", revenue: 2300000 },
  { name: "Wed", revenue: 3400000 },
  { name: "Thu", revenue: 2900000 },
  { name: "Fri", revenue: 4500000 },
  { name: "Sat", revenue: 3800000 },
  { name: "Sun", revenue: 5100000 },
];

const ORDER_DATA = [
  { name: "Elect", orders: 120 },
  { name: "Fash", orders: 200 },
  { name: "Home", orders: 150 },
  { name: "Beauty", orders: 80 },
  { name: "Sport", orders: 100 },
  { name: "Auto", orders: 40 },
  { name: "Kids", orders: 90 },
];

const RECENT_ORDERS = [
  { id: 1, customer: "John Doe", product: "iPhone 15 Pro Max", baseAmount: 1200000, date: "Oct 24" },
  { id: 2, customer: "Sarah Smith", product: "MacBook Air M2", baseAmount: 1850000, date: "Oct 24" },
  { id: 3, customer: "Michael K.", product: "Sony PlayStation 5", baseAmount: 650000, date: "Oct 23" },
  { id: 4, customer: "Amaka Ndidi", product: "Samsung 65\" TV", baseAmount: 840000, date: "Oct 23" },
  { id: 5, customer: "David Chen", product: "AirPods Pro 2", baseAmount: 250000, date: "Oct 22" },
];

// ─── MODERN TOOLTIP ───
const CustomTooltip = ({ active, payload, label, symbol }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 p-3 rounded-lg shadow-xl border border-zinc-800">
        <p className="text-zinc-500 text-[10px] font-mono mb-1 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-emerald-400 text-sm font-bold font-mono">
          {symbol}
          {payload[0].value.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  // --- CURRENCY STATE ---
  const [currency, setCurrency] = useState("NGN");
  
  // Exchange Rate Mock (1 NGN = 0.011 ZAR)
  const isNGN = currency === "NGN";
  const symbol = isNGN ? "₦" : "R";
  const exchangeRate = isNGN ? 1 : 0.011;

  // Dynamic Data Calculation
  const totalRevenue = 23500000 * exchangeRate;
  
  const displayRevenueData = useMemo(() => {
    return RAW_REVENUE_DATA.map((d) => ({
      name: d.name,
      revenue: d.revenue * exchangeRate,
    }));
  }, [exchangeRate]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* ─── HEADER ─── */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm uppercase tracking-widest text-zinc-900 font-bold font-display">
            Dashboard Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* CURRENCY SWITCHER */}
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="h-9 w-24 bg-zinc-50 border-zinc-200 text-xs font-bold text-zinc-700 shadow-sm focus:ring-zinc-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NGN">NGN (₦)</SelectItem>
              <SelectItem value="ZAR">ZAR (R)</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden md:flex items-center px-3 h-9 bg-zinc-50 border border-zinc-200 w-64 rounded-md focus-within:border-zinc-400 transition-colors">
            <Search size={14} className="text-zinc-400" />
            <input
              className="bg-transparent border-none outline-none text-xs ml-2 w-full text-zinc-900 placeholder-zinc-400 font-mono"
              placeholder="SEARCH METRICS..."
            />
          </div>
          <button className="h-9 w-9 flex items-center justify-center border border-zinc-200 bg-white rounded-md hover:bg-zinc-50 transition shadow-sm">
            <Bell size={16} className="text-zinc-500" />
          </button>
          <div className="h-9 w-9 bg-zinc-900 text-white flex items-center justify-center font-bold text-xs rounded-md shadow-sm">
            SA
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8 max-w-7xl mx-auto mt-4">
        {/* ─── 1. KEY METRICS ─── */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Users" value="12,450" icon={Users} variant="gold" />
            <StatCard label="Total Vendors" value="1,284" icon={Store} variant="cyan" />
            <StatCard label="Total Products" value="45,200" icon={ShoppingBag} variant="indigo" />
            <StatCard label="Total Orders" value="9,731" icon={ShoppingCart} variant="emerald" />
          </div>
        </section>

        {/* ─── 2. MODERN CHARTS ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CHART A: REVENUE CURVE (2/3 width) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Total Revenue
                </h3>
                <h2 className="text-3xl font-bold text-zinc-900 mt-1 font-mono tracking-tight">
                  {symbol}{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </h2>
              </div>
              <div className="flex gap-2">
                <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-400 transition">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayRevenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                    tickFormatter={(value) => {
                      if (value >= 1000000) return `${symbol}${(value / 1000000).toFixed(1)}m`;
                      if (value >= 1000) return `${symbol}${(value / 1000).toFixed(0)}k`;
                      return `${symbol}${value}`;
                    }}
                    width={60}
                  />
                  <Tooltip content={(props) => <CustomTooltip {...props} symbol={symbol} />} />

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
            </div>
          </div>

          {/* CHART B: ORDER BARS (1/3 width) */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Total Orders
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <h2 className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
                    9,240
                  </h2>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ArrowUpRight size={10} /> 8%
                  </span>
                </div>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ORDER_DATA}>
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
                    content={(props) => <CustomTooltip {...props} symbol="" />}
                    cursor={{ fill: "#f4f4f5", radius: 8 }}
                  />
                  <Bar
                    dataKey="orders"
                    fill="#18181b"
                    radius={[6, 6, 6, 6]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ─── 3. RECENT ORDERS TABLE ─── */}
        <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="p-8 pb-4 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">
              Recent Transactions
            </h3>
            <button className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors">
              View All
            </button>
          </div>

          <div className="overflow-x-auto px-8 pb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 font-mono">
                  <th className="py-4 pl-0">Order ID</th>
                  <th className="py-4">Customer</th>
                  <th className="py-4">Product</th>
                  <th className="py-4">Amount</th>
                  <th className="py-4">Status</th>
                  <th className="py-4 text-right pr-0">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-zinc-600">
                {RECENT_ORDERS.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-zinc-50/50 transition-colors border-b border-zinc-50 last:border-0 cursor-pointer group"
                  >
                    <td className="py-4 pl-0 font-mono text-zinc-900 group-hover:text-emerald-600 transition-colors">
                      #ORD-202{order.id}
                    </td>
                    <td className="py-4">{order.customer}</td>
                    <td className="py-4">{order.product}</td>
                    <td className="py-4 font-mono font-bold text-zinc-900">
                      {symbol}{(order.baseAmount * exchangeRate).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-4">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        Paid
                      </span>
                    </td>
                    <td className="py-4 pr-0 text-right font-mono text-zinc-400 text-xs">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}