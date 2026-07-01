"use client";

import { useMemo } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/data-table/data-table";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

import { currencyColumns } from "./column";
import { CurrencyFormModal } from "./actions";
import { mapCurrencyDtoToRow, type CurrencyRow } from "./mapper";
import { useSystemCurrencies } from "@/src/features/currencies/hooks";

export default function CurrenciesView() {
  const currenciesQ = useSystemCurrencies();

  const rows = useMemo<CurrencyRow[]>(() => {
    return (currenciesQ.data ?? []).map(mapCurrencyDtoToRow);
  }, [currenciesQ.data]);

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => currenciesQ.refetch()}
            disabled={currenciesQ.isFetching}
          >
            <RefreshCw
              className={`mr-2 h-3 w-3 ${currenciesQ.isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <CurrencyFormModal />
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-zinc-200 bg-zinc-50">
            <h3 className="tech-label">Supported Currencies</h3>
          </div>

          <DataTable<CurrencyRow, unknown>
            columns={currencyColumns}
            data={rows}
          />
        </div>

        {currenciesQ.isError && (
          <div className="text-sm text-rose-600">Failed to load currencies.</div>
        )}
      </main>
    </div>
  );
}