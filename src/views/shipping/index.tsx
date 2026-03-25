"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { Button } from "@/components/ui/button";
import { Plus, Map, Truck, Globe, Settings2 } from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";
import { zoneColumns, providerColumns } from "./column";
import { ManageZoneModal, ManageProviderModal } from "./actions";
import { ShippingZone, DeliveryProvider } from "./types";

// --- INITIAL DUMMY DATA ---
const INITIAL_ZONES: ShippingZone[] = [
  {
    id: "1",
    name: "Lagos (Island)",
    baseFee: 1500,
    minDays: 1,
    maxDays: 2,
    status: "active",
  },
  {
    id: "2",
    name: "Lagos (Mainland)",
    baseFee: 1200,
    minDays: 1,
    maxDays: 2,
    status: "active",
  },
  {
    id: "3",
    name: "Abuja (FCT)",
    baseFee: 3500,
    minDays: 2,
    maxDays: 4,
    status: "active",
  },
  {
    id: "4",
    name: "Port Harcourt",
    baseFee: 4000,
    minDays: 3,
    maxDays: 5,
    status: "active",
  },
  {
    id: "5",
    name: "Nationwide (Remote)",
    baseFee: 7500,
    minDays: 5,
    maxDays: 10,
    status: "inactive",
  },
];

const INITIAL_PROVIDERS: DeliveryProvider[] = [
  {
    id: "1",
    name: "GIG Logistics",
    type: "integrated",
    rating: 4.5,
    activeShipments: 124,
    status: "active",
    logo: "GI",
  },
  {
    id: "2",
    name: "DHL Express",
    type: "integrated",
    rating: 4.8,
    activeShipments: 45,
    status: "active",
    logo: "DH",
  },
  {
    id: "3",
    name: "Local Riders Co.",
    type: "manual",
    rating: 3.9,
    activeShipments: 212,
    status: "active",
    logo: "LR",
  },
];

export default function ShippingView() {
  // --- STATE FOR INTERACTIVITY ---
  const [zones, setZones] = useState<ShippingZone[]>(INITIAL_ZONES);
  const [providers, setProviders] =
    useState<DeliveryProvider[]>(INITIAL_PROVIDERS);

  // Modal States
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);

  // Handlers
  const handleAddZone = (newZone: ShippingZone) => {
    setZones([newZone, ...zones]);
  };

  const handleAddProvider = (newProvider: DeliveryProvider) => {
    setProviders([newProvider, ...providers]);
  };

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
            label="Active Zones"
            value={zones.filter((z) => z.status === "active").length.toString()}
            icon={Map}
            variant="default"
          />
          <StatCard
            label="Partner Fleet"
            value={providers.length.toString()}
            icon={Truck}
            variant="indigo"
          />
          <StatCard
            label="Avg. Delivery Cost"
            value="₦2,850"
            icon={Globe}
            variant="emerald"
          />
        </div>

        {/* TABS & ACTIONS */}
        <Tabs defaultValue="zones" className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                {
                  value: "zones",
                  label: "Delivery Zones & Rates",
                  count: zones.length,
                  variant: "amber",
                },
                {
                  value: "providers",
                  label: "Logistics Partners",
                  count: providers.length,
                  variant: "indigo",
                },
              ]}
            />
          </div>

          {/* TAB 1: ZONES */}
          <TabsContent value="zones">
            <div className="mt-6 space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() => setIsZoneModalOpen(true)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-xs"
                >
                  <Plus size={16} className="mr-2" /> Add New Zone
                </Button>
              </div>
              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
                <DataTable columns={zoneColumns} data={zones} />
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: PROVIDERS */}
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
                <DataTable columns={providerColumns} data={providers} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* MODALS */}
      <ManageZoneModal
        isOpen={isZoneModalOpen}
        onClose={() => setIsZoneModalOpen(false)}
        onSave={handleAddZone}
      />

      <ManageProviderModal
        isOpen={isProviderModalOpen}
        onClose={() => setIsProviderModalOpen(false)}
        onSave={handleAddProvider}
      />
    </div>
  );
}
