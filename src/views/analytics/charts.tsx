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
import {
  RAW_REVENUE_DATA,
  RAW_ORDERS_DATA,
  RAW_VENDOR_DATA,
  CATEGORY_DATA,
} from "./data";

interface ChartProps {
  symbol?: string;
  exchangeRate?: number;
}

const COLORS = ["#18181b", "#10b981", "#3f3f46", "#a1a1aa", "#e4e4e7"];

const CustomTooltip = ({
  active,
  payload,
  label,
  symbol = "",
  isCurrency = true,
}: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 p-3 rounded-lg shadow-xl border border-zinc-800">
        <p className="text-zinc-500 text-[10px] font-mono mb-1 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-emerald-400 text-sm font-bold font-mono">
          {isCurrency ? symbol : ""}
          {payload[0].value.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: isCurrency ? 2 : 0,
          })}
          {payload[0].name === "value" && !isCurrency ? "%" : ""}
        </p>
      </div>
    );
  }
  return null;
};

const formatYAxis = (value: number, symbol: string) => {
  if (value >= 1000000) return `${symbol}${(value / 1000000).toFixed(1)}m`;
  if (value >= 1000) return `${symbol}${(value / 1000).toFixed(0)}k`;
  return `${symbol}${value}`;
};

export function RevenueTrendChart({
  symbol = "₦",
  exchangeRate = 1,
}: ChartProps) {
  const data = useMemo(
    () =>
      RAW_REVENUE_DATA.map((d) => ({
        name: d.name,
        revenue: d.revenue * exchangeRate,
      })),
    [exchangeRate],
  );

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
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
          <Tooltip
            content={(props) => (
              <CustomTooltip {...props} symbol={symbol} isCurrency={true} />
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
    </div>
  );
}

export function OrdersBarChart() {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={RAW_ORDERS_DATA}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f4f4f5"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fontFamily: "monospace", fill: "#a1a1aa" }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fontFamily: "monospace", fill: "#a1a1aa" }}
            width={40}
          />
          <Tooltip
            content={(props) => <CustomTooltip {...props} isCurrency={false} />}
            cursor={{ fill: "#f4f4f5", radius: 8 }}
          />
          <Bar
            dataKey="orders"
            fill="#18181b"
            radius={[6, 6, 6, 6]}
            barSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function VendorPerformanceBarChart({
  symbol = "₦",
  exchangeRate = 1,
}: ChartProps) {
  const data = useMemo(
    () =>
      RAW_VENDOR_DATA.map((d) => ({
        name: d.name,
        sales: d.sales * exchangeRate,
      })),
    [exchangeRate],
  );

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="#f4f4f5"
          />
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
            tick={{
              fontSize: 11,
              fill: "#71717a",
              fontWeight: 500,
              fontFamily: "monospace",
            }}
            width={100}
          />
          <Tooltip
            content={(props) => (
              <CustomTooltip {...props} symbol={symbol} isCurrency={true} />
            )}
            cursor={{ fill: "#f4f4f5", radius: 6 }}
          />
          <Bar
            dataKey="sales"
            fill="#10b981"
            radius={[0, 6, 6, 0]}
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryPieChart() {
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
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={(props) => (
                <CustomTooltip {...props} isCurrency={false} />
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4 px-4">
        {CATEGORY_DATA.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              {item.name}{" "}
              <span className="text-zinc-900 font-mono ml-1">
                {item.value}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
