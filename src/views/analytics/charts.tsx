/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- TYPES ---
interface ChartProps {
  symbol?: string;
  exchangeRate?: number;
}

// --- DUMMY DATA (Base NGN) ---
const RAW_SALES_DATA = [
  { name: "Mon", value: 1200000 },
  { name: "Tue", value: 1800000 },
  { name: "Wed", value: 1400000 },
  { name: "Thu", value: 2200000 },
  { name: "Fri", value: 2800000 },
  { name: "Sat", value: 3500000 },
  { name: "Sun", value: 3100000 },
];

const RAW_VENDOR_DATA = [
  { name: "TechHub", sales: 4500000 },
  { name: "StyleCo", sales: 3200000 },
  { name: "HomeLux", sales: 2800000 },
  { name: "GameStop", sales: 1900000 },
  { name: "SneakerX", sales: 1500000 },
];

const CATEGORY_DATA = [
  { name: "Electronics", value: 45 },
  { name: "Fashion", value: 25 },
  { name: "Home", value: 15 },
  { name: "Beauty", value: 10 },
  { name: "Other", value: 5 },
];
const COLORS = ["#18181b", "#4f46e5", "#10b981", "#eab308", "#a1a1aa"];

// --- HELPERS ---
const formatYAxis = (value: number, symbol: string) => {
  if (value >= 1000000) return `${symbol}${(value / 1000000).toFixed(1)}m`;
  if (value >= 1000) return `${symbol}${(value / 1000).toFixed(0)}k`;
  return `${symbol}${value}`;
};

const CustomTooltip = ({ active, payload, label, symbol }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-xl border border-zinc-200">
        <p className="text-zinc-500 text-[10px] font-mono mb-1 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-zinc-900 text-sm font-bold font-mono">
          {symbol}
          {payload[0].value.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}
        </p>
      </div>
    );
  }
  return null;
};

// ==========================================
// 1. SALES TREND CHART (Area)
// ==========================================
export function SalesTrendChart({ symbol = "₦", exchangeRate = 1 }: ChartProps) {
  // Apply exchange rate to data
  const data = useMemo(() => {
    return RAW_SALES_DATA.map((d) => ({
      name: d.name,
      value: d.value * exchangeRate,
    }));
  }, [exchangeRate]);

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#18181b" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fontFamily: "monospace", fill: "#a1a1aa" }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fontFamily: "monospace", fill: "#a1a1aa" }}
            tickFormatter={(val) => formatYAxis(val, symbol)}
            width={60}
          />
          <Tooltip content={(props) => <CustomTooltip {...props} symbol={symbol} />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#18181b"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorSales)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ==========================================
// 2. VENDOR PERFORMANCE CHART (Bar)
// ==========================================
export function VendorPerformanceBarChart({ symbol = "₦", exchangeRate = 1 }: ChartProps) {
  // Apply exchange rate to data
  const data = useMemo(() => {
    return RAW_VENDOR_DATA.map((d) => ({
      name: d.name,
      sales: d.sales * exchangeRate,
    }));
  }, [exchangeRate]);

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f4f4f5" />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fontFamily: "monospace", fill: "#a1a1aa" }}
            tickFormatter={(val) => formatYAxis(val, symbol)}
          />
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#71717a", fontWeight: 500 }}
            width={80}
          />
          <Tooltip
            content={(props) => <CustomTooltip {...props} symbol={symbol} />}
            cursor={{ fill: "#f4f4f5" }}
          />
          <Bar dataKey="sales" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ==========================================
// 3. CATEGORY PIE CHART
// ==========================================
export function CategoryPieChart() {
  // Pie chart typically shows percentages, so no currency conversion needed here
  return (
    <div className="h-[300px] w-full flex flex-col mt-4">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={CATEGORY_DATA}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {CATEGORY_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 rounded-lg shadow-xl border border-zinc-200">
                      <p className="text-zinc-500 text-[10px] font-mono mb-1 uppercase tracking-wider">
                        {payload[0].name}
                      </p>
                      <p className="text-zinc-900 text-sm font-bold font-mono">
                        {payload[0].value}% of Sales
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4 px-4">
        {CATEGORY_DATA.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-[11px] text-zinc-600 font-medium">
              {item.name} <span className="text-zinc-400">({item.value}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}