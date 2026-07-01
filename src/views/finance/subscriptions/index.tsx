"use client";

import { useMemo, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Crown, Database, Activity } from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";

import { getPlanColumns, type SubscriptionPlanRow } from "./column";
import { SubscriptionModal } from "./modal";

import type { SubscriptionPlan } from "@/src/features/subscriptions/api";
import {
  useActivateSubscriptionPlan,
  useCreateSubscriptionPlan,
  useDeactivateSubscriptionPlan,
  useSubscriptionPlans,
  useUpdateSubscriptionPlan,
} from "@/src/features/subscriptions/hooks";

import { TableSkeleton } from "@/components/skeletons/table-skeleton";

function convertFromNGN(amount: number, to: string) {
  if (to === "ZAR") return amount * 0.0117;
  if (to === "USD") return amount / 1500;
  return amount;
}

export default function SubscriptionsView() {
  const [activeOnly, setActiveOnly] = useState<boolean>(false);
  const plansQ = useSubscriptionPlans({ activeOnly });
  const allPlansQ = useSubscriptionPlans({ activeOnly: false });

  const createPlan = useCreateSubscriptionPlan();
  const updatePlan = useUpdateSubscriptionPlan();
  const activate = useActivateSubscriptionPlan();
  const deactivate = useDeactivateSubscriptionPlan();

  // UI state
  const [globalCurrency, setGlobalCurrency] = useState("NGN");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  const allPlans = allPlansQ.data ?? [];
  const plans = plansQ.data ?? [];

  const totalPlans = allPlans.length;
  const activePlans = allPlans.filter((p) => p.isActive === true).length;

  const displayPlans: SubscriptionPlanRow[] = useMemo(() => {
    return plans.map((p) => ({
      ...p,
      currency: globalCurrency,
      monthlyDisplay: convertFromNGN(p.monthlyPrice, globalCurrency),
      yearlyDisplay: convertFromNGN(p.yearlyPrice, globalCurrency),
    }));
  }, [plans, globalCurrency]);

  const columns = useMemo(
    () =>
      getPlanColumns({
        onEdit: (row) => {
          const original = allPlans.find((p) => p.id === row.id) ?? row;
          setEditingPlan(original);
          setIsModalOpen(true);
        },
        onToggleStatus: (row) => {
          // Use isActive when present, otherwise assume "active" for toggle direction
          const assumedActive =
            typeof row.isActive === "boolean" ? row.isActive : true;

          if (assumedActive) deactivate.mutate(row.id);
          else activate.mutate(row.id);
        },
      }),
    [allPlans, activate, deactivate],
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-10">
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Finance / Subscriptions
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* DISPLAY currency (UI only) */}
          <Select value={globalCurrency} onValueChange={setGlobalCurrency}>
            <SelectTrigger className="h-9 w-28 bg-zinc-50 border-zinc-200 text-xs font-bold text-zinc-700 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NGN">NGN (₦)</SelectItem>
              <SelectItem value="ZAR">ZAR (R)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => {
              setEditingPlan(null);
              setIsModalOpen(true);
            }}
            className="h-9 text-xs font-bold uppercase tracking-wider bg-zinc-900 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-lg"
          >
            <Plus size={14} className="mr-2" /> Create Plan
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Plans"
            value={allPlansQ.isLoading ? "—" : String(totalPlans)}
            icon={Database}
            variant="default"
          />
          <StatCard
            label="Active Plans"
            value={allPlansQ.isLoading ? "—" : String(activePlans)}
            icon={Activity}
            variant="emerald"
          />
          <StatCard
            label="Total Subscribers"
            value="—"
            icon={Crown}
            variant="gold"
          />
        </div>

        {/* Only filter: activeOnly param */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-zinc-200 flex flex-wrap gap-3 items-center justify-between">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Filter:
          </div>

          <Select
            value={activeOnly ? "active" : "all"}
            onValueChange={(v) => setActiveOnly(v === "active")}
          >
            <SelectTrigger className="w-55 h-10 text-xs font-bold bg-zinc-50/50 border-zinc-200 rounded-xl text-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {plansQ.isLoading ? (
          <TableSkeleton columns={columns.length} rows={10} withToolbar={false} />
        ) : plansQ.isError ? (
          <div className="p-6 text-sm text-rose-600">Failed to load plans.</div>
        ) : (
          <DataTable columns={columns} data={displayPlans} />
        )}
      </main>

      <SubscriptionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialData={editingPlan}
        isSubmitting={createPlan.isPending || updatePlan.isPending}
        onSubmit={(payload) => {
          if (editingPlan) {
            updatePlan.mutate(
              { planId: editingPlan.id, payload },
              { onSuccess: () => setIsModalOpen(false) },
            );
          } else {
            createPlan.mutate(payload, {
              onSuccess: () => setIsModalOpen(false),
            });
          }
        }}
      />
    </div>
  );
}