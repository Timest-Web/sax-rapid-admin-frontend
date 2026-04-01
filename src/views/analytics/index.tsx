/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Download,
  Calendar as CalendarIcon,
  MoreHorizontal,
  ArrowUpRight,
  Activity,
  ShoppingBag,
  CreditCard,
  ShoppingCart,
  Tags,
  Package,
  Store,
  Users,
  LucideIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";

// ==========================================
// USER PROVIDED STAT CARD
// ==========================================
const variants = {
  default: {
    gradient: "from-slate-50 via-zinc-50 to-stone-100",
    border: "border-zinc-200 hover:border-zinc-300",
    iconBg: "bg-zinc-100 border-zinc-200/60",
    iconColor: "text-zinc-600",
  },
  gold: {
    gradient: "from-yellow-50 via-amber-50 to-orange-100",
    border: "border-amber-200/60 hover:border-amber-300/80",
    iconBg: "bg-amber-100 border-amber-200/60",
    iconColor: "text-amber-600",
  },
  indigo: {
    gradient: "from-slate-50 via-blue-50 to-indigo-100",
    border: "border-indigo-200/60 hover:border-indigo-300/80",
    iconBg: "bg-indigo-100 border-indigo-200/60",
    iconColor: "text-indigo-600",
  },
  emerald: {
    gradient: "from-green-50 via-emerald-50 to-teal-100",
    border: "border-emerald-200/60 hover:border-emerald-300/80",
    iconBg: "bg-emerald-100 border-emerald-200/60",
    iconColor: "text-emerald-600",
  },
  amber: {
    gradient: "from-orange-50 via-amber-50 to-yellow-100",
    border: "border-amber-200/60 hover:border-amber-300/80",
    iconBg: "bg-amber-100 border-amber-200/60",
    iconColor: "text-amber-700",
  },
  rose: {
    gradient: "from-red-50 via-rose-50 to-pink-100",
    border: "border-rose-200/60 hover:border-rose-300/80",
    iconBg: "bg-rose-100 border-rose-200/60",
    iconColor: "text-rose-600",
  },
  violet: {
    gradient: "from-violet-50 via-purple-50 to-fuchsia-100",
    border: "border-violet-200/60 hover:border-violet-300/80",
    iconBg: "bg-violet-100 border-violet-200/60",
    iconColor: "text-violet-600",
  },
  cyan: {
    gradient: "from-cyan-50 via-sky-50 to-blue-100",
    border: "border-sky-200/60 hover:border-sky-300/80",
    iconBg: "bg-sky-100 border-sky-200/60",
    iconColor: "text-sky-600",
  },
} as const;

type StatCardVariant = keyof typeof variants;

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color?: string;
  variant?: StatCardVariant;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color,
  variant = "default",
}: StatCardProps) {
  const theme = variants[variant];

  return (
    <div
      className={`bg-gradient-to-br ${theme.gradient} border ${theme.border} p-6 rounded-xl flex items-center justify-between hover:shadow-md transition-all duration-200`}
    >
      {/* Left Side: Label & Value */}
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 font-mono">
          {label}
        </h3>
        <p
          className={`${color ?? theme.iconColor} text-2xl font-bold tracking-tight mt-1 font-mono`}
        >
          {value}
        </p>
      </div>

      {/* Right Side: Icon Box */}
      <div
        className={`h-10 w-10 rounded-lg ${theme.iconBg} border flex items-center justify-center ${theme.iconColor}`}
      >
        <Icon size={20} />
      </div>
    </div>
  );
}

// ==========================================
// DATA & CONSTANTS
// ==========================================
interface ChartProps {
  symbol?: string;
  exchangeRate?: number;
}

// Base Data in NGN (Naira)
const RAW_REVENUE_DATA = [
  { name: "Mon", revenue: 4500000 },
  { name: "Tue", revenue: 5200000 },
  { name: "Wed", revenue: 4800000 },
  { name: "Thu", revenue: 7100000 },
  { name: "Fri", revenue: 8500000 },
  { name: "Sat", revenue: 11200000 },
  { name: "Sun", revenue: 9800000 },
];

const RAW_ORDERS_DATA = [
  { name: "Mon", orders: 120 },
  { name: "Tue", orders: 200 },
  { name: "Wed", orders: 150 },
  { name: "Thu", orders: 280 },
  { name: "Fri", orders: 320 },
  { name: "Sat", orders: 410 },
  { name: "Sun", orders: 390 },
];

const RAW_VENDOR_DATA = [
  { name: "TechGadgets", sales: 18500000, products: 120, rating: 4.8 },
  { name: "UrbanWear", sales: 12200000, products: 340, rating: 4.5 },
  { name: "SneakerVault", sales: 8800000, products: 85, rating: 4.9 },
  { name: "AudioPro", sales: 6900000, products: 45, rating: 4.7 },
  { name: "HomeAesthetics", sales: 4700000, products: 210, rating: 4.2 },
];

const CATEGORY_DATA = [
  { name: "Electronics", value: 42 },
  { name: "Apparel", value: 28 },
  { name: "Footwear", value: 18 },
  { name: "Accessories", value: 8 },
  { name: "Home Goods", value: 4 },
];
const COLORS = ["#18181b", "#10b981", "#3f3f46", "#a1a1aa", "#e4e4e7"];

const CATEGORY_VENDORS: Record<string, { name: string; itemsSold: number; revenue: number }[]> = {
  All: [], // Handled dynamically
  Electronics: [
    { name: "TechGadgets", itemsSold: 4200, revenue: 18500000 },
    { name: "AudioPro", itemsSold: 1150, revenue: 6900000 },
    { name: "ElectroWorld", itemsSold: 890, revenue: 3200000 },
  ],
  Apparel: [
    { name: "UrbanWear", itemsSold: 5600, revenue: 12200000 },
    { name: "ChicStyle", itemsSold: 3200, revenue: 4500000 },
  ],
  Footwear: [
    { name: "SneakerVault", itemsSold: 2100, revenue: 8800000 },
    { name: "SoleMates", itemsSold: 950, revenue: 3100000 },
  ],
  Accessories: [
    { name: "WristCandy", itemsSold: 1400, revenue: 2100000 },
    { name: "BagItUp", itemsSold: 800, revenue: 1500000 },
  ],
  "Home Goods": [
    { name: "HomeAesthetics", itemsSold: 1800, revenue: 4700000 },
    { name: "CozySpaces", itemsSold: 650, revenue: 1200000 },
  ],
};

const RECENT_ORDERS = [
  { id: 1, customer: "John Doe", product: "iPhone 15 Pro Max", baseAmount: 1200000, date: "Oct 24" },
  { id: 2, customer: "Sarah Smith", product: "MacBook Air M2", baseAmount: 1850000, date: "Oct 24" },
  { id: 3, customer: "Michael K.", product: "Sony PlayStation 5", baseAmount: 650000, date: "Oct 23" },
  { id: 4, customer: "Amaka Ndidi", product: "Samsung 65\" TV", baseAmount: 840000, date: "Oct 23" },
  { id: 5, customer: "David Chen", product: "AirPods Pro 2", baseAmount: 250000, date: "Oct 22" },
];

const MOCK_STOCK = [
  { id: 1, name: "MacBook Pro 16\" M3 Max", sku: "MAC-16-M3", status: "In stock", stock: "24" },
  { id: 2, name: "Men's Heavyweight Oversized Tee", sku: "APP-TS-092", status: "Low stock", stock: "5" },
  { id: 3, name: "Sony WH-1000XM5 Headphones", sku: "AUD-SNY-XM5", status: "In stock", stock: "42" },
  { id: 4, name: "Nike Air Jordan 4 Retro", sku: "FTW-NK-AJ4", status: "Out of stock", stock: "0" },
  { id: 5, name: "Samsung Galaxy S24 Ultra", sku: "MOB-SAM-S24U", status: "In stock", stock: "18" },
  { id: 6, name: "Women's High-Waisted Cargo", sku: "APP-CP-014", status: "In stock", stock: "56" },
];

// ==========================================
// MODERN TOOLTIP & HELPERS
// ==========================================
const CustomTooltip = ({ active, payload, label, symbol = "", isCurrency = true }: any) => {
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

// ==========================================
// CHARTS
// ==========================================
export function RevenueTrendChart({ symbol = "₦", exchangeRate = 1 }: ChartProps) {
  const data = useMemo(() => {
    return RAW_REVENUE_DATA.map((d) => ({
      name: d.name,
      revenue: d.revenue * exchangeRate,
    }));
  }, [exchangeRate]);

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
          <Tooltip content={(props) => <CustomTooltip {...props} symbol={symbol} isCurrency={true} />} />
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
          <Bar dataKey="orders" fill="#18181b" radius={[6, 6, 6, 6]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function VendorPerformanceBarChart({ symbol = "₦", exchangeRate = 1 }: ChartProps) {
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
            tick={{ fontSize: 11, fill: "#71717a", fontWeight: 500, fontFamily: "monospace" }}
            width={100}
          />
          <Tooltip
            content={(props) => <CustomTooltip {...props} symbol={symbol} isCurrency={true} />}
            cursor={{ fill: "#f4f4f5", radius: 6 }}
          />
          <Bar dataKey="sales" fill="#10b981" radius={[0, 6, 6, 0]} barSize={24} />
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
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={(props) => <CustomTooltip {...props} isCurrency={false} />} />
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
              {item.name} <span className="text-zinc-900 font-mono ml-1">{item.value}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// TABS HELPER
// ==========================================
function TabTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <TabsTrigger
      value={value}
      className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500 data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all hover:text-zinc-900 data-[state=active]:hover:text-white"
    >
      {children}
    </TabsTrigger>
  );
}

// ==========================================
// MAIN VIEW
// ==========================================
export default function AnalyticsView() {
  const [timeRange, setTimeRange] = useState("30d");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  
  // Category Filter State
  const [selectedCategory, setSelectedCategory] = useState("All");

  // --- CURRENCY STATE ---
  const [currency, setCurrency] = useState("NGN");
  const symbol = currency === "NGN" ? "₦" : "R";
  const rate = currency === "NGN" ? 1 : 0.011; 

  const baseRevenue = 51100000;

  const formatMoney = (val: number) => {
    return `${symbol}${(val * rate).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  // Derive vendors based on selected category filter
  const displayedCategoryVendors = useMemo(() => {
    if (selectedCategory === "All") {
      // Flatten all categories
      return Object.values(CATEGORY_VENDORS)
        .flat()
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 6);
    }
    return CATEGORY_VENDORS[selectedCategory] || [];
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* ─── HEADER ─── */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm uppercase tracking-widest text-zinc-900 font-bold font-display">
            Analytics & Reports
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="h-9 w-28 bg-zinc-50 border-zinc-200 text-xs font-bold text-zinc-700 shadow-sm focus:ring-zinc-900 rounded-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NGN">NGN (₦)</SelectItem>
              <SelectItem value="ZAR">ZAR (R)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-8 mt-2">
        
        {/* ─── CONTROLS & DATE RANGE ─── */}
        <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-zinc-200">
          <div className="flex items-center gap-4 px-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Analysis Period:
            </span>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[200px] h-10 bg-zinc-50 border-zinc-200 rounded-xl font-mono text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Month to Date</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              {timeRange === "custom" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-10 w-10 p-0 rounded-xl border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-600">
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
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

        {/* ─── EXACT STAT CARDS IN 2x4 GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Overview (Visits)" value="15,723" icon={Activity} variant="default" />
          <StatCard label="Products" value="45,200" icon={ShoppingBag} variant="indigo" />
          <StatCard label="Revenue" value={formatMoney(baseRevenue)} icon={CreditCard} variant="emerald" />
          <StatCard label="Orders" value="9,731" icon={ShoppingCart} variant="cyan" />
          
          <StatCard label="Categories" value="12" icon={Tags} variant="gold" />
          <StatCard label="Stock Lvl" value="124k" icon={Package} variant="violet" />
          <StatCard label="Vendors" value="1,284" icon={Store} variant="rose" />
          <StatCard label="Customers" value="38,910" icon={Users} variant="amber" />
        </div>

        {/* ─── TABS ─── */}
        <Tabs defaultValue="overview" className="w-full flex flex-col mt-4">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-zinc-200/50 p-1 h-12 rounded-full inline-flex gap-1 overflow-x-auto whitespace-nowrap">
              <TabTrigger value="overview">Overview</TabTrigger>
              <TabTrigger value="products">Products</TabTrigger>
              <TabTrigger value="revenue">Revenue</TabTrigger>
              <TabTrigger value="orders">Orders</TabTrigger>
              <TabTrigger value="categories">Categories</TabTrigger>
              <TabTrigger value="vendors">Vendors</TabTrigger>
              <TabTrigger value="stock">Stock</TabTrigger>
            </TabsList>
          </div>

          {/* TAB: OVERVIEW */}
          <TabsContent value="overview" className="m-0 space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                      Revenue Trend (All)
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <h2 className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
                        {formatMoney(baseRevenue)}
                      </h2>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ArrowUpRight size={10} /> 12%
                      </span>
                    </div>
                  </div>
                </div>
                <RevenueTrendChart symbol={symbol} exchangeRate={rate} />
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                      Category Split
                    </h3>
                  </div>
                </div>
                <CategoryPieChart />
              </div>
            </div>
          </TabsContent>

          {/* TAB: REVENUE */}
          <TabsContent value="revenue" className="m-0 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    Detailed Revenue Analysis
                  </h3>
                  <h2 className="text-3xl font-bold text-zinc-900 font-mono tracking-tight mt-1">
                    {formatMoney(baseRevenue)}
                  </h2>
                </div>
              </div>
              <RevenueTrendChart symbol={symbol} exchangeRate={rate} />
            </div>
          </TabsContent>

          {/* TAB: ORDERS */}
          <TabsContent value="orders" className="m-0 space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                      Order Volume
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <h2 className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
                        9,731
                      </h2>
                    </div>
                  </div>
                </div>
                <OrdersBarChart />
              </div>

              <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
                <div className="p-8 pb-4 flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">
                    Recent Orders
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
                        <th className="py-4 text-right pr-0">Date</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium text-zinc-600">
                      {RECENT_ORDERS.map((order) => (
                        <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors border-b border-zinc-50 last:border-0 cursor-pointer group">
                          <td className="py-4 pl-0 font-mono text-zinc-900 group-hover:text-emerald-600 transition-colors">
                            #ORD-202{order.id}
                          </td>
                          <td className="py-4">{order.customer}</td>
                          <td className="py-4">{order.product}</td>
                          <td className="py-4 font-mono font-bold text-zinc-900">
                            {formatMoney(order.baseAmount)}
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
            </div>
          </TabsContent>

          {/* TAB: CATEGORIES */}
          <TabsContent value="categories" className="m-0 space-y-6 animate-in fade-in duration-500">
            {/* Filter Section */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-zinc-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-2">
                Filter by Category:
              </span>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px] h-10 bg-zinc-50 border-zinc-200 rounded-xl font-mono text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {CATEGORY_DATA.map((c) => (
                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                      Overall Split
                    </h3>
                  </div>
                </div>
                <CategoryPieChart />
              </div>

              <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
                <div className="p-8 pb-4 flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">
                    Top Vendors in <span className="text-emerald-600">{selectedCategory}</span>
                  </h3>
                </div>
                <div className="overflow-x-auto px-8 pb-8">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 font-mono">
                        <th className="py-4 pl-0">Vendor Name</th>
                        <th className="py-4">Items Sold</th>
                        <th className="py-4 text-right pr-0">Revenue Generated</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium text-zinc-600">
                      {displayedCategoryVendors.length > 0 ? displayedCategoryVendors.map((vendor, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50/50 transition-colors border-b border-zinc-50 last:border-0 cursor-pointer group">
                          <td className="py-4 pl-0 font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                            {vendor.name}
                          </td>
                          <td className="py-4 font-mono">{vendor.itemsSold.toLocaleString()}</td>
                          <td className="py-4 pr-0 text-right font-mono font-bold text-zinc-900">
                            {formatMoney(vendor.revenue)}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={3} className="py-8 text-center text-zinc-400 font-mono text-xs uppercase tracking-widest">
                            No Vendors Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB: VENDORS */}
          <TabsContent value="vendors" className="m-0 space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                      Vendor Revenue Chart
                    </h3>
                  </div>
                </div>
                <VendorPerformanceBarChart symbol={symbol} exchangeRate={rate} />
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden flex flex-col">
                <div className="p-8 pb-4 flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">
                    Vendor List
                  </h3>
                </div>
                <div className="overflow-x-auto px-8 pb-8 flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 font-mono">
                        <th className="py-4 pl-0">Vendor</th>
                        <th className="py-4">Products</th>
                        <th className="py-4">Rating</th>
                        <th className="py-4 text-right pr-0">Total Rev</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium text-zinc-600">
                      {RAW_VENDOR_DATA.map((vendor, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50/50 transition-colors border-b border-zinc-50 last:border-0 cursor-pointer group">
                          <td className="py-4 pl-0 font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                            {vendor.name}
                          </td>
                          <td className="py-4 font-mono">{vendor.products}</td>
                          <td className="py-4">
                            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-bold">
                              ★ {vendor.rating}
                            </span>
                          </td>
                          <td className="py-4 pr-0 text-right font-mono font-bold text-zinc-900">
                            {formatMoney(vendor.sales)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB: STOCK & PRODUCTS */}
          <TabsContent value="stock" className="m-0 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">
                  Inventory Status
                </h3>
                <Button variant="outline" size="sm" className="h-9 text-xs font-bold uppercase tracking-wider rounded-xl">
                  <Download className="mr-2 h-3.5 w-3.5" /> Export CSV
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 font-mono">
                      <th className="py-4 pl-0">Product Name</th>
                      <th className="py-4">SKU</th>
                      <th className="py-4">Status</th>
                      <th className="py-4 text-right pr-0">Stock Lvl</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-medium text-zinc-600">
                    {MOCK_STOCK.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors border-b border-zinc-50 last:border-0 cursor-pointer group">
                        <td className="py-4 pl-0 text-zinc-900 group-hover:text-emerald-600 transition-colors">
                          {item.name}
                        </td>
                        <td className="py-4 font-mono text-zinc-500">{item.sku}</td>
                        <td className="py-4">
                          <span className={cn(
                            "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                            item.status === "In stock" ? "bg-emerald-50 text-emerald-700" :
                            item.status === "Low stock" ? "bg-amber-50 text-amber-700" :
                            "bg-red-50 text-red-700"
                          )}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 pr-0 text-right font-mono font-bold text-zinc-900">
                          {item.stock}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* TAB: PRODUCTS (Mirrors stock for now, to fulfill request) */}
          <TabsContent value="products" className="m-0 animate-in fade-in duration-500">
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
               <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-6">
                 Top Performing Products
               </h3>
               {/* Reusing stock data structure as product list for demonstration */}
               <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 font-mono">
                      <th className="py-4 pl-0">Product Name</th>
                      <th className="py-4">SKU</th>
                      <th className="py-4 text-right pr-0">Units Sold</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-medium text-zinc-600">
                    {MOCK_STOCK.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors border-b border-zinc-50 last:border-0 cursor-pointer group">
                        <td className="py-4 pl-0 text-zinc-900 group-hover:text-emerald-600 transition-colors font-bold">
                          {item.name}
                        </td>
                        <td className="py-4 font-mono text-zinc-500">{item.sku}</td>
                        <td className="py-4 pr-0 text-right font-mono font-bold text-zinc-900">
                          {Math.floor(Math.random() * 500) + 100}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}