"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { RefreshCw, Map } from "lucide-react";
import { CURRENCIES, GEO_CURRENCY_MAPPING } from "@/src/lib/dummy_data";
import { currencyColumns } from "./column";
import { CurrencyFormModal } from "./actions";

export default function CurrenciesView() {
  return (
    <div className="min-h-screen bg-sax-body text-zinc-900 font-sans pb-10">
      {/* HEADER */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-zinc-500 hover:text-zinc-900" />
          <div className="h-6 w-px bg-zinc-200" />
          <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-900 font-display">
            System / Currencies
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-3 w-3" /> Sync Rates
          </Button>
          <CurrencyFormModal />
        </div>
      </header>

      <main className="p-6 max-w-400 mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: CURRENCY LIST (8/12) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-zinc-200 bg-zinc-50">
                <h3 className="tech-label">Supported Currencies</h3>
              </div>
              <DataTable columns={currencyColumns} data={CURRENCIES} />
            </div>
          </div>

          {/* RIGHT: GEO MAPPING (4/12) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4 text-zinc-900">
                <Map size={16} />
                <h3 className="tech-label text-zinc-900">Geo-Mapping Rules</h3>
              </div>
              <p className="text-xs text-zinc-500 mb-6">
                Define which currency is shown automatically based on user IP
                location.
              </p>

              <div className="space-y-2">
                {GEO_CURRENCY_MAPPING.map((rule, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 border border-zinc-100 rounded-md bg-zinc-50/50"
                  >
                    <span className="text-xs font-bold text-zinc-700">
                      {rule.country}
                    </span>
                    <span className="font-mono text-xs font-bold text-sax-gold bg-sax-gold-light px-2 py-0.5 rounded border border-[#FEF08A]">
                      {rule.currency}
                    </span>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-6 text-xs h-8">
                Manage Locations
              </Button>
            </div>

            {/* FORMATTING PREVIEW */}
            <div className="bg-sax-black text-white border border-zinc-900 rounded-lg p-6 shadow-sm">
              <h3 className="tech-label text-zinc-500 mb-4">Display Preview</h3>
              <div className="space-y-3 font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-xs">USD</span>
                  <span>$1,250.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-xs">NGN</span>
                  <span>₦1,500,625</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 text-xs">ZAR</span>
                  <span>R 22,812</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
