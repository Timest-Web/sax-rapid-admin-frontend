"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  DollarSign,
  PieChart,
  Smartphone,
  Shirt,
  Sofa,
  Gamepad2,
  Briefcase,
  Settings,
} from "lucide-react";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { commissionColumns, CategoryCommission } from "./column";
import { StatCard } from "@/components/cards/stat-card";
import { Button } from "@/components/ui/button";

// --- DUMMY DATA ---
const COMMISSION_DATA: CategoryCommission[] = [
  {
    id: "1",
    name: "Electronics & Gadgets",
    slug: "electronics",
    icon: Smartphone,
    rate: 5.0,
    totalSales: "₦45,000,000",
    revenueGenerated: "₦2,250,000",
    lastUpdated: "2 days ago",
    status: "active",
  },
  {
    id: "2",
    name: "Fashion & Apparel",
    slug: "fashion",
    icon: Shirt,
    rate: 8.0,
    totalSales: "₦12,000,000",
    revenueGenerated: "₦960,000",
    lastUpdated: "1 month ago",
    status: "active",
  },
  {
    id: "3",
    name: "Home & Furniture",
    slug: "home",
    icon: Sofa,
    rate: 10.0,
    totalSales: "₦8,500,000",
    revenueGenerated: "₦850,000",
    lastUpdated: "3 months ago",
    status: "active",
  },
  {
    id: "4",
    name: "Gaming",
    slug: "gaming",
    icon: Gamepad2,
    rate: 4.5,
    totalSales: "₦22,000,000",
    revenueGenerated: "₦990,000",
    lastUpdated: "1 week ago",
    status: "active",
  },
  {
    id: "5",
    name: "Office Supplies",
    slug: "office",
    icon: Briefcase,
    rate: 6.0,
    totalSales: "₦3,200,000",
    revenueGenerated: "₦192,000",
    lastUpdated: "6 months ago",
    status: "active",
  },
];

export default function CommissionView() {
  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Platform / Commission Rates
          </h1>
        </div>
        <Button variant="outline" size="sm" className="gap-2 text-xs">
          <Settings size={14} /> Global Settings
        </Button>
      </header>

      <main className="p-6 max-w-400 mx-auto space-y-8">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Commission Revenue"
            value="₦5,242,000"
            icon={DollarSign}
            variant="default"
          />
          <StatCard
            label="Avg. Platform Rate"
            value="6.7%"
            icon={PieChart}
            variant="indigo"
          />
          <StatCard
            label="Highest Earner"
            value="Electronics"
            icon={Smartphone}
            variant="gold"
          />
        </div>

        {/* INFO CARD */}
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-start gap-3">
          <div className="bg-indigo-100 p-2 rounded text-indigo-600">
            <Settings size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-indigo-900">
              Pricing Strategy Note
            </h3>
            <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
              Categories with lower margins (e.g., Electronics) typically have
              lower commission rates (3-5%), while high-margin categories (e.g.,
              Fashion, Art) can sustain higher rates (8-15%).
            </p>
          </div>
        </div>

        {/* TABS */}
        <Tabs defaultValue="active" className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                {
                  value: "active",
                  label: "Active Categories",
                  count: 5,
                  variant: "emerald",
                },
                {
                  value: "archived",
                  label: "Archived",
                  count: 0,
                  variant: "indigo",
                },
              ]}
            />
          </div>

          {/* TAB 1: ACTIVE RATES */}
          <TabsContent value="active">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <DataTable columns={commissionColumns} data={COMMISSION_DATA} />
            </div>
          </TabsContent>

          <TabsContent value="archived">
            <div className="h-40 flex items-center justify-center text-zinc-400 text-sm">
              No archived categories found.
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
