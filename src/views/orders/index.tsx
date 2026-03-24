/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { orderColumns } from "./column";
import { Package, Truck, CheckCircle2, AlertTriangle } from "lucide-react";
import { ORDERS } from "@/src/lib/dummy_data";

export default function OrdersView() {
  const processing = ORDERS.filter((o) => o.status === "Processing");
  const disputes = ORDERS.filter((o) => o.status === "Dispute");

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Marketplace / Orders
          </h1>
        </div>
        <Button variant="outline" size="sm">
          Export Report
        </Button>
      </header>

      <main className="p-6 max-w-400 mx-auto space-y-6">
        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricBox
            label="All Orders"
            value="9,731"
            icon={Package}
            gradient="from-slate-50 via-blue-50 to-indigo-100"
            iconBg="bg-indigo-100"
            color="text-indigo-700"
            borderColor="border-indigo-200/60"
          />
          <MetricBox
            label="Processing"
            value="45"
            icon={Truck}
            gradient="from-orange-50 via-amber-50 to-yellow-100"
            iconBg="bg-amber-100"
            color="text-amber-700"
            borderColor="border-amber-200/60"
          />
          <MetricBox
            label="Completed"
            value="9,500"
            icon={CheckCircle2}
            gradient="from-green-50 via-emerald-50 to-teal-100"
            iconBg="bg-emerald-100"
            color="text-emerald-700"
            borderColor="border-emerald-200/60"
          />
          <MetricBox
            label="Disputes"
            value="12"
            icon={AlertTriangle}
            gradient="from-red-50 via-rose-50 to-pink-100"
            iconBg="bg-rose-100"
            color="text-rose-700"
            borderColor="border-rose-200/60"
          />
        </div>

        {/* TABS & TABLE */}
        <Tabs defaultValue="all" className="w-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-white border border-zinc-200 h-10 p-1">
              <TabsTrigger
                value="all"
                className="text-xs uppercase tracking-wide"
              >
                All Orders
              </TabsTrigger>
              <TabsTrigger
                value="processing"
                className="text-xs uppercase tracking-wide"
              >
                Processing
              </TabsTrigger>
              <TabsTrigger
                value="disputes"
                className="text-xs uppercase tracking-wide data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700"
              >
                Disputes{" "}
                <span className="ml-2 bg-rose-200 text-rose-800 px-1.5 rounded-full text-[9px]">
                  {disputes.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
            <TabsContent value="all" className="m-0">
              <DataTable columns={orderColumns} data={ORDERS} />
            </TabsContent>
            <TabsContent value="processing" className="m-0">
              <DataTable columns={orderColumns} data={processing} />
            </TabsContent>
            <TabsContent value="disputes" className="m-0">
              <DataTable columns={orderColumns} data={disputes} />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}

function MetricBox({
  label,
  value,
  icon: Icon,
  gradient = "from-white to-zinc-50",
  iconBg = "bg-zinc-100",
  color = "text-zinc-900",
  borderColor = "border-zinc-200",
}: any) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} p-4 border ${borderColor} rounded-lg shadow-sm flex items-center justify-between transition-shadow hover:shadow-md`}
    >
      <div>
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
          {label}
        </p>
        <p className={`text-2xl font-bold font-mono mt-1 ${color}`}>{value}</p>
      </div>
      <div
        className={`h-10 w-10 rounded-lg ${iconBg} flex items-center justify-center`}
      >
        <Icon size={20} className={color} />
      </div>
    </div>
  );
}