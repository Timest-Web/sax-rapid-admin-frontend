/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  ArrowUpRight,
  Activity,
  ShoppingBag,
  CreditCard,
  ShoppingCart,
  Tags,
  Package,
  Store,
  Users,
  Filter,
  Download,
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
import { cn } from "@/lib/utils";

// Components
import { StatCard } from "@/components/cards/stat-card";
import {
  RevenueTrendChart,
  OrdersBarChart,
  VendorPerformanceBarChart,
  CategoryPieChart,
} from "./charts";
import {
  CATEGORY_DATA,
  CATEGORY_VENDORS,
  RAW_VENDOR_DATA,
  RECENT_ORDERS,
  MOCK_STOCK,
} from "./data";

function TabTrigger({ value, label, hasPulse = false }: { value: string; label: string; hasPulse?: boolean }) {
  return (
    <TabsTrigger
      value={value}
      className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500 data-[state=active]:bg-zinc-900 data-[state=active]:text-[#D4AF37] transition-all hover:text-zinc-900 data-[state=active]:hover:text-[#D4AF37] flex items-center gap-2"
    >
      {label}
      {hasPulse && <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />}
    </TabsTrigger>
  );
}

export default function AnalyticsView() {
  const [timeRange, setTimeRange] = useState("30d");

  // Date Range state for the calendar
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  const [selectedCategory, setSelectedCategory] = useState("All");
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

  const displayedCategoryVendors = useMemo(() => {
    if (selectedCategory === "All") {
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
                <SelectTrigger className="w-50 h-10 bg-zinc-50 border-zinc-200 rounded-xl font-mono text-xs">
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
                    <Button
                      variant="outline"
                      className={cn(
                        "h-8 px-4 rounded-xl border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 text-xs",
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
                  <PopoverContent
                    className="w-auto p-0 rounded-2xl overflow-hidden border-zinc-200 shadow-xl"
                    align="start"
                  >
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={(newDate) => setDate(newDate)} // Fixed Range Selection
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>

        {/* ─── STAT CARDS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Overview (Visits)"
            value="15,723"
            icon={Activity}
            variant="default"
          />
          <StatCard
            label="Products"
            value="45,200"
            icon={ShoppingBag}
            variant="indigo"
          />
          <StatCard
            label="Revenue"
            value={formatMoney(baseRevenue)}
            icon={CreditCard}
            variant="emerald"
          />
          <StatCard
            label="Orders"
            value="9,731"
            icon={ShoppingCart}
            variant="cyan"
          />
          <StatCard label="Categories" value="12" icon={Tags} variant="gold" />
          <StatCard
            label="Stock Lvl"
            value="124k"
            icon={Package}
            variant="violet"
          />
          <StatCard label="Vendors" value="1,284" icon={Store} variant="rose" />
          <StatCard
            label="Customers"
            value="38,910"
            icon={Users}
            variant="amber"
          />
        </div>

        {/* ─── TABS ─── */}
        <Tabs defaultValue="overview" className="w-full flex flex-col mt-4">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-zinc-200/50 p-1 h-12 rounded-full inline-flex gap-1 overflow-x-auto whitespace-nowrap">
              <TabTrigger value="overview" label="Overview"/>
              <TabTrigger value="products" label="Products"/>
              <TabTrigger value="revenue" label="Revenue"/>
              <TabTrigger value="orders" label="Orders"/>
              <TabTrigger value="categories" label="Categories"/>
              <TabTrigger value="vendors" label="Vendors"/>
              <TabTrigger value="stock" label="Stock"/>
            </TabsList>
          </div>

          <TabsContent
            value="overview"
            className="m-0 space-y-6 animate-in fade-in"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Revenue Trend (All)
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <h2 className="text-3xl font-bold text-zinc-900 font-mono">
                    {formatMoney(baseRevenue)}
                  </h2>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ArrowUpRight size={10} /> 12%
                  </span>
                </div>
                <RevenueTrendChart symbol={symbol} exchangeRate={rate} />
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Category Split
                </h3>
                <CategoryPieChart />
              </div>
            </div>
          </TabsContent>

          {/* TAB: REVENUE */}
          <TabsContent
            value="revenue"
            className="m-0 animate-in fade-in duration-500"
          >
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
          <TabsContent
            value="orders"
            className="m-0 space-y-6 animate-in fade-in duration-500"
          >
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
          <TabsContent
            value="categories"
            className="m-0 space-y-6 animate-in fade-in duration-500"
          >
            {/* Filter Section */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-zinc-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-2">
                Filter by Category:
              </span>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[200px] h-10 bg-zinc-50 border-zinc-200 rounded-xl font-mono text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {CATEGORY_DATA.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.name}
                    </SelectItem>
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
                    Top Vendors in{" "}
                    <span className="text-emerald-600">{selectedCategory}</span>
                  </h3>
                </div>
                <div className="overflow-x-auto px-8 pb-8">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 font-mono">
                        <th className="py-4 pl-0">Vendor Name</th>
                        <th className="py-4">Items Sold</th>
                        <th className="py-4 text-right pr-0">
                          Revenue Generated
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium text-zinc-600">
                      {displayedCategoryVendors.length > 0 ? (
                        displayedCategoryVendors.map((vendor, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-zinc-50/50 transition-colors border-b border-zinc-50 last:border-0 cursor-pointer group"
                          >
                            <td className="py-4 pl-0 font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">
                              {vendor.name}
                            </td>
                            <td className="py-4 font-mono">
                              {vendor.itemsSold.toLocaleString()}
                            </td>
                            <td className="py-4 pr-0 text-right font-mono font-bold text-zinc-900">
                              {formatMoney(vendor.revenue)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="py-8 text-center text-zinc-400 font-mono text-xs uppercase tracking-widest"
                          >
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
          <TabsContent
            value="vendors"
            className="m-0 space-y-6 animate-in fade-in duration-500"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                      Vendor Revenue Chart
                    </h3>
                  </div>
                </div>
                <VendorPerformanceBarChart
                  symbol={symbol}
                  exchangeRate={rate}
                />
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
                        <tr
                          key={idx}
                          className="hover:bg-zinc-50/50 transition-colors border-b border-zinc-50 last:border-0 cursor-pointer group"
                        >
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
          <TabsContent
            value="stock"
            className="m-0 animate-in fade-in duration-500"
          >
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">
                  Inventory Status
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs font-bold uppercase tracking-wider rounded-xl"
                >
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
                      <tr
                        key={item.id}
                        className="hover:bg-zinc-50/50 transition-colors border-b border-zinc-50 last:border-0 cursor-pointer group"
                      >
                        <td className="py-4 pl-0 text-zinc-900 group-hover:text-emerald-600 transition-colors">
                          {item.name}
                        </td>
                        <td className="py-4 font-mono text-zinc-500">
                          {item.sku}
                        </td>
                        <td className="py-4">
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                              item.status === "In stock"
                                ? "bg-emerald-50 text-emerald-700"
                                : item.status === "Low stock"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-red-50 text-red-700",
                            )}
                          >
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
          <TabsContent
            value="products"
            className="m-0 animate-in fade-in duration-500"
          >
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
                    <tr
                      key={item.id}
                      className="hover:bg-zinc-50/50 transition-colors border-b border-zinc-50 last:border-0 cursor-pointer group"
                    >
                      <td className="py-4 pl-0 text-zinc-900 group-hover:text-emerald-600 transition-colors font-bold">
                        {item.name}
                      </td>
                      <td className="py-4 font-mono text-zinc-500">
                        {item.sku}
                      </td>
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
