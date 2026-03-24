/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_PLANS, SUBSCRIBERS } from "@/src/lib/dummy_data";
import { PlanEditorSheet } from "@/components/plan-editor";
import { Plus, Check, Edit2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/cards/status-badge";

// Subscriber Columns
const subscriberColumns: ColumnDef<any>[] = [
  {
    accessorKey: "vendor",
    header: "Vendor Name",
    cell: ({ row }) => <span className="font-bold">{row.original.vendor}</span>,
  },
  {
    accessorKey: "plan",
    header: "Current Plan",
    cell: ({ row }) => (
      <span className="font-mono text-xs bg-zinc-100 px-2 py-1 rounded">
        {row.original.plan}
      </span>
    ),
  },
  {
    accessorKey: "nextBilling",
    header: "Next Billing",
    cell: ({ row }) => (
      <span className="font-mono text-zinc-500 text-xs">
        {row.original.nextBilling}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];

export default function SubscriptionsView() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const handleEdit = (plan: any) => {
    setSelectedPlan(plan);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setSelectedPlan(null);
    setIsEditorOpen(true);
  };

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Finance / Subscriptions
          </h1>
        </div>
        <Button variant="default" size="sm" onClick={handleCreate}>
          <Plus className="mr-2 h-3 w-3" /> Create Plan
        </Button>
      </header>

      <main className="p-6 max-w-[1600px] mx-auto space-y-8">
        {/* ─── PLANS PREVIEW ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`p-6 rounded-xl border relative flex flex-col justify-between h-full ${plan.color}`}
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => handleEdit(plan)}
                  className="text-zinc-400 hover:text-zinc-900"
                >
                  <Edit2 size={16} />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold font-display">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2 mb-6">
                  <span className="text-3xl font-bold font-mono">
                    {plan.price}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">
                    / {plan.interval}
                  </span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feat, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-xs font-medium text-zinc-700"
                    >
                      <Check size={14} className="text-emerald-600" /> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-black/5 flex justify-between items-center">
                <span className="text-xs font-mono text-zinc-500">
                  {plan.subscribers} Vendors
                </span>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/50 border border-black/5`}
                >
                  {plan.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ─── SUBSCRIBERS LIST ─── */}
        <div className="space-y-4">
          <h3 className="tech-label">Active Subscribers</h3>
          <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
            <DataTable
              columns={subscriberColumns}
              data={SUBSCRIBERS}
            />
          </div>
        </div>

        {/* SHEET */}
        <PlanEditorSheet
          open={isEditorOpen}
          onOpenChange={setIsEditorOpen}
          initialData={selectedPlan}
        />
      </main>
    </div>
  );
}
