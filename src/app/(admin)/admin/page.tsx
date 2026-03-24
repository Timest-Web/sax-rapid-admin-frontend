/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { StatCard } from "@/components/cards/stat-card";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
const REVENUE_DATA = [
  { name: "Mon", revenue: 1500 },
  { name: "Tue", revenue: 2300 },
  { name: "Wed", revenue: 3400 },
  { name: "Thu", revenue: 2900 },
  { name: "Fri", revenue: 4500 },
  { name: "Sat", revenue: 3800 },
  { name: "Sun", revenue: 5100 },
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

// ─── MODERN TOOLTIP ───
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-sax-black p-3 rounded-lg shadow-xl border border-zinc-800">
        <p className="text-zinc-500 text-[10px] font-mono mb-1 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sax-gold text-sm font-bold font-mono">
          {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-sax-body text-zinc-900">
      {/* ─── HEADER ─── */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-100" />
          <h1 className="text-sm uppercase tracking-wider text-zinc-900 font-semibold">
          Dashboard Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center px-3 h-9 bg-zinc-50 border border-zinc-100 w-64 rounded-md">
            <Search size={14} className="text-zinc-400" />
            <input
              className="bg-transparent border-none outline-none text-xs ml-2 w-full text-zinc-900 placeholder-zinc-400 font-mono"
              placeholder="SEARCH METRICS..."
            />
          </div>
          <button className="h-9 w-9 flex items-center justify-center border border-zinc-100 bg-white rounded-md hover:bg-zinc-50 transition">
            <Bell size={16} className="text-sax-gold" />
          </button>
          <div className="h-9 w-9 bg-sax-gold text-black flex items-center justify-center font-bold text-xs rounded-md shadow-sm">
            SA
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8 max-w-400 mx-auto">
        {/* ─── 1. KEY METRICS ─── */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <StatCard label="Total Users" value="12,450" icon={Users} variant="gold" />
            <StatCard label="Total Vendors" value="1,284" icon={Store} variant="cyan" />
            <StatCard
              label="Total Products"
              value="45,200"
              icon={ShoppingBag}
              variant="indigo"
            />
            <StatCard label="Total Orders" value="9,731" icon={ShoppingCart} variant="emerald" />
          </div>
        </section>

        {/* ─── 2. MODERN CHARTS ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CHART A: REVENUE CURVE (2/3 width) */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] border border-zinc-100/50">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Total Revenue
                </h3>
                <h2 className="text-2xl font-bold text-zinc-900 mt-1 font-mono">
                  ₦24,500,000
                </h2>
              </div>
              <div className="flex gap-2">
                <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-50 text-zinc-400 transition">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>

            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EAB308" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#EAB308" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  {/* Clean Grid */}
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
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />

                  {/* The Curve */}
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#EAB308"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHART B: ORDER BARS (1/3 width) */}
          <div className="bg-white p-8 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] border border-zinc-100/50">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Total Orders
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <h2 className="text-2xl font-bold text-zinc-900 font-mono">
                    9,240
                  </h2>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ArrowUpRight size={10} /> 8%
                  </span>
                </div>
              </div>
            </div>

            <div className="h-75 w-full">
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
                    content={<CustomTooltip />}
                    cursor={{ fill: "#f4f4f5", radius: 8 }}
                  />
                  {/* Jet Black Bars */}
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
        <div className="bg-white rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] border border-zinc-100/50 overflow-hidden">
          <div className="p-8 pb-4 flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">
              Recent Transactions
            </h3>
            <button className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-sax-gold transition-colors">
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
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr
                    key={i}
                    className="hover:bg-zinc-50/50 transition-colors border-b border-zinc-50 last:border-0 cursor-pointer group"
                  >
                    <td className="py-4 pl-0 font-mono text-zinc-900 group-hover:text-sax-gold transition-colors">
                      #ORD-202{i}
                    </td>
                    <td className="py-4">John Doe</td>
                    <td className="py-4">iPhone 15 Pro Max</td>
                    <td className="py-4 font-mono font-bold">₦1,200,000</td>
                    <td className="py-4">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        Paid
                      </span>
                    </td>
                    <td className="py-4 pr-0 text-right font-mono text-zinc-400 text-xs">
                      Oct 24
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
