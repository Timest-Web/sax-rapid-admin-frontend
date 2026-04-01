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
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
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
import { InfoRow, TabItem } from "@/components/buyers/buyers-helper";
import MetricCard from "@/components/cards/metric-card";
import { cn } from "@/lib/utils";
import { orderColumns, activityColumns, ActivityLog, Order } from "./details_column";

// --- MOCK DATA ---
const MOCK_ACTIVITY_LOG: ActivityLog[] = [
  { id: "1", action: "Password Reset", ipLocation: "123.456.281.34 / Lagos, NG", browser: "Firefox on Windows", timestamp: "2 hrs ago" },
  { id: "2", action: "Profile Updated", ipLocation: "123.456.281.34 / Lagos, NG", browser: "Firefox on Windows", timestamp: "1 day ago" },
  { id: "3", action: "Successful Login", ipLocation: "192.168.100.12 / Abuja, NG", browser: "Chrome on macOS", timestamp: "3 days ago" },
];

// Expanded Mock Orders so we can test the filters
const MOCK_BUYER_ORDERS: Order[] = [
  { id: "1003163", date: "March 30, 2026", items: 3, total: "₦12,500", status: "Processing" },
  { id: "1003162", date: "March 28, 2026", items: 1, total: "₦4,200", status: "Shipped" },
  { id: "1003161", date: "March 25, 2026", items: 5, total: "₦45,000", status: "Delivered" },
  { id: "1003160", date: "March 20, 2026", items: 2, total: "₦8,900", status: "Failed" },
  { id: "1003159", date: "March 15, 2026", items: 1, total: "₦15,000", status: "On-Hold" },
  { id: "1003158", date: "March 10, 2026", items: 4, total: "₦22,000", status: "Delivered" },
];

export default function BuyerDetailsView() {
  const params = useParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId || "";

  const buyerId = decodeURIComponent(id);
  const buyer = BUYERS.find((b) => b.id === buyerId) || BUYERS[0]; // Fallback for preview

  // State for Order Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderDateRange, setOrderDateRange] = useState<DateRange | undefined>();

  // Filter Logic
  const filteredOrders = MOCK_BUYER_ORDERS.filter((order) => {
    const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter;
    // Date filtering logic would go here if strict date parsing was needed
    return matchesStatus;
  });

  if (!buyer && id) return notFound();
  if (!buyer) return null;

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* ─── STICKY HEADER ─── */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <div className="flex items-center gap-2 text-sm font-mono text-zinc-400">
            <Link href="/admin/buyers" className="hover:text-zinc-900 transition-colors flex items-center gap-1">
              <ArrowLeft size={14} /> BUYERS
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-bold">{buyer.id}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <ResetPasswordModal />
          <SuspendUserModal />
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="p-6 max-w-7xl mx-auto space-y-8">
        
        {/* ─── TOP SECTION: CARDS ROW ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* 1. Identity Card */}
          <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-lg p-6 shadow-sm flex flex-col justify-between h-full">
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-full bg-zinc-100 flex items-center justify-center text-2xl font-bold text-zinc-400 border-4 border-zinc-50 shrink-0">
                {buyer.avatar}
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 font-display">{buyer.name}</h2>
                <p className="text-xs text-zinc-400 font-mono mt-1 mb-2">{buyer.email}</p>
                <StatusBadge status={buyer.status} />
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-100 space-y-3">
              <InfoRow icon={Phone} label="Phone" value={buyer.phone} />
              <InfoRow icon={MapPin} label="Location" value={buyer.location} />
              <InfoRow icon={Calendar} label="Joined" value={buyer.joinDate} />
            </div>
          </div>

          {/* 2. Wallet Card */}
          <div className="lg:col-span-4 bg-sax-black text-white border border-zinc-900 rounded-lg p-6 shadow-sm flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-4 text-sax-gold">
                <Wallet size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Wallet Balance</span>
              </div>
              <p className="text-4xl font-bold font-mono tracking-tight">₦24,500.00</p>
            </div>
            <div className="mt-6 flex gap-3">
              <CreditWalletModal />
              <Button variant="outline" className="flex-1 bg-transparent text-white border-zinc-700 hover:bg-zinc-800 hover:text-white hover:border-white h-9">
                View Logs
              </Button>
            </div>
          </div>

          {/* 3. Metrics Stack */}
          <div className="lg:col-span-4 flex flex-col gap-3 h-full">
            <MetricCard icon={Wallet} label="Total Spent" value={buyer.totalSpent} variant="gold" />
            <MetricCard icon={ShoppingCart} label="Total Orders" value={String(buyer.orders)} variant="indigo" />
            <MetricCard icon={TrendingUp} label="Avg. Order Value" value="₦45,000" variant="emerald" />
          </div>
        </div>

        {/* ─── BOTTOM SECTION: TABS & TABLE ─── */}
        <div className="space-y-6">
          <Tabs defaultValue="orders" className="w-full flex flex-col">
            <div className="border-b border-zinc-200 mb-6">
              <TabsList className="bg-transparent p-0 h-12 justify-start w-full gap-4">
                <TabItem value="orders" label="Order History" />
                <TabItem value="activity" label="Activity Log" />
                <TabItem value="settings" label="Settings" />
              </TabsList>
            </div>

            {/* ORDERS TAB */}
            <TabsContent value="orders" className="m-0">
              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm">
                {/* ─── TABLE HEADER WITH FILTERS ─── */}
                <div className="p-4 border-b border-zinc-200 flex flex-wrap gap-4 justify-between items-center bg-zinc-50/30">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Transaction History</h3>
                  
                  <div className="flex items-center gap-2">
                    {/* Date Range Picker */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "h-8 text-xs justify-start text-left font-normal bg-white",
                            !orderDateRange && "text-zinc-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                          {orderDateRange?.from ? (
                            orderDateRange.to ? (
                              <>
                                {format(orderDateRange.from, "LLL dd, y")} -{" "}
                                {format(orderDateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(orderDateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Filter by Date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={orderDateRange?.from}
                          selected={orderDateRange}
                          onSelect={setOrderDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>

                    {/* Status Select */}
                    <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                      <SelectTrigger className="w-[140px] h-8 text-xs bg-white">
                        <Filter className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                        <SelectItem value="On-Hold">On-Hold</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Export Button */}
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <Download className="mr-2 h-3.5 w-3.5 text-zinc-500" /> Export CSV
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
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Recent Account Activity</h3>
                </div>
                <div className="p-0">
                  <DataTable columns={activityColumns} data={MOCK_ACTIVITY_LOG} />
                </div>
              </div>
            </TabsContent>

            {/* SETTINGS TAB */}
            <TabsContent value="settings" className="m-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Edit Profile Info */}
                <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
                  <div className="mb-6 border-b border-zinc-100 pb-4">
                    <h3 className="font-bold text-zinc-900 mb-1">Profile Information</h3>
                    <p className="text-xs text-zinc-500">Update the basic personal details for this user.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-600">Full Name</Label>
                      <Input defaultValue={buyer.name} className="h-9" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-600">Email Address</Label>
                      <Input defaultValue={buyer.email} type="email" className="h-9" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-600">Phone Number</Label>
                      <Input defaultValue={buyer.phone} type="tel" className="h-9 font-mono" />
                    </div>
                    <Button className="w-full mt-4 bg-zinc-900">
                      <Save className="mr-2 h-4 w-4" /> Save Profile Changes
                    </Button>
                  </div>
                </div>

                {/* Change Password */}
                <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
                  <div className="mb-6 border-b border-zinc-100 pb-4">
                    <h3 className="font-bold text-zinc-900 mb-1">Change Password</h3>
                    <p className="text-xs text-zinc-500">Force a password update for this user account.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-600">New Password</Label>
                      <Input type="password" placeholder="••••••••" className="h-9" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-600">Confirm New Password</Label>
                      <Input type="password" placeholder="••••••••" className="h-9" />
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