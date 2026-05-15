"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/cards/stat-card";
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Download,
  CalendarIcon,
  Filter,
  MapPin,
  Truck,
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

import { orderColumns } from "./column";
import { useAdminOrders } from "@/src/features/orders/hooks";
import { useAdminOrderStats } from "@/src/features/orders/hooks";

export default function OrdersView() {
  const [activeTab, setActiveTab] = useState<
    "All" | "Processing" | "Completed" | "Dispute"
  >("All");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const { data: stats, isLoading: statsLoading } = useAdminOrderStats();

  const dateFrom = dateRange?.from ? dateRange.from.toISOString() : undefined;
  const dateTo = dateRange?.to ? dateRange.to.toISOString() : undefined;

  const status =
    activeTab !== "All"
      ? activeTab
      : statusFilter !== "all"
        ? statusFilter
        : undefined;

  const location = locationFilter !== "all" ? locationFilter : undefined;

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminOrders({
    currency: "NGN",
    pageNumber: 1,
    pageSize: 20,
    status,
    location,
    dateFrom,
    dateTo,
  });

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-10">
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Marketplace / Orders
          </h1>
        </div>
        <Button
          size="sm"
          className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs font-bold uppercase tracking-wider rounded-lg"
        >
          <Download className="mr-2 h-3.5 w-3.5" />
          Export Orders
        </Button>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="All Orders"
            value={statsLoading ? "—" : String(stats?.allOrders ?? 0)}
            icon={Package}
            variant="default"
          />
          <StatCard
            label="Processing"
            value={statsLoading ? "—" : String(stats?.processing ?? 0)}
            icon={Truck}
            variant="amber"
          />
          <StatCard
            label="Completed"
            value={statsLoading ? "—" : String(stats?.completed ?? 0)}
            icon={CheckCircle2}
            variant="emerald"
          />
          <StatCard
            label="Disputes"
            value={statsLoading ? "—" : String(stats?.disputes ?? 0)}
            icon={AlertTriangle}
            variant="rose"
          />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as any)}
          className="w-full flex flex-col"
        >
          <div className="flex overflow-x-auto pb-2 scrollbar-hide">
            <TabsList className="bg-zinc-200/50 p-1 h-12 rounded-full inline-flex gap-1">
              {["All", "Processing", "Completed", "Dispute"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500 data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all"
                >
                  {tab}
                  {tab === "Dispute" && (
                    <span className="ml-2 bg-rose-500 text-white px-1.5 py-0.5 rounded-full text-[9px]">
                      {stats?.disputes ?? 0}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="mt-2 bg-white p-4 rounded-3xl shadow-sm border border-zinc-200 flex flex-wrap gap-3 items-center">
            <div className="flex items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest mr-2">
              <Filter className="mr-2 h-3.5 w-3.5" /> Filters:
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-10 text-xs font-medium justify-start text-left w-55 bg-zinc-50/50 border-zinc-200 rounded-xl",
                    !dateRange && "text-zinc-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span className="uppercase tracking-wider text-[10px] font-bold">
                      Filter by Date
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 rounded-2xl overflow-hidden border-zinc-200 shadow-xl"
                align="start"
              >
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 h-10 text-xs font-bold uppercase tracking-wider bg-zinc-50/50 border-zinc-200 rounded-xl text-zinc-600">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Dispute">Dispute</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-40 h-10 text-xs font-bold uppercase tracking-wider bg-zinc-50/50 border-zinc-200 rounded-xl text-zinc-600">
                <MapPin className="mr-2 h-3 w-3 text-zinc-400 inline" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Lagos">Lagos</SelectItem>
                <SelectItem value="Abuja">Abuja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-6 text-sm text-zinc-500">Loading orders…</div>
            ) : isError ? (
              <div className="p-6 text-sm">
                <p className="text-rose-600 font-semibold">
                  Failed to load orders:{" "}
                  {(error as any)?.response?.data?.message ??
                    (error as any)?.message ??
                    "Unknown error"}
                </p>
                <button
                  onClick={() => refetch()}
                  className="mt-3 text-xs font-semibold underline text-zinc-700"
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                {isFetching && (
                  <div className="px-6 py-2 text-[11px] text-zinc-500 border-b border-zinc-100">
                    Refreshing…
                  </div>
                )}
                <DataTable columns={orderColumns} data={orders} />
              </>
            )}
          </div>
        </Tabs>
      </main>
    </div>
  );
}
