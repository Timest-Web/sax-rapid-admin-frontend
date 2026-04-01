"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orderColumns, Order } from "./column";
import { StatCard } from "@/components/cards/stat-card"; // Assuming this is imported
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Download,
  CalendarIcon,
  Filter,
  MapPin,
  Ban,
  Banknote,
  Gavel,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const MOCK_ORDERS: Order[] = [
  {
    id: "1003163",
    date: "Mar 30, 2026",
    status: "Processing",
    customer: "Abi Odubanjo",
    location: "Lagos, NG",
    products: ["Badia Onion Powder - 163g", "Garlic", "Salt"],
    itemsSold: 3,
    netSales: "₦137,980",
    vendorEarning: "₦120,500",
    vendor: "TechHub",
  },
  {
    id: "1003162",
    date: "Mar 30, 2026",
    status: "Shipped",
    customer: "Ebere Nwozor",
    location: "Abuja, NG",
    products: ["Turkey Midwing - 10 KG"],
    itemsSold: 1,
    netSales: "₦71,000",
    vendorEarning: "₦65,000",
    vendor: "Fresh Foods",
  },
  {
    id: "1003161",
    date: "Mar 29, 2026",
    status: "Delivered",
    customer: "Provin Ikeanyi",
    location: "Port Harcourt, NG",
    products: ['Samsung 65" TV'],
    itemsSold: 1,
    netSales: "₦840,000",
    vendorEarning: "₦800,000",
    vendor: "ElectroWorld",
  },
  {
    id: "1003160",
    date: "Mar 29, 2026",
    status: "Failed",
    customer: "Ogechi Dike",
    location: "Lagos, NG",
    products: ["Easter Edition Sneakers"],
    itemsSold: 1,
    netSales: "₦99,900",
    vendorEarning: "₦0",
    vendor: "SneakerVault",
  },
  {
    id: "1003159",
    date: "Mar 28, 2026",
    status: "On-Hold",
    customer: "Gbemisola Akande",
    location: "Ibadan, NG",
    products: ["Headless Hake Fish - 1kg"],
    itemsSold: 13,
    netSales: "₦96,720",
    vendorEarning: "₦90,000",
    vendor: "Fresh Foods",
  },
  {
    id: "1003158",
    date: "Mar 28, 2026",
    status: "Dispute",
    customer: "Ibidapo Oguntimehin",
    location: "Lagos, NG",
    products: ["25L Premium Palm Oil"],
    itemsSold: 2,
    netSales: "₦97,980",
    vendorEarning: "₦0 (Held)",
    vendor: "Naija Grocers",
  },
];

export default function OrdersView() {
  const [activeTab, setActiveTab] = useState("All");
  const [locationFilter, setLocationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter((order) => {
      const matchTab = activeTab === "All" || order.status === activeTab;
      const matchStatusDropdown =
        statusFilter === "all" || order.status === statusFilter;
      const matchLocation =
        locationFilter === "all" || order.location.includes(locationFilter);
      return matchTab && matchStatusDropdown && matchLocation;
    });
  }, [activeTab, locationFilter, statusFilter]);

  const disputeCount = MOCK_ORDERS.filter((o) => o.status === "Dispute").length;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-10">
      {/* ─── HEADER ─── */}
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
          className="bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors text-xs font-bold uppercase tracking-wider rounded-lg"
        >
          <Download className="mr-2 h-3.5 w-3.5" />
          Export Orders
        </Button>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* ─── STAT CARDS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="All Orders"
            value="9,731"
            icon={Package}
            variant="default"
          />
          <StatCard
            label="Processing"
            value="45"
            icon={Truck}
            variant="amber"
          />
          <StatCard
            label="Completed"
            value="9,500"
            icon={CheckCircle2}
            variant="emerald"
          />
          <StatCard
            label="Disputes"
            value={String(disputeCount)}
            icon={AlertTriangle}
            variant="rose"
          />
        </div>

        {/* ─── TABS & FILTERS ─── */}
        <div className="space-y-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full flex flex-col"
          >
            {/* Tab List */}
            <div className="flex overflow-x-auto pb-2 scrollbar-hide">
              <TabsList className="bg-zinc-200/50 p-1 h-12 rounded-full inline-flex gap-1">
                {[
                  "All",
                  "Processing",
                  "Shipped",
                  "Delivered",
                  "Failed",
                  "On-Hold",
                  "Dispute",
                ].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500 data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all"
                  >
                    {tab}
                    {tab === "Dispute" && (
                      <span className="ml-2 bg-rose-500 text-white px-1.5 py-0.5 rounded-full text-[9px]">
                        {disputeCount}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Filter Bar */}
            <div className="mt-2 bg-white p-4 rounded-3xl shadow-sm border border-zinc-200 flex flex-wrap gap-3 items-center">
              <div className="flex items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest mr-2">
                <Filter className="mr-2 h-3.5 w-3.5" /> Filters:
              </div>

              {/* Date Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-10 text-xs font-medium justify-start text-left w-[220px] bg-zinc-50/50 border-zinc-200 rounded-xl",
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

              {/* Status Filter (Secondary to Tabs) */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] h-10 text-xs font-bold uppercase tracking-wider bg-zinc-50/50 border-zinc-200 rounded-xl text-zinc-600">
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

              {/* Location Filter */}
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[160px] h-10 text-xs font-bold uppercase tracking-wider bg-zinc-50/50 border-zinc-200 rounded-xl text-zinc-600">
                  <MapPin className="mr-2 h-3 w-3 text-zinc-400 inline" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Lagos">Lagos, NG</SelectItem>
                  <SelectItem value="Abuja">Abuja, NG</SelectItem>
                  <SelectItem value="Port Harcourt">
                    Port Harcourt, NG
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="mt-4 bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <DataTable columns={orderColumns} data={filteredOrders} />
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
