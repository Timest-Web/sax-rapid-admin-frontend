/* eslint-disable react-hooks/preserve-manual-memoization */
"use client";

import { useState, useMemo } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { Button } from "@/components/ui/button";
import { Plus, Truck, Globe, Settings2, Star } from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";
import { getProviderColumns } from "./column";
import { ManageProviderModal } from "./actions";
import { DeliveryProvider } from "./types";

// --- INITIAL DUMMY DATA ---
const INITIAL_PROVIDERS: DeliveryProvider[] = [
  {
    id: "1",
    name: "Uber",
    type: "integrated",
    rating: 4.5,
    activeShipments: 124,
    status: "active",
    logo: "UB",
  },
  {
    id: "2",
    name: "Bolt",
    type: "integrated",
    rating: 4.8,
    activeShipments: 45,
    status: "active",
    logo: "BO",
  },
];

export default function ShippingView() {
  // --- STATE FOR INTERACTIVITY ---
  const [providers, setProviders] =
    useState<DeliveryProvider[]>(INITIAL_PROVIDERS);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);

  // Handlers
  const handleAddProvider = (newProvider: DeliveryProvider) => {
    setProviders([newProvider, ...providers]);
  };

  const handleDeleteProvider = (id: string) => {
    setProviders(providers.filter((provider) => provider.id !== id));
  };

  // Dynamic Statistics
  const totalShipments = providers.reduce(
    (sum, p) => sum + p.activeShipments,
    0,
  );
  const avgRating =
    providers.length > 0
      ? (
          providers.reduce((sum, p) => sum + p.rating, 0) / providers.length
        ).toFixed(1)
      : "0.0";

  // Init columns with the delete handler
  const columns = useMemo(
    () => getProviderColumns(handleDeleteProvider),
    [providers],
  );

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Platform / Shipping & Delivery
          </h1>
        </div>
        <Button variant="outline" size="sm" className="gap-2 text-xs">
          <Settings2 size={14} /> Global Shipping Rules
        </Button>
      </header>

      <main className="p-6 max-w-400 mx-auto space-y-8">
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Active Partners"
            value={providers
              .filter((p) => p.status === "active")
              .length.toString()}
            icon={Truck}
            variant="default"
          />
          <StatCard
            label="Total Active Shipments"
            value={totalShipments.toString()}
            icon={Globe}
            variant="indigo"
          />
          <StatCard
            label="Avg. Partner Rating"
            value={`${avgRating} / 5.0`}
            icon={Star}
            variant="emerald"
          />
        </div>

        {/* TABS & ACTIONS */}
        <Tabs defaultValue="providers" className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                {
                  value: "providers",
                  label: "Logistics Partners",
                  count: providers.length,
                  variant: "indigo",
                },
              ]}
            />
          </div>

          {/* TAB: PROVIDERS */}
          <TabsContent value="providers">
            <div className="mt-6 space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() => setIsProviderModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-xs text-white"
                >
                  <Plus size={16} className="mr-2" /> Connect Provider
                </Button>
              </div>
              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
                <DataTable columns={columns} data={providers}  />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* MODALS */}
      <ManageProviderModal
        isOpen={isProviderModalOpen}
        onClose={() => setIsProviderModalOpen(false)}
        onSave={handleAddProvider}
      />
    </div>
  );
}
