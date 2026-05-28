/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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

type RevenuePoint = { name: string; revenue: number };
type OrdersPoint = { name: string; orders: number };

const CustomTooltip = ({
  active,
  payload,
  label,
  symbol = "",
  isCurrency = true,
}: any) => {
  if (!active || !payload?.length) return null;

  const value = payload[0]?.value ?? 0;

  return (
    <div className="bg-zinc-900 p-3 rounded-lg shadow-xl border border-zinc-800">
      <p className="text-zinc-500 text-[10px] font-mono mb-1 uppercase tracking-wider">
        {label}
      </p>

      <p className="text-emerald-400 text-sm font-bold font-mono">
        {isCurrency ? symbol : ""}
        {Number(value).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: isCurrency ? 2 : 0,
        })}
      </p>
    </div>
  );
};

const formatYAxisCurrency = (value: number, symbol: string) => {
  const v = Number(value ?? 0);
  if (v >= 1_000_000) return `${symbol}${(v / 1_000_000).toFixed(1)}m`;
  if (v >= 1_000) return `${symbol}${(v / 1_000).toFixed(0)}k`;
  return `${symbol}${v}`;
};

export function RevenueTrendChart({
  symbol = "₦",
  data,
}: {
  symbol?: string;
  data: RevenuePoint[];
}) {
  return (
    <div className="h-75 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
            tickFormatter={(val) => formatYAxisCurrency(val, symbol)}
            width={60}
          />

          <Tooltip content={(props) => <CustomTooltip {...props} symbol={symbol} isCurrency />} />

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

export function OrdersBarChart({ data }: { data: OrdersPoint[] }) {
  return (
    <div className="h-75 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />

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