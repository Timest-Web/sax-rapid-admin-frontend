/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PAYOUT_REQUESTS } from "@/src/lib/dummy_data";
import { payoutColumns } from "./column";
import { AlertCircle, History, CheckCircle2 } from "lucide-react";

export default function PayoutsView() {
  const pending = PAYOUT_REQUESTS.filter((p) => p.status === "Pending");
  const history = PAYOUT_REQUESTS.filter((p) => p.status !== "Pending");

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Finance / Payouts
          </h1>
        </div>
        <Button variant="outline" size="sm">
          Export CSV
        </Button>
      </header>

      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PayoutMetric
            label="Pending Requests"
            value={String(pending.length)}
            icon={AlertCircle}
            color="text-[#EAB308]"
          />
          <PayoutMetric
            label="Processed Today"
            value="12"
            icon={CheckCircle2}
            color="text-emerald-600"
          />
          <PayoutMetric
            label="Total Disbursed"
            value="₦45.2M"
            icon={History}
            color="text-zinc-900"
          />
        </div>

        {/* TABS */}
        <Tabs defaultValue="pending" className="w-full flex flex-col">
          <div className="flex items-center justify-between">
            <TabsList className="bg-white border border-zinc-200 h-10 p-1">
              <TabsTrigger
                value="pending"
                className="text-xs uppercase tracking-wide data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"
              >
                Queue{" "}
                <span className="ml-2 bg-amber-200 text-amber-800 px-1.5 rounded-full text-[9px]">
                  {pending.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="text-xs uppercase tracking-wide"
              >
                History
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-4 bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
            <TabsContent value="pending" className="m-0">
              {pending.length > 0 ? (
                <DataTable columns={payoutColumns} data={pending} />
              ) : (
                <div className="p-12 text-center text-zinc-400 font-mono text-sm">
                  No pending requests.
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="m-0">
              <DataTable columns={payoutColumns} data={history} />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}

function PayoutMetric({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-4 border border-zinc-200 rounded-lg shadow-sm flex items-center justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
          {label}
        </p>
        <p className={`text-2xl font-bold font-mono mt-1 ${color}`}>{value}</p>
      </div>
      <div className="h-10 w-10 rounded bg-zinc-50 flex items-center justify-center text-zinc-400">
        <Icon size={20} />
      </div>
    </div>
  );
}
