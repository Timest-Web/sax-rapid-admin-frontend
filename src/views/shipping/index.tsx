"use client";

import { useMemo, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Truck,
  Percent,
  CalendarDays,
  Settings2,
  Star,
} from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";

import { getProviderColumns } from "./column";
import { ManageProviderModal, ConfirmDeleteProviderModal } from "./actions";

import type { ShippingPartner } from "@/src/features/shipping/api";
import {
  useShippingStats,
  useShippingPartners,
  useCreateShippingPartner,
  useUpdateShippingPartner,
  useDeleteShippingPartner,
} from "@/src/features/shipping/hooks";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

export default function ShippingView() {
  const statsQ = useShippingStats();
  const partnersQ = useShippingPartners();

  const createM = useCreateShippingPartner();
  const updateM = useUpdateShippingPartner();
  const deleteM = useDeleteShippingPartner();

  const [openEditor, setOpenEditor] = useState(false);
  const [editing, setEditing] = useState<ShippingPartner | null>(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState<ShippingPartner | null>(null);

  const partners = partnersQ.data ?? [];

  const columns = useMemo(
    () =>
      getProviderColumns({
        onEdit: (p) => {
          setEditing(p);
          setOpenEditor(true);
        },
        onDelete: (p) => {
          setDeleting(p);
          setOpenDelete(true);
        },
      }),
    [],
  );

  const onTimeRate = statsQ.data?.onTimeDeliveryRate;
  const avgDays = statsQ.data?.averageDeliveryDays;

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
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

      <main className="p-6 max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Active Shipments"
            value={statsQ.data ? String(statsQ.data.activeShipments) : "—"}
            icon={Truck}
            variant="default"
          />
          <StatCard
            label="On-time Rate"
            value={statsQ.data ? `${Number(onTimeRate ?? 0).toFixed(0)}%` : "—"}
            icon={Percent}
            variant="emerald"
          />
          <StatCard
            label="Avg Delivery Days"
            value={statsQ.data ? String(avgDays ?? "—") : "—"}
            icon={CalendarDays}
            variant="indigo"
          />
          <StatCard
            label="Total Partners"
            value={statsQ.data ? String(statsQ.data.totalPartners) : "—"}
            icon={Star}
            variant="amber"
          />
        </div>

        <Tabs defaultValue="providers" className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                {
                  value: "providers",
                  label: "Logistics Partners",
                  count: partners.length,
                  variant: "indigo",
                },
              ]}
            />
          </div>

          <TabsContent value="providers">
            <div className="mt-6 space-y-4">
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setEditing(null);
                    setOpenEditor(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-xs text-white"
                >
                  <Plus size={16} className="mr-2" /> Connect Provider
                </Button>
              </div>

              <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
                {partnersQ.isLoading ? (
                  <TableSkeleton columns={columns.length} rows={5} />
                ) : partnersQ.isError ? (
                  <div className="p-6 text-sm text-rose-600">
                    Failed to load partners.
                  </div>
                ) : (
                  <DataTable columns={columns} data={partners} />
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Create/Edit modal */}
      <ManageProviderModal
        open={openEditor}
        onOpenChange={setOpenEditor}
        initial={editing}
        isSaving={createM.isPending || updateM.isPending}
        onCreate={(payload) => {
          createM.mutate(payload, { onSuccess: () => setOpenEditor(false) });
        }}
        onUpdate={(partnerId, payload) => {
          updateM.mutate(
            { partnerId, payload },
            { onSuccess: () => setOpenEditor(false) },
          );
        }}
      />

      {/* Delete confirm modal */}
      <ConfirmDeleteProviderModal
        open={openDelete}
        onOpenChange={setOpenDelete}
        partner={deleting}
        isDeleting={deleteM.isPending}
        onConfirm={(partnerId) => {
          deleteM.mutate(partnerId, {
            onSuccess: () => {
              setOpenDelete(false);
              setDeleting(null);
            },
          });
        }}
      />
    </div>
  );
}
