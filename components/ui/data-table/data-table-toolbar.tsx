"use client";

import { Search, Filter, Download } from "lucide-react";
import { Table } from "@tanstack/react-table";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export function DataTableToolbar<TData>({
  globalFilter,
  setGlobalFilter,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-2 rounded-lg border border-zinc-200 shadow-sm">
      <div className="flex items-center px-3 h-10 bg-zinc-50 border border-zinc-200 w-full sm:w-96 rounded-md focus-within:border-zinc-400 transition-colors">
        <Search size={14} className="text-zinc-400" />
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="bg-transparent border-none outline-none text-xs ml-2 w-full text-zinc-900 placeholder-zinc-400 font-mono"
          placeholder="SEARCH RECORDS..."
        />
      </div>
      <div className="flex gap-2">
        <button className="px-4 h-9 text-[10px] font-bold uppercase tracking-wider border border-zinc-200 bg-white hover:border-[#EAB308] hover:text-[#EAB308] transition-colors flex items-center gap-2 rounded-md">
          <Filter size={12} /> Filter
        </button>
        <button className="px-4 h-9 text-[10px] font-bold uppercase tracking-wider border border-zinc-200 bg-white hover:border-[#EAB308] hover:text-[#EAB308] transition-colors flex items-center gap-2 rounded-md">
          <Download size={12} /> Export
        </button>
      </div>
    </div>
  );
}
