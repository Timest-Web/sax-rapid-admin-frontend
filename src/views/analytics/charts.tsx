"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// --- SALES TREND DATA ---
const SALES_DATA = [
  { name: "Mon", revenue: 4000, orders: 240 },
  { name: "Tue", revenue: 3000, orders: 139 },
  { name: "Wed", revenue: 2000, orders: 980 },
  { name: "Thu", revenue: 2780, orders: 390 },
  { name: "Fri", revenue: 1890, orders: 480 },
  { name: "Sat", revenue: 2390, orders: 380 },
  { name: "Sun", revenue: 3490, orders: 430 },
];

// --- CATEGORY DATA ---
const CATEGORY_DATA = [
  { name: "Electronics", value: 400, color: "#4F46E5" }, // Indigo
  { name: "Fashion", value: 300, color: "#EC4899" }, // Pink
  { name: "Home", value: 300, color: "#F59E0B" }, // Amber
  { name: "Beauty", value: 200, color: "#10B981" }, // Emerald
];

export function SalesTrendChart() {
  return (
    <div className="h-75 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={SALES_DATA}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₦${value}`}
          />
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
            itemStyle={{ color: "#fff" }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#4F46E5"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryPieChart() {
  return (
    <div className="h-75 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={CATEGORY_DATA}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {CATEGORY_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center gap-4 flex-wrap">
        {CATEGORY_DATA.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-zinc-500">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- VENDOR PERFORMANCE DATA ---
const VENDOR_DATA = [
  { name: "Tech Haven", sales: 120 },
  { name: "Style Loft", sales: 98 },
  { name: "Fresh Mart", sales: 86 },
  { name: "Burger King", sales: 54 },
  { name: "Urban Sole", sales: 45 },
];

export function VendorPerformanceBarChart() {
  return (
    <div className="h-75 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={VENDOR_DATA}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            width={100}
            tick={{ fontSize: 12, fill: "#4B5563" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            contentStyle={{ borderRadius: "8px" }}
          />
          <Bar
            dataKey="sales"
            fill="#10B981"
            radius={[0, 4, 4, 0]}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
