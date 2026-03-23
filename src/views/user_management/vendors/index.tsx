/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Store, UserCheck, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VENDORS } from "@/src/lib/dummy_data";
import { vendorColumns } from "./column";

export default function VendorsView() {
  // Filter Data
  const pendingVendors = VENDORS.filter((v) => v.status === "Pending");
  const activeVendors = VENDORS.filter(
    (v) => v.status === "Active" || v.status === "Suspended",
  );

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Marketplace / Vendors
          </h1>
        </div>
        <Button variant="default" size="sm">
          Export Report
        </Button>
      </header>

      <main className="p-6 space-y-6 max-w-400 mx-auto">
        {/* METRICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VendorMetricBox
            label="Total Stores"
            value={String(VENDORS.length)}
            icon={Store}
            color="text-zinc-900"
          />
          <VendorMetricBox
            label="Active Vendors"
            value={String(activeVendors.length)}
            icon={UserCheck}
            color="text-emerald-600"
          />
          <VendorMetricBox
            label="Applications"
            value={String(pendingVendors.length)}
            icon={FileText}
            color="text-[#EAB308]"
          />
        </div>

        {/* MAIN TABS */}
        <div className="space-y-4">
          <Tabs defaultValue="all" className="w-full flex flex-col">
            <div className="flex items-center justify-between">
              <TabsList className="bg-white border border-zinc-200 h-10 p-1">
                <TabsTrigger
                  value="all"
                  className="text-xs uppercase tracking-wide data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-900"
                >
                  All Stores
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="text-xs uppercase tracking-wide data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                >
                  Active
                </TabsTrigger>
                <TabsTrigger
                  value="applications"
                  className="text-xs uppercase tracking-wide data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"
                >
                  Applications{" "}
                  <span className="ml-2 bg-amber-200 text-amber-800 px-1.5 rounded-full text-[9px]">
                    {pendingVendors.length}
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="mt-4 bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
              <TabsContent value="all" className="m-0">
                <DataTable columns={vendorColumns} data={VENDORS} />
              </TabsContent>

              <TabsContent value="active" className="m-0">
                <DataTable columns={vendorColumns} data={activeVendors} />
              </TabsContent>

              {/* THIS IS THE APPLICATION MODULE VIEW */}
              <TabsContent value="applications" className="m-0">
                <DataTable columns={vendorColumns} data={pendingVendors} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function VendorMetricBox({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-4 border border-zinc-200 rounded-lg shadow-sm flex items-center justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
          {label}
        </p>
        <p className={`text-2xl font-bold font-mono mt-1 ${color}`}>{value}</p>
      </div>
      <div className="h-10 w-10 rounded bg-zinc-50 flex items-center justify-center text-zinc-400">
        <Icon size={20} className={color} />
      </div>
    </div>
  );
}
