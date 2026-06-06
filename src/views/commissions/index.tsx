"use client";

import { useMemo, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DollarSign, PieChart, Smartphone, Settings } from "lucide-react";
import { FilterTabs } from "@/components/tabs/filter-tab";
import { StatCard } from "@/components/cards/stat-card";
import { Button } from "@/components/ui/button";

import { getCommissionColumns, type CategoryCommissionRow } from "./column";
import {
  useCategoryCommissions,
  useCommissionStats,
  useUpdateCategoryCommissionRate,
} from "@/src/features/commissions/hooks";

import {
  Shirt,
  Sofa,
  Gamepad2,
  Briefcase,
  Heart,
  BookOpen,
  Baby,
  Package,
} from "lucide-react";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

function iconForCategory(name: string) {
  const s = name.toLowerCase();
  if (s.includes("phone") || s.includes("tablet") || s.includes("electronics"))
    return Smartphone;
  if (s.includes("clothing") || s.includes("fashion")) return Shirt;
  if (s.includes("furniture") || s.includes("home") || s.includes("kitchen"))
    return Sofa;
  if (s.includes("gaming")) return Gamepad2;
  if (s.includes("office")) return Briefcase;
  if (s.includes("beauty") || s.includes("health") || s.includes("skincare"))
    return Heart;
  if (s.includes("book") || s.includes("music")) return BookOpen;
  if (s.includes("baby") || s.includes("kids") || s.includes("toys"))
    return Baby;
  return Package;
}

function money(amount: number, currency: string) {
  const symbol =
    currency === "NGN"
      ? "₦"
      : currency === "ZAR"
        ? "R"
        : currency === "USD"
          ? "$"
          : "";
  return `${symbol}${Number(amount ?? 0).toLocaleString()}`;
}

export default function CommissionView() {
  const [currency, setCurrency] = useState("NGN");

  const statsQ = useCommissionStats({ currency });
  const categoriesQ = useCategoryCommissions();
  const updateRate = useUpdateCategoryCommissionRate();

  const rows: CategoryCommissionRow[] = useMemo(() => {
    return (categoriesQ.data ?? []).map((c) => ({
      ...c,
      icon: iconForCategory(c.categoryName),
    }));
  }, [categoriesQ.data]);

  const columns = useMemo(
    () =>
      getCommissionColumns({
        onUpdate: (categoryId, newRate) =>
          updateRate.mutate({ categoryId, commissionRate: newRate }),
        isUpdating: updateRate.isPending,
      }),
    [updateRate],
  );

  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            Platform / Commission Rates
          </h1>
        </div>

        {/* Optional currency switch; stats supports currency */}
        <div className="flex items-center gap-3">
          <Button
            variant={currency === "NGN" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrency("NGN")}
            className="h-9 text-xs font-bold uppercase tracking-wider"
          >
            NGN
          </Button>
          <Button
            variant={currency === "ZAR" ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrency("ZAR")}
            className="h-9 text-xs font-bold uppercase tracking-wider"
          >
            ZAR
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-8 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Commission Revenue"
            value={
              statsQ.isLoading
                ? "—"
                : money(
                    statsQ.data?.totalCommissionRevenue ?? 0,
                    statsQ.data?.currency ?? currency,
                  )
            }
            icon={DollarSign}
            variant="default"
          />
          <StatCard
            label="Avg. Platform Rate"
            value={
              statsQ.isLoading
                ? "—"
                : `${statsQ.data?.averagePlatformRate ?? 0}%`
            }
            icon={PieChart}
            variant="indigo"
          />
          <StatCard
            label="Highest Earner"
            value={
              statsQ.isLoading
                ? "—"
                : (statsQ.data?.highestEarningCategory ?? "—")
            }
            icon={Smartphone}
            variant="gold"
          />
        </div>

        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-4 shadow-sm">
          <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600 shrink-0">
            <Settings size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest">
              Pricing Strategy Note
            </h3>
            <p className="text-xs text-indigo-700 mt-1.5 leading-relaxed max-w-3xl">
              Adjusting a category commission rate affects only new transactions
              after the update.
            </p>
          </div>
        </div>

        <Tabs defaultValue="active" className="w-full flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200">
            <FilterTabs
              tabs={[
                {
                  value: "active",
                  label: "Categories",
                  count: rows.length,
                  variant: "emerald",
                },
              ]}
            />
          </div>

          <TabsContent value="active">
            {categoriesQ.isLoading ? (
              <TableSkeleton
                columns={columns.length}
                rows={10}
                withToolbar={false}
              />
            ) : categoriesQ.isError ? (
              <div className="p-6 text-sm text-rose-600">
                Failed to load categories.
              </div>
            ) : (
              <DataTable columns={columns} data={rows} />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
