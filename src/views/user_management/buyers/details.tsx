"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

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
  Eye,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { InfoRow } from "@/components/buyers/buyers-helper";
import MetricCard from "@/components/cards/metric-card";

import { activityColumns, makeOrderColumns } from "./details_column"; // <-- IMPORTANT: use makeOrderColumns

import {
  useBuyerProfile,
  useBuyerOrders,
  useBuyerActivity,
  useSuspendBuyer,
  useReactivateBuyer,
} from "@/src/features/buyers/hooks";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { BuyerOrder } from "@/src/features/buyers/api";
import { AppDialog } from "@/components/custom-dialog";

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

function initials(name: string) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const a = parts[0]?.[0] ?? "B";
  const b = parts[parts.length - 1]?.[0] ?? "Y";
  return (a + b).toUpperCase();
}

function money(amount: number, currency: string) {
  const symbol = currency === "NGN" ? "₦" : currency === "ZAR" ? "R" : "";
  return `${symbol}${Number(amount ?? 0).toLocaleString()}`;
}

export default function BuyerDetailsView() {
  const params = useParams();
  const buyerIdRaw = (params as any)?.buyerId;
  const buyerId = decodeURIComponent(
    Array.isArray(buyerIdRaw) ? buyerIdRaw[0] : buyerIdRaw || "",
  );

  // Queries
  const profileQ = useBuyerProfile(buyerId);
  const ordersQ = useBuyerOrders(buyerId, 1, 20);
  const activityQ = useBuyerActivity(buyerId, 1, 20);

  // Mutations
  const suspend = useSuspendBuyer();
  const reactivate = useReactivateBuyer();

  // UI state
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderDateRange, setOrderDateRange] = useState<DateRange | undefined>();

  const [suspendOpen, setSuspendOpen] = useState(false);
  const [reason, setReason] = useState("");

  // Order quick-view (no backend order-details endpoint)
  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<BuyerOrder | null>(null);

  const orderColumns = useMemo(
    () =>
      makeOrderColumns({
        onView: (order) => {
          setSelectedOrder(order);
          setOrderOpen(true);
        },
      }),
    [],
  );

  if (!buyerId) {
    return (
      <div className="min-h-screen bg-zinc-50 p-10 text-sm text-rose-600">
        Missing buyerId in route.
      </div>
    );
  }

  if (profileQ.isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 p-10 text-sm text-zinc-500">
        Loading buyer…
      </div>
    );
  }

  if (profileQ.isError || !profileQ.data) {
    return (
      <div className="min-h-screen bg-zinc-50 p-10">
        <p className="text-sm text-rose-600 font-semibold">
          Buyer not found or failed to load.
        </p>
        <Link
          href="/admin/buyers"
          className="text-xs underline text-zinc-700 mt-3 inline-block"
        >
          Back to Buyers
        </Link>
      </div>
    );
  }

  const buyer = profileQ.data;

  const allOrders = ordersQ.data ?? [];

  const filteredOrders = (allOrders ?? []).filter((o) => {
    const statusOk =
      orderStatusFilter === "all" || String(o.status) === orderStatusFilter;

    const dateOk = (() => {
      if (!orderDateRange?.from) return true;
      const d = new Date(o.date).getTime();
      const from = orderDateRange.from.getTime();
      const to = orderDateRange.to ? orderDateRange.to.getTime() : from;
      return d >= from && d <= to;
    })();

    return statusOk && dateOk;
  });

  const locationLabel =
    [buyer.city, buyer.country].filter(Boolean).join(", ") || "—";
  const joinedLabel = buyer.joinedDate
    ? new Date(buyer.joinedDate).toLocaleDateString()
    : "—";

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
            <span className="text-zinc-900 font-mono">
              {buyer.customerCode}
            </span>

            {/* NOTE: profile endpoint doesn’t include status */}
            <StatusBadge status={"—"} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs font-bold uppercase tracking-wider rounded-lg border-zinc-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
            onClick={() => {
              setReason("");
              setSuspendOpen(true);
            }}
            disabled={suspend.isPending}
          >
            Suspend
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs font-bold uppercase tracking-wider rounded-lg border-zinc-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
            onClick={() => reactivate.mutate(buyerId)}
            disabled={reactivate.isPending}
          >
            Reactivate
          </Button>
        </div>
      </header>

      {/* Suspend dialog */}
      <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="uppercase tracking-widest font-display">
              Suspend Buyer
            </DialogTitle>
            <DialogDescription>
              Provide a reason. This will suspend the buyer account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">
              Reason <span className="text-rose-600">*</span>
            </Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Fraudulent activity"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSuspendOpen(false)}
              disabled={suspend.isPending}
            >
              Cancel
            </Button>
            <Button
              className="bg-zinc-900 text-white"
              disabled={!reason.trim() || suspend.isPending}
              onClick={() => {
                suspend.mutate(
                  { customerId: buyerId, reason: reason.trim() },
                  { onSuccess: () => setSuspendOpen(false) },
                );
              }}
            >
              {suspend.isPending ? "Suspending..." : "Confirm Suspend"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order quick-view dialog */}
      <AppDialog
        open={orderOpen}
        onOpenChange={setOrderOpen}
        title="Order Details"
        description=""
        icon={<Eye size={16} />}
        size="custom"
        maxWidthClassName="sm:max-w-[760px]"
        footer={
          <>
            <Button
              type="button"
              className="bg-zinc-900 text-[#D4AF37] px-8 h-11"
              onClick={() => window.print()}
              disabled={!selectedOrder}
            >
              Print
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setOrderOpen(false)}
              className="px-6 h-11"
            >
              Close
            </Button>
          </>
        }
      >
        {!selectedOrder ? (
          <div className="text-sm text-zinc-500">No order selected.</div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  Order ID
                </p>
                <p className="font-mono font-bold text-zinc-900">
                  {selectedOrder.orderId}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={selectedOrder.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  Date
                </p>
                <p className="text-sm font-medium text-zinc-900">
                  {selectedOrder.date
                    ? format(new Date(selectedOrder.date), "PPp")
                    : "—"}
                </p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  Currency
                </p>
                <p className="text-sm font-medium text-zinc-900">
                  {selectedOrder.currency ?? "—"}
                </p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  Total Amount
                </p>
                <p className="text-sm font-mono font-bold text-zinc-900">
                  {money(selectedOrder.totalAmount, selectedOrder.currency)}
                </p>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-700">
                  Items
                </p>
              </div>
              <div className="p-4">
                {selectedOrder.items?.length ? (
                  <ul className="space-y-2">
                    {selectedOrder.items.map((it, idx) => (
                      <li
                        key={`${it}-${idx}`}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span className="text-zinc-900">{it}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-zinc-500">No items.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </AppDialog>

      {/* ─── MAIN CONTENT ─── */}
      <main className="p-6 max-w-7xl mx-auto space-y-8">
        {/* ─── CARDS ROW ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Profile card */}
          <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200" />
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-full bg-zinc-900 flex items-center justify-center text-2xl font-bold text-[#D4AF37] border-4 border-zinc-50 shrink-0 shadow-sm">
                {initials(buyer.fullName)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 font-display">
                  {buyer.fullName}
                </h2>
                <p className="text-xs text-zinc-500 font-mono mt-1 mb-2">
                  {buyer.email}
                </p>
                <div className="mt-1">
                  <StatusBadge status={"—"} />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-100 space-y-3">
              <InfoRow
                icon={Phone}
                label="Phone"
                value={buyer.phoneNumber || "—"}
              />
              <InfoRow icon={MapPin} label="Location" value={locationLabel} />
              <InfoRow icon={Calendar} label="Joined" value={joinedLabel} />
            </div>
          </div>

          {/* Wallet card */}
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
                {money(buyer.walletBalance, buyer.currency)}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 bg-transparent text-white border-zinc-700 h-10 text-xs font-bold uppercase tracking-widest rounded-xl"
                disabled
                title=""
              >
                Credit Wallet
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent text-white border-zinc-700 h-10 text-xs font-bold uppercase tracking-widest rounded-xl"
                disabled
              >
                View Logs
              </Button>
            </div>
          </div>

          {/* Metrics stack */}
          <div className="lg:col-span-4 flex flex-col gap-4 h-full">
            <MetricCard
              icon={Wallet}
              label="Total Spent"
              value={money(buyer.totalSpent, buyer.currency)}
              variant="gold"
            />
            <MetricCard
              icon={ShoppingCart}
              label="Total Orders"
              value={String(buyer.totalOrders)}
              variant="indigo"
            />
            <MetricCard
              icon={TrendingUp}
              label="Avg. Order Value"
              value={money(buyer.averageOrderValue, buyer.currency)}
              variant="emerald"
            />
          </div>
        </div>

        {/* ─── TABS ─── */}
        <div className="space-y-6">
          <Tabs defaultValue="orders" className="w-full flex flex-col">
            <div className="flex justify-center mb-6">
              <TabsList className="bg-zinc-200/50 p-1 h-12 rounded-full inline-flex gap-1 overflow-x-auto whitespace-nowrap">
                <TabTrigger label="Order History" value="orders" />
                <TabTrigger label="Activity Log" value="activity" />
                <TabTrigger label="Settings" value="settings" />
              </TabsList>
            </div>

            {/* Orders tab */}
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
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 text-xs font-bold uppercase tracking-wider rounded-lg"
                      disabled
                    >
                      <Download className="mr-2 h-3.5 w-3.5 text-zinc-500" />{" "}
                      Export CSV
                    </Button>
                  </div>
                </div>

                <div className="p-0">
                  {ordersQ.isLoading ? (
                    <div className="p-6 text-sm text-zinc-500">
                      Loading orders…
                    </div>
                  ) : ordersQ.isError ? (
                    <div className="p-6 text-sm text-rose-600">
                      Failed to load orders.
                    </div>
                  ) : (
                    <DataTable columns={orderColumns} data={filteredOrders} />
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Activity tab */}
            <TabsContent value="activity" className="m-0">
              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/30">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Recent Account Activity
                  </h3>
                </div>

                <div className="p-0">
                  {activityQ.isLoading ? (
                    <div className="p-6 text-sm text-zinc-500">
                      Loading activity…
                    </div>
                  ) : activityQ.isError ? (
                    <div className="p-6 text-sm text-rose-600">
                      Failed to load activity.
                    </div>
                  ) : (
                    <DataTable
                      columns={activityColumns}
                      data={activityQ.data ?? []}
                    />
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Settings tab */}
            <TabsContent value="settings" className="m-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
                  <div className="mb-6 border-b border-zinc-100 pb-4">
                    <h3 className="font-bold text-zinc-900 mb-1">
                      Profile Information
                    </h3>
                    <p className="text-xs text-zinc-500">
                    
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-600">Full Name</Label>
                      <Input
                        defaultValue={buyer.fullName}
                        className="h-9"
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-600">
                        Email Address
                      </Label>
                      <Input
                        defaultValue={buyer.email}
                        type="email"
                        className="h-9"
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-zinc-600">
                        Phone Number
                      </Label>
                      <Input
                        defaultValue={buyer.phoneNumber}
                        type="tel"
                        className="h-9 font-mono"
                        disabled
                      />
                    </div>

                    <Button className="w-full mt-4 bg-zinc-900" disabled>
                      <Save className="mr-2 h-4 w-4" /> Save Profile Changes
                    </Button>
                  </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
                  <div className="mb-6 border-b border-zinc-100 pb-4">
                    <h3 className="font-bold text-zinc-900 mb-1">
                      Change Password
                    </h3>
                    <p className="text-xs text-zinc-500">
                     
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
                        disabled
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
                        disabled
                      />
                    </div>

                    <div className="pt-4">
                      <Button variant="destructive" className="w-full" disabled>
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
