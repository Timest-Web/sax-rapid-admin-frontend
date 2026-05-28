"use client";

import { useMemo, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Crown, Database, Activity, Filter, X } from "lucide-react";
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
  // your mock rates
  if (to === "ZAR") return amount * 0.0117;
  if (to === "USD") return amount / 1500;
  return amount;
}

function isActive(plan: SubscriptionPlan) {
  return plan.isActive ?? true;
}

export default function SubscriptionsView() {
  // fetch all plans (Admin)
  const plansQ = useSubscriptionPlans({ activeOnly: false });

  const createPlan = useCreateSubscriptionPlan();
  const updatePlan = useUpdateSubscriptionPlan();
  const activate = useActivateSubscriptionPlan();
  const deactivate = useDeactivateSubscriptionPlan();

  // UI state
  const [globalCurrency, setGlobalCurrency] = useState("NGN");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterDate, setFilterDate] = useState(""); // API doesn't provide createdAt in sample

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  const plans = plansQ.data ?? [];

  // Filters
  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      const status = isActive(p) ? "active" : "inactive";
      const matchStatus = filterStatus === "all" || status === filterStatus;
      const matchPlan = filterPlan === "all" || p.name === filterPlan;

      // only works if API returns createdAt
      const matchDate = !filterDate || (p.createdAt ? p.createdAt.slice(0, 10) === filterDate : true);

      return matchStatus && matchPlan && matchDate;
    });
  }, [plans, filterStatus, filterPlan, filterDate]);

  // Display mapping (currency conversion for UI only)
  const displayPlans: SubscriptionPlanRow[] = useMemo(() => {
    return filteredPlans.map((p) => ({
      ...p,
      currency: globalCurrency,
      monthlyDisplay: convertFromNGN(p.monthlyPrice, globalCurrency),
      yearlyDisplay: convertFromNGN(p.yearlyPrice, globalCurrency),
    }));
  }, [filteredPlans, globalCurrency]);

  const totalPlans = plans.length;
  const activePlans = plans.filter((p) => isActive(p)).length;

  const columns = useMemo(
    () =>
      getPlanColumns({
        onEdit: (row) => {
          // Edit should use original values (NGN from API), not converted
          const original = plans.find((p) => p.id === row.id) ?? row;
          setEditingPlan(original);
          setIsModalOpen(true);
        },
        onToggleStatus: (row) => {
          const currentlyActive = isActive(row);
          if (currentlyActive) deactivate.mutate(row.id);
          else activate.mutate(row.id);
        },
      }),
    [plans, activate, deactivate],
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
          <StatCard label="Total Plans" value={plansQ.isLoading ? "—" : String(totalPlans)} icon={Database} variant="default" />
          <StatCard label="Active Plans" value={plansQ.isLoading ? "—" : String(activePlans)} icon={Activity} variant="emerald" />
          <StatCard label="Total Subscribers" value="—" icon={Crown} variant="gold" />
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-sm border border-zinc-200 flex flex-wrap gap-3 items-center">
          <div className="flex items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest mr-2">
            <Filter className="mr-2 h-3.5 w-3.5" /> Filters:
          </div>

          <Select value={filterPlan} onValueChange={setFilterPlan}>
            <SelectTrigger className="w-[220px] h-10 text-xs font-bold bg-zinc-50/50 border-zinc-200 rounded-xl text-zinc-600">
              <SelectValue placeholder="All Plans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              {plans.map((p) => (
                <SelectItem key={p.id} value={p.name}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px] h-10 text-xs font-bold uppercase tracking-wider bg-zinc-50/50 border-zinc-200 rounded-xl text-zinc-600">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Only meaningful if API returns createdAt */}
          <div className="relative">
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="h-10 w-[170px] text-xs font-mono bg-zinc-50/50 border-zinc-200 rounded-xl text-zinc-600"
            />
          </div>

          {(filterPlan !== "all" || filterStatus !== "all" || filterDate !== "") && (
            <Button
              variant="ghost"
              onClick={() => {
                setFilterPlan("all");
                setFilterStatus("all");
                setFilterDate("");
              }}
              className="h-10 text-xs font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-xl px-4 ml-auto"
            >
              <X size={14} className="mr-2" /> Clear
            </Button>
          )}
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          {plansQ.isLoading ? (
            <TableSkeleton columns={columns.length} rows={10} withToolbar={false} />
          ) : plansQ.isError ? (
            <div className="p-6 text-sm text-rose-600">Failed to load plans.</div>
          ) : (
            <DataTable columns={columns} data={displayPlans} />
          )}
        </div>
      </main>

      <SubscriptionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialData={editingPlan}
        isSubmitting={createPlan.isPending || updatePlan.isPending}
        onSubmit={(payload) => {
          if (editingPlan) {
            updatePlan.mutate({ planId: editingPlan.id, payload }, { onSuccess: () => setIsModalOpen(false) });
          } else {
            createPlan.mutate(payload, { onSuccess: () => setIsModalOpen(false) });
          }
        }}
      />
    </div>
  );
}