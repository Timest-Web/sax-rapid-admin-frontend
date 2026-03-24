/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_PLANS, SUBSCRIBERS } from "@/src/lib/dummy_data";
import { PlanEditorSheet } from "@/components/plan-editor";
import { PlanCard, type PlanCardProps } from "@/components/cards/plan-card";
import { Plus } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/cards/status-badge";


const planVariantMap: Record<string, PlanCardProps["variant"]> = {
  Basi: "default",
  Standard: "indigo",
  Premium: "gold",
};

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

      <main className="p-6 max-w-400 mx-auto space-y-8">
        {/* ─── PLANS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              name={plan.name}
              price={plan.price}
              interval={plan.interval}
              features={plan.features}
              subscribers={plan.subscribers}
              status={plan.status}
              variant={planVariantMap[plan.name] ?? "default"}
              featured={plan.name === "Professional"}
              onEdit={() => handleEdit(plan)}
            />
          ))}
        </div>

        {/* ─── SUBSCRIBERS LIST ─── */}
        <div className="space-y-4">
          <h3 className="tech-label">Active Subscribers</h3>
          <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
            <DataTable columns={subscriberColumns} data={SUBSCRIBERS} />
          </div>
        </div>

        <PlanEditorSheet
          open={isEditorOpen}
          onOpenChange={setIsEditorOpen}
          initialData={selectedPlan}
        />
      </main>
    </div>
  );
}