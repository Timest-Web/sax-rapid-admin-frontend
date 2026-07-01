/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { StatCard } from "@/components/cards/stat-card";
import { Button } from "@/components/ui/button";

import { Megaphone, BarChart, Zap, Plus } from "lucide-react";

import { PROMOTION_PACKAGES } from "@/src/lib/dummy_data"; // keep packages for now
import { PackageModal } from "@/components/package-modal";

import { getCampaignColumns } from "./column";
import { CreateCampaignModal } from "./modal";

import {
  usePromotionStats,
  useCampaigns,
  useCreateCampaign,
  useUpdateCampaignStatus,
} from "@/src/features/promotions/hooks";

export default function PromotionsView() {
  const statsQ = usePromotionStats();
  const campaignsQ = useCampaigns({ PageNumber: 1, PageSize: 50 });

  const createM = useCreateCampaign();
  const statusM = useUpdateCampaignStatus();

  const [tab, setTab] = useState<"campaigns" | "packages">("campaigns");
  const [openCreate, setOpenCreate] = useState(false);

  const campaigns = campaignsQ.data ?? [];
  const currency = statsQ.data?.currency ?? "NGN";

  const columns = useMemo(
    () =>
      getCampaignColumns({
        onStatus: (c, status) => statusM.mutate({ campaignId: c.id, status }),
      }),
    [statusM],
  );

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

        <div className="flex items-center gap-3">
          {/* Your existing package modal (still useful for Packages tab) */}
          <PackageModal />

          <Button
            onClick={() => setOpenCreate(true)}
            className="bg-zinc-900 text-white hover:bg-[#D4AF37] hover:text-black text-xs"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-[1600px] mx-auto space-y-8">
        {/* STATS from backend */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Campaigns"
            value={statsQ.data ? String(statsQ.data.totalCampaigns) : "—"}
            icon={Megaphone}
            variant="default"
          />
          <StatCard
            label="Active Campaigns"
            value={statsQ.data ? String(statsQ.data.activeCampaigns) : "—"}
            icon={Megaphone}
            variant="emerald"
          />
          <StatCard
            label="Total Budget Spent"
            value={
              statsQ.data
                ? `${currency} ${Number(statsQ.data.totalBudgetSpent ?? 0).toLocaleString()}`
                : "—"
            }
            icon={BarChart}
            variant="cyan"
          />
          <StatCard
            label="Total Impressions"
            value={statsQ.data ? String(statsQ.data.totalImpressions ?? 0) : "—"}
            icon={Zap}
            variant="amber"
          />
        </div>

        {/* TABS */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                {
                  value: "campaigns",
                  label: "Campaigns",
                  count: campaigns.length,
                  variant: "emerald",
                },
                {
                  value: "packages",
                  label: "Pricing Packages",
                  count: PROMOTION_PACKAGES.length,
                  variant: "indigo",
                },
              ]}
            />
          </div>

          {/* TAB: CAMPAIGNS */}
          <TabsContent value="campaigns">
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden mt-6">
              {campaignsQ.isLoading ? (
                <div className="p-6 text-sm text-zinc-500">Loading campaigns…</div>
              ) : campaignsQ.isError ? (
                <div className="p-6 text-sm text-rose-600">
                  Failed to load campaigns.
                </div>
              ) : (
                <DataTable columns={columns} data={campaigns} />
              )}
            </div>
          </TabsContent>

          {/* TAB: PACKAGES (still your existing dummy UI) */}
          <TabsContent value="packages">
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {PROMOTION_PACKAGES.map((pkg: any) => (
                <div
                  key={pkg.id}
                  className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between h-52 relative overflow-hidden group hover:border-[#D4AF37] hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-[#D4AF37] to-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <PackageModal initialData={pkg} />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 font-display">
                      {pkg.name}
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                      {pkg.duration} Duration
                    </p>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    <p className="text-2xl font-bold font-mono text-zinc-900">
                      {pkg.price}
                    </p>
                    <span className="text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg tracking-widest bg-zinc-100 text-zinc-500">
                      {pkg.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Create campaign modal (ready even if backend 500 for now) */}
      <CreateCampaignModal
        open={openCreate}
        onOpenChange={setOpenCreate}
        isSaving={createM.isPending}
        onSubmit={(payload) => {
          createM.mutate(payload, {
            onSuccess: () => setOpenCreate(false),
          });
        }}
      />
    </div>
  );
}