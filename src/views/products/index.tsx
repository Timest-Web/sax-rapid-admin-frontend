/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { productColumns } from "./column";

import { StatCard } from "@/components/cards/stat-card";

import {
  Package,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Filter,
  CalendarIcon,
  Tag,
  User2,
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

import {
  useAdminProductCount,
  useAdminProducts,
} from "@/src/features/products/hooks";

import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { FilterTabs } from "@/components/tabs/filter-tab";

export default function ProductsView() {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "rejected">(
    "all",
  );

  const [categoryFilter, setCategoryFilter] = useState("all");

  const [vendorFilter, setVendorFilter] = useState("all");

  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const [pageNumber, setPageNumber] = useState(1);

  const pageSize = 20;

  const status =
    activeTab === "pending"
      ? "Pending"
      : activeTab === "rejected"
        ? "Rejected"
        : undefined;

  const query = {
    pageNumber,
    pageSize,
    status,
    dateFrom: dateRange?.from?.toISOString(),
    dateTo: dateRange?.to?.toISOString(),
  };

  const { data, isLoading, isError, error, refetch, isFetching } =
    useAdminProducts(query);

  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  const liveOnPage = useMemo(
    () => items.filter((p) => p.status === "Active").length,
    [items],
  );

  const pendingOnPage = useMemo(
    () => items.filter((p) => p.status === "Pending").length,
    [items],
  );

  const allCountQ = useAdminProductCount(undefined);

  const pendingCountQ = useAdminProductCount("Pending");

  const rejectedCountQ = useAdminProductCount("Rejected");

  const allCount = allCountQ.data ?? 0;
  const pendingCount = pendingCountQ.data ?? 0;
  const rejectedCount = rejectedCountQ.data ?? 0;

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />

          <div className="h-6 w-px bg-zinc-200" />

          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Marketplace / Products
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs font-bold uppercase tracking-wider"
          >
            Export List
          </Button>

          <Button
            size="sm"
            className="h-9 text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white hover:bg-[#D4AF37] hover:text-black transition-colors"
          >
            <Plus className="mr-2 h-3.5 w-3.5" />
            Add New Product
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Inventory"
            value={isLoading ? "—" : String(totalCount)}
            icon={Package}
            variant="gold"
          />

          <StatCard
            label="Moderation Queue"
            value={isLoading ? "—" : String(pendingOnPage)}
            icon={AlertTriangle}
            variant="rose"
          />

          <StatCard
            label="Live Products"
            value={isLoading ? "—" : String(liveOnPage)}
            icon={CheckCircle2}
            variant="emerald"
          />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v as any);
            setPageNumber(1);
          }}
          className="w-full flex flex-col"
        >
          {" "}
          <div className="flex items-center justify-between">
            {" "}
            <FilterTabs
              tabs={[
                {
                  value: "all",
                  label: "All Inventory",
                  count: allCount,
                  variant: "emerald",
                },
                {
                  value: "pending",
                  label: "Pending",
                  count: pendingCount,
                  variant: "amber",
                },
                {
                  value: "rejected",
                  label: "Rejected",
                  count: rejectedCount,
                  variant: "rose",
                },
              ]}
            />{" "}
          </div>
          <div className="mt-2 bg-white p-4 rounded-3xl shadow-sm border border-zinc-200 flex flex-wrap gap-3 items-center">
            <div className="flex items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest mr-2">
              <Filter className="mr-2 h-3.5 w-3.5" />
              Filters:
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

            {/* <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44 h-10 text-xs font-bold uppercase tracking-wider bg-zinc-50/50 border-zinc-200 rounded-xl text-zinc-600">
                <Tag className="mr-2 h-3 w-3 text-zinc-400 inline" />

                <SelectValue placeholder="Category" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>

                <SelectItem value="Fashion">Fashion</SelectItem>

                <SelectItem value="Electronics">Electronics</SelectItem>
              </SelectContent>
            </Select>

            <Select value={vendorFilter} onValueChange={setVendorFilter}>
              <SelectTrigger className="w-44 h-10 text-xs font-bold uppercase tracking-wider bg-zinc-50/50 border-zinc-200 rounded-xl text-zinc-600">
                <User2 className="mr-2 h-3 w-3 text-zinc-400 inline" />

                <SelectValue placeholder="Vendor" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>

                <SelectItem value="vendor-1">Vendor One</SelectItem>

                <SelectItem value="vendor-2">Vendor Two</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
          <div className="mt-4 bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
            {isLoading ? (
              <TableSkeleton columns={6} rows={10} withToolbar />
            ) : isError ? (
              <div className="p-6 text-sm">
                <p className="text-rose-600 font-semibold">
                  Failed to load products:{" "}
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
                  <DataTable columns={productColumns} data={items} />
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </main>
    </div>
  );
}
