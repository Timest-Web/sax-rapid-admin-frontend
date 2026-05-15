"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { useParams } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/cards/status-badge";
import { ArrowLeft, Power, Crown, Tag } from "lucide-react";

import {
    useActivateSubscriptionPlan,
  useActiveSubscriptionPlans,
  useDeactivateSubscriptionPlan,
  useSubscriptionPlan,
} from "@/src/features/subscriptions/hooks";

function money(amount: number, currency = "NGN") {
  const symbol = currency === "NGN" ? "₦" : currency === "ZAR" ? "R" : currency === "USD" ? "$" : "";
  return `${symbol}${Number(amount ?? 0).toLocaleString()}`;
}

function FeaturePill({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
        on
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-zinc-100 text-zinc-600 border-zinc-200",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

export default function SubscriptionPlanDetailsView() {
  const params = useParams();
  const raw = (params as any)?.planId;
  const planId = decodeURIComponent(Array.isArray(raw) ? raw[0] : raw ?? "");

  const planQ = useSubscriptionPlan(planId);
  const activeQ = useActiveSubscriptionPlans();

  const activate = useActivateSubscriptionPlan();
  const deactivate = useDeactivateSubscriptionPlan();

  const plan = planQ.data;

  const isActive = (() => {
    const activeIds = new Set((activeQ.data ?? []).map((p) => p.id));
    return plan ? activeIds.has(plan.id) : false;
  })();

  if (!planId) {
    return <div className="p-6 text-sm text-rose-600">Missing planId</div>;
  }

  if (planQ.isLoading) {
    return <div className="p-6 text-sm text-zinc-500">Loading plan…</div>;
  }

  if (planQ.isError || !plan) {
    return (
      <div className="p-6">
        <p className="text-sm text-rose-600 font-semibold">Failed to load plan.</p>
        <Link href="/admin/subscriptions" className="text-xs underline text-zinc-700 mt-3 inline-block">
          Back to Plans
        </Link>
      </div>
    );
  }

  const statusLabel = isActive ? "Active" : "Inactive";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-10">
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <Link href="/admin/subscriptions" className="hover:text-zinc-900 transition-colors flex items-center gap-1">
              <ArrowLeft size={14} /> Subscriptions
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-mono">{plan.name}</span>
            <StatusBadge status={statusLabel} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isActive ? (
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-bold uppercase tracking-wider rounded-lg border-zinc-200 hover:bg-rose-50 hover:text-rose-700"
              onClick={() => deactivate.mutate(plan.id)}
              disabled={deactivate.isPending || activate.isPending}
            >
              <Power className="mr-2 h-3.5 w-3.5" />
              Deactivate
            </Button>
          ) : (
            <Button
              size="sm"
              className="h-9 text-xs font-bold uppercase tracking-wider rounded-lg bg-zinc-900 text-[#D4AF37]"
              onClick={() => activate.mutate(plan.id)}
              disabled={deactivate.isPending || activate.isPending}
            >
              <Power className="mr-2 h-3.5 w-3.5" />
              Activate
            </Button>
          )}
        </div>
      </header>

      <main className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Top card */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 via-[#D4AF37] to-zinc-900" />
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-zinc-900 text-[#D4AF37] flex items-center justify-center">
                  <Crown size={18} />
                </div>
                <div>
                  <h1 className="text-lg font-bold uppercase tracking-widest font-display">
                    {plan.name}
                  </h1>
                  <p className="text-xs text-zinc-500 mt-1">{plan.description}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <FeaturePill on={plan.canBoostProducts} label="Boost" />
                <FeaturePill on={plan.hasAnalytics} label="Analytics" />
                <FeaturePill on={plan.hasPrioritySupport} label="Priority Support" />
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Plan ID</p>
              <p className="font-mono text-xs text-zinc-700">{plan.id}</p>
            </div>
          </div>
        </div>

        {/* Pricing + Limits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 text-zinc-600">
              <Tag className="h-4 w-4 text-zinc-400" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Monthly</p>
            </div>
            <p className="mt-2 text-2xl font-mono font-bold text-zinc-900">
              {money(plan.monthlyPrice, "NGN")}
            </p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 text-zinc-600">
              <Tag className="h-4 w-4 text-zinc-400" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Yearly</p>
            </div>
            <p className="mt-2 text-2xl font-mono font-bold text-zinc-900">
              {money(plan.yearlyPrice, "NGN")}
            </p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Max Products</p>
            <p className="mt-2 text-2xl font-mono font-bold text-emerald-700">
              {plan.maxProducts}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">Display order: {plan.displayOrder}</p>
          </div>
        </div>
      </main>
    </div>
  );
}