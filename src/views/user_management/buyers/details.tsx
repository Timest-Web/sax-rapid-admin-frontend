"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { StatusBadge } from "@/components/cards/status-badge";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  MapPin,
  Calendar,
  Wallet,
  ArrowLeft,
  ShoppingCart,
  TrendingUp,
  Save,
  Key,
  Filter,
  CalendarIcon,
  Download,
} from "lucide-react";

import { BUYERS } from "@/src/lib/dummy_data";
import {
  CreditWalletModal,
  ResetPasswordModal,
  SuspendUserModal,
} from "@/components/buyers/buyers-action";
import { InfoRow } from "@/components/buyers/buyers-helper";
import MetricCard from "@/components/cards/metric-card";
import { cn } from "@/lib/utils";
import {
  orderColumns,
  activityColumns,
  ActivityLog,
  Order,
} from "./details_column";

// --- MOCK DATA ---
const MOCK_ACTIVITY_LOG: ActivityLog[] = [
  {
    id: "1",
    action: "Password Reset",
    ipLocation: "123.456.281.34 / Lagos, NG",
    browser: "Firefox on Windows",
    timestamp: "2 hrs ago",
  },
  {
    id: "2",
    action: "Profile Updated",
    ipLocation: "123.456.281.34 / Lagos, NG",
    browser: "Firefox on Windows",
    timestamp: "1 day ago",
  },
  {
    id: "3",
    action: "Successful Login",
    ipLocation: "192.168.100.12 / Abuja, NG",
    browser: "Chrome on macOS",
    timestamp: "3 days ago",
  },
];

const MOCK_BUYER_ORDERS: Order[] = [
  {
    id: "1003163",
    date: "March 30, 2026",
    items: 3,
    total: "₦12,500",
    status: "Processing",
  },
  {
    id: "1003162",
    date: "March 28, 2026",
    items: 1,
    total: "₦4,200",
    status: "Shipped",
  },
  {
    id: "1003161",
    date: "March 25, 2026",
    items: 5,
    total: "₦45,000",
    status: "Delivered",
  },
  {
    id: "1003160",
    date: "March 20, 2026",
    items: 2,
    total: "₦8,900",
    status: "Failed",
  },
  {
    id: "1003159",
    date: "March 15, 2026",
    items: 1,
    total: "₦15,000",
    status: "On-Hold",
  },
  {
    id: "1003158",
    date: "March 10, 2026",
    items: 4,
    total: "₦22,000",
    status: "Delivered",
  },
];

function TabTrigger({
  value,
  label,
  hasPulse = false,
}: {
  value: string;
  label: string;
  hasPulse?: boolean;
}) {
  return (
    <TabsTrigger
      value={value}
      className="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500 data-[state=active]:bg-zinc-900 data-[state=active]:text-[#D4AF37] transition-all hover:text-zinc-900 data-[state=active]:hover:text-[#D4AF37] flex items-center gap-2"
    >
      {label}
      {hasPulse && (
        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
      )}
    </TabsTrigger>
  );
}
export default function BuyerDetailsView() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId || "";

  const buyerId = decodeURIComponent(id);
  const buyer = BUYERS.find((b) => b.id === buyerId) || BUYERS[0];

  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderDateRange, setOrderDateRange] = useState<DateRange | undefined>();

  const filteredOrders = MOCK_BUYER_ORDERS.filter((order) => {
    const matchesStatus =
      orderStatusFilter === "all" || order.status === orderStatusFilter;
    return matchesStatus;
  });

  if (!buyer && id) return notFound();
  if (!buyer) return null;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-10">
      {/* ─── STICKY HEADER ─── */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <Link
              href="/admin/buyers"
              className="hover:text-zinc-900 transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={14} /> BUYERS
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-mono">{buyer.id}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <ResetPasswordModal />
          <SuspendUserModal />
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="p-6 max-w-7xl mx-auto space-y-8">
        {/* ─── CARDS ROW ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200" />
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-full bg-zinc-900 flex items-center justify-center text-2xl font-bold text-[#D4AF37] border-4 border-zinc-50 shrink-0 shadow-sm">
                {buyer.avatar}
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 font-display">
                  {buyer.name}
                </h2>
                <p className="text-xs text-zinc-500 font-mono mt-1 mb-2">
                  {buyer.email}
                </p>
                <div className="mt-1">
                  <StatusBadge status={buyer.status} />
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-100 space-y-3">
              <InfoRow icon={Phone} label="Phone" value={buyer.phone} />
              <InfoRow icon={MapPin} label="Location" value={buyer.location} />
              <InfoRow icon={Calendar} label="Joined" value={buyer.joinDate} />
            </div>
          </div>

          <div className="lg:col-span-4 bg-zinc-900 text-white border border-zinc-800 rounded-2xl p-6 shadow-md flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-[#D4AF37] to-zinc-800" />
            <div>
              <div className="flex items-center gap-2 mb-4 text-[#D4AF37]">
                <Wallet size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Wallet Balance
                </span>
              </div>
              <p className="text-4xl font-bold font-mono tracking-tight">
                ₦24,500.00
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <CreditWalletModal />
              <Button
                variant="outline"
                className="flex-1 bg-transparent text-white border-zinc-700 hover:bg-zinc-800 hover:text-[#D4AF37] hover:border-[#D4AF37] h-10 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors"
              >
                View Logs
              </Button>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4 h-full">
            <MetricCard
              icon={Wallet}
              label="Total Spent"
              value={buyer.totalSpent}
              variant="gold"
            />
            <MetricCard
              icon={ShoppingCart}
              label="Total Orders"
              value={String(buyer.orders)}
              variant="indigo"
            />
            <MetricCard
              icon={TrendingUp}
              label="Avg. Order Value"
              value="₦45,000"
              variant="emerald"
            />
          </div>
        </div>

        {/* ─── TABS & TABLE (Analytics Style) ─── */}
        <div className="space-y-6">
          <Tabs defaultValue="orders" className="w-full flex flex-col">
            <div className="flex justify-center mb-6">
              <TabsList className="bg-zinc-200/50 p-1 h-12 rounded-full inline-flex gap-1 overflow-x-auto whitespace-nowrap">
                <TabTrigger label="Order History" value="orders" />
                <TabTrigger label="Activity Log" value="activity" />
                <TabTrigger label="Settings" value="settings" />
              </TabsList>
            </div>

            <TabsContent
              value="orders"
              className="m-0 animate-in fade-in duration-500"
            >
              <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex flex-wrap gap-4 justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900">
                    Transaction History
                  </h3>

                  <div className="flex items-center gap-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "h-9 text-xs justify-start text-left font-bold uppercase tracking-wider bg-white rounded-lg",
                            !orderDateRange && "text-zinc-500",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                          {orderDateRange?.from
                            ? orderDateRange.to
                              ? `${format(orderDateRange.from, "LLL dd")} - ${format(orderDateRange.to, "LLL dd")}`
                              : format(orderDateRange.from, "LLL dd, y")
                            : "Filter Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 rounded-2xl overflow-hidden shadow-xl border-zinc-200"
                        align="end"
                      >
                        <CalendarComponent
                          mode="range"
                          selected={orderDateRange}
                          onSelect={setOrderDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>

                    <Select
                      value={orderStatusFilter}
                      onValueChange={setOrderStatusFilter}
                    >
                      <SelectTrigger className="w-[140px] h-9 text-xs font-bold uppercase tracking-wider bg-white rounded-lg">
                        <Filter className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 text-xs font-bold uppercase tracking-wider rounded-lg"
                    >
                      <Download className="mr-2 h-3.5 w-3.5 text-zinc-500" />{" "}
                      Export CSV
                    </Button>
                  </div>
                </div>

                <div className="p-0">
                  <DataTable columns={orderColumns} data={filteredOrders} />
                </div>
              </div>
            </TabsContent>

            {/* ACTIVITY TAB */}
            <TabsContent value="activity" className="m-0">
              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/30">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Recent Account Activity
                  </h3>
                </div>
                <div className="p-0">
                  <DataTable
                    columns={activityColumns}
                    data={MOCK_ACTIVITY_LOG}
                  />
                </div>
              </div>
            </TabsContent>

            {/* SETTINGS TAB */}
            <TabsContent value="settings" className="m-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Edit Profile Info */}
                <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
                  <div className="mb-6 border-b border-zinc-100 pb-4">
                    <h3 className="font-bold text-zinc-900 mb-1">
                      Profile Information
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Update the basic personal details for this user.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-600">Full Name</Label>
                      <Input defaultValue={buyer.name} className="h-9" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-600">
                        Email Address
                      </Label>
                      <Input
                        defaultValue={buyer.email}
                        type="email"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-600">
                        Phone Number
                      </Label>
                      <Input
                        defaultValue={buyer.phone}
                        type="tel"
                        className="h-9 font-mono"
                      />
                    </div>
                    <Button className="w-full mt-4 bg-zinc-900">
                      <Save className="mr-2 h-4 w-4" /> Save Profile Changes
                    </Button>
                  </div>
                </div>

                {/* Change Password */}
                <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
                  <div className="mb-6 border-b border-zinc-100 pb-4">
                    <h3 className="font-bold text-zinc-900 mb-1">
                      Change Password
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Force a password update for this user account.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-600">
                        New Password
                      </Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-600">
                        Confirm New Password
                      </Label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-9"
                      />
                    </div>
                    <div className="pt-4">
                      <Button variant="destructive" className="w-full">
                        <Key className="mr-2 h-4 w-4" /> Update Password
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
