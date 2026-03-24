"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
// import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productColumns } from "./column";
import { Package, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PRODUCTS } from "@/src/lib/dummy_data";
import { StatCard } from "@/components/cards/stat-card";

export default function ProductsView() {
  const pendingProducts = PRODUCTS.filter((p) => p.status === "Pending");
  const activeProducts = PRODUCTS.filter((p) => p.status === "Active");

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Marketplace / Products
          </h1>
        </div>
      </header>

      <main className="p-6 max-w-400 mx-auto space-y-6">
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Inventory"
            value="45,200"
            icon={Package}
            variant="gold"
          />
          <StatCard
            label="Moderation Queue"
            value="12"
            icon={AlertTriangle}
            variant="rose"
          />
          <StatCard
            label="Live Products"
            value="44,800"
            icon={CheckCircle2}
            variant="emerald"
          />
        </div>

        {/* MAIN TABS */}
        <div className="space-y-4">
          <Tabs defaultValue="all" className="w-full flex flex-col">
            <div className="flex items-center justify-between">
              <TabsList className="bg-white border border-zinc-200 h-10 p-1">
                <TabsTrigger
                  value="all"
                  className="text-xs uppercase tracking-wide"
                >
                  All Inventory
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="text-xs uppercase tracking-wide data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"
                >
                  Needs Approval{" "}
                  <span className="ml-2 bg-amber-200 text-amber-800 px-1.5 rounded-full text-[9px]">
                    {pendingProducts.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="rejected"
                  className="text-xs uppercase tracking-wide"
                >
                  Rejected
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="mt-4 bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
              <TabsContent value="all" className="m-0">
                <DataTable columns={productColumns} data={PRODUCTS} />
              </TabsContent>

              <TabsContent value="pending" className="m-0">
                <DataTable columns={productColumns} data={pendingProducts} />
              </TabsContent>

              <TabsContent value="rejected" className="m-0">
                <div className="p-12 text-center text-zinc-400 font-mono text-sm">
                  No rejected items in history.
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}


