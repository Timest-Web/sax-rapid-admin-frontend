/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PROMOTION_PACKAGES, ACTIVE_PROMOTIONS } from "@/src/lib/dummy_data";
import { adColumns } from "./column";
import { PackageModal } from "@/components/package-modal";
import { Megaphone, Zap, BarChart} from "lucide-react";
import { FilterTabs } from "@/components/tabs/filter-tab";

export default function PromotionsView() {
  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Platform / Ads & Promotions
          </h1>
        </div>
        <PackageModal />
      </header>

      <main className="p-6 max-w-400 mx-auto space-y-8">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AdMetric label="Active Campaigns" value="12" icon={Megaphone} />
          <AdMetric
            label="Ad Revenue (MTD)"
            value="₦450,000"
            icon={BarChart}
            color="text-emerald-600"
          />
          <AdMetric
            label="Avg. Click Rate"
            value="4.2%"
            icon={Zap}
            color="text-[#EAB308]"
          />
        </div>

        {/* TABS */}
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
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <DataTable columns={adColumns} data={ACTIVE_PROMOTIONS} />
            </div>
          </TabsContent>

          {/* TAB 2: PRICING CONFIG */}
          <TabsContent value="packages">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {PROMOTION_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white border border-zinc-200 rounded-xl p-6 flex flex-col justify-between h-48 relative overflow-hidden group hover:border-sax-gold transition-colors"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PackageModal initialData={pkg} />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-zinc-900">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-zinc-500 font-mono mt-1">
                      {pkg.duration} Duration
                    </p>
                  </div>

                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-bold font-mono text-zinc-900">
                      {pkg.price}
                    </p>
                    <span className="text-[10px] uppercase font-bold bg-zinc-100 px-2 py-1 rounded text-zinc-500">
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

function AdMetric({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-4 border border-zinc-200 rounded-lg shadow-sm flex items-center justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
          {label}
        </p>
        <p
          className={`text-2xl font-bold font-mono mt-1 ${color || "text-zinc-900"}`}
        >
          {value}
        </p>
      </div>
      <div className="h-10 w-10 rounded bg-zinc-50 flex items-center justify-center text-zinc-400">
        <Icon size={20} />
      </div>
    </div>
  );
}
