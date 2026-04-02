"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PROMOTION_PACKAGES, ACTIVE_PROMOTIONS } from "@/src/lib/dummy_data";
import { adColumns } from "./column";
import { PackageModal } from "@/components/package-modal";
import { Megaphone, Zap, BarChart } from "lucide-react";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { StatCard } from "@/components/cards/stat-card";

export default function PromotionsView() {
  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* ─── HEADER ─── */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Platform / Ads & Promotions
          </h1>
        </div>
        {/* Render Package Modal in "Add" Mode */}
        <PackageModal />
      </header>

      <main className="p-6 max-w-[1600px] mx-auto space-y-8">
        {/* ─── STATS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Active Campaigns"
            value="12"
            icon={Megaphone}
            variant="emerald"
          />
          <StatCard
            label="Ad Revenue (MTD)"
            value="₦450,000"
            icon={BarChart}
            variant="cyan"
          />
          <StatCard
            label="Avg. Click Rate"
            value="4.2%"
            icon={Zap}
            variant="amber"
          />
        </div>

        {/* ─── TABS ─── */}
        <Tabs defaultValue="active" className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                {
                  value: "active",
                  label: "Active Ads",
                  count: 12,
                  variant: "emerald",
                },
                {
                  value: "packages",
                  label: "Pricing Packages",
                  count: 45,
                  variant: "indigo",
                },
              ]}
            />
          </div>

          {/* TAB 1: RUNNING ADS */}
          <TabsContent value="active">
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden mt-6">
              <DataTable columns={adColumns} data={ACTIVE_PROMOTIONS} />
            </div>
          </TabsContent>

          {/* TAB 2: PRICING CONFIG */}
          <TabsContent value="packages">
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {PROMOTION_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between h-52 relative overflow-hidden group hover:border-[#D4AF37] hover:shadow-xl transition-all duration-300"
                >
                  {/* Premium Gold Gradient Top Bar on Hover */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-zinc-900 via-[#D4AF37] to-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {/* Render Package Modal in "Edit" Mode */}
                    <PackageModal initialData={pkg} />
                  </div>

                  <div className="relative z-0">
                    <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 mb-4 group-hover:bg-zinc-900 group-hover:text-[#D4AF37] group-hover:border-zinc-900 transition-colors shadow-sm">
                      <Megaphone size={18} />
                    </div>
                    <h3 className="font-bold text-lg text-zinc-900 font-display">
                      {pkg.name}
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                      {pkg.duration} Duration
                    </p>
                  </div>

                  <div className="flex items-end justify-between relative z-0 mt-4">
                    <p className="text-2xl font-bold font-mono text-zinc-900">
                      {pkg.price}
                    </p>
                    <span
                      className={`text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg tracking-widest ${
                        pkg.status?.toLowerCase() === "active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {pkg.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}