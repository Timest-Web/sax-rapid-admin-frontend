/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { StatCard } from "@/components/cards/stat-card";
import { FilterTabs } from "@/components/tabs/filter-tab";

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
import {
  useAdminOrders,
  useAdminOrderStats,
} from "@/src/features/orders/hooks";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

// ✅ location hooks
import {
  useCountries,
  useStatesByCountry,
} from "@/src/features/locations/hooks";

export default function OrdersView() {
  const [activeTab, setActiveTab] = useState<
    "all" | "processing" | "completed" | "dispute"
  >("all");

  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // ✅ new: country + state
  const [countryId, setCountryId] = useState<string>("all");
  const [stateName, setStateName] = useState<string>("all");

  const { data: stats, isLoading: statsLoading } = useAdminOrderStats();

  const dateFrom = dateRange?.from ? dateRange.from.toISOString() : undefined;
  const dateTo = dateRange?.to ? dateRange.to.toISOString() : undefined;

  // status derived from tab + filter
  const status =
    activeTab === "processing"
      ? "Processing"
      : activeTab === "completed"
        ? "Completed"
        : activeTab === "dispute"
          ? "Dispute"
          : statusFilter !== "all"
            ? statusFilter
            : undefined;

  // ✅ Fetch countries (activeOnly=true)
  const countriesQ = useCountries(true, true);

  const selectedCountryId = countryId !== "all" ? Number(countryId) : undefined;

  // ✅ Fetch states only if a country is selected
  const statesQ = useStatesByCountry(selectedCountryId, true);

  const selectedCountryName = useMemo(() => {
    if (!selectedCountryId) return undefined;
    return countriesQ.data?.find((c) => c.id === selectedCountryId)?.name;
  }, [countriesQ.data, selectedCountryId]);

  const location =
    stateName !== "all"
      ? stateName
      : selectedCountryName // fallback to country if state not chosen
        ? selectedCountryName
        : undefined;

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

        {/* <Button
          size="sm"
          className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-xs font-bold uppercase tracking-wider rounded-lg"
        >
          <Download className="mr-2 h-3.5 w-3.5" />
          Export Orders
        </Button> */}
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
          <div className="flex items-center justify-between">
            <FilterTabs
              tabs={[
                {
                  value: "all",
                  label: "All Orders",
                  count: stats?.allOrders ?? 0,
                  variant: "emerald",
                },
                {
                  value: "processing",
                  label: "Processing",
                  count: stats?.processing ?? 0,
                  variant: "amber",
                },
                {
                  value: "completed",
                  label: "Completed",
                  count: stats?.completed ?? 0,
                  variant: "emerald",
                },
                {
                  value: "dispute",
                  label: "Disputes",
                  count: stats?.disputes ?? 0,
                  variant: "rose",
                },
              ]}
            />
          </div>

          <div>
            {/* Filters bar */}
            <div className="p-4 border-b border-zinc-200 bg-zinc-50/50 flex flex-wrap gap-3 items-center">
              <div className="flex items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest mr-2">
                <Filter className="mr-2 h-3.5 w-3.5" />
                Filters:
              </div>

              {/* Date range */}
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

              {/* Status */}
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

              {/* ✅ Country */}
              <Select
                value={countryId}
                onValueChange={(v) => {
                  setCountryId(v);
                  setStateName("all"); // reset state when country changes
                }}
              >
                <SelectTrigger className="w-52 h-10 text-xs font-bold uppercase tracking-wider bg-zinc-50/50 border-zinc-200 rounded-xl text-zinc-600">
                  <MapPin className="mr-2 h-3 w-3 text-zinc-400 inline" />
                  <SelectValue
                    placeholder={
                      countriesQ.isLoading ? "Loading..." : "Country"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {(countriesQ.data ?? []).map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* ✅ State */}
              <Select
                value={stateName}
                onValueChange={setStateName}
                disabled={!selectedCountryId || statesQ.isLoading}
              >
                <SelectTrigger className="w-52 h-10 text-xs font-bold uppercase tracking-wider bg-zinc-50/50 border-zinc-200 rounded-xl text-zinc-600">
                  <SelectValue
                    placeholder={
                      !selectedCountryId
                        ? "Select country first"
                        : statesQ.isLoading
                          ? "Loading states..."
                          : "State"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {(statesQ.data ?? []).map((s) => (
                    <SelectItem key={s.id} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {isLoading ? (
              <TableSkeleton columns={6} rows={10} withToolbar />
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

                <TabsContent value={activeTab} className="m-0">
                  <DataTable columns={orderColumns} data={orders} />
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </main>
    </div>
  );
}
