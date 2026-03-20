"use client";

import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./column";
import { BUYERS } from "@/src/lib/dummy_data";


export default function BuyersView() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans">
      
      {/* 1. Reusable Header */}
      <PageHeader 
        title="User Management / Buyers" 
        actionLabel="Add New Buyer" 
      />

      <main className="p-6 space-y-6 max-w-400 mx-auto">
        
        {/* 2. Mini Stats (Could be a component too) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricBox label="Total Buyers" value="12,450" color="text-zinc-900" />
          <MetricBox label="New This Month" value="+145" color="text-emerald-600" />
          <MetricBox label="Active Now" value="842" color="text-[#EAB308]" />
        </div>

        {/* 3. The Reusable Table */}
        <DataTable columns={columns} data={BUYERS} />

      </main>
    </div>
  );
}

function MetricBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white p-4 border border-zinc-200 rounded-lg shadow-sm">
      <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">{label}</p>
      <p className={`text-2xl font-bold font-mono mt-1 ${color}`}>{value}</p>
    </div>
  );
}