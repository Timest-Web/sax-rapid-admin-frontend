"use client";

import { Search, Filter, X } from "lucide-react";
import { Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface FilterOption {
  columnId: string; // The accessorKey in your column definition
  title: string;    // Display name for the filter section
  options: {
    label: string;
    value: string;
  }[];
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  filters?: FilterOption[]; // <--- New optional prop
}

export function DataTableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
  filters = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-2 rounded-lg border border-zinc-200 shadow-sm">
      {/* SEARCH BAR */}
      <div className="flex items-center px-3 h-10 bg-zinc-50 border border-zinc-200 w-full sm:w-96 rounded-md focus-within:border-zinc-400 transition-colors">
        <Search size={14} className="text-zinc-400" />
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="bg-transparent border-none outline-none text-xs ml-2 w-full text-zinc-900 placeholder-zinc-400 font-mono"
          placeholder="SEARCH RECORDS..."
        />
      </div>

      {/* ACTIONS (FILTER & CLEAR) */}
      <div className="flex items-center gap-2">
        {/* Reset Filters Button */}
        {isFiltered && (
          <button
            onClick={() => table.resetColumnFilters()}
            className="px-3 h-9 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-red-600 transition-colors flex items-center gap-2"
          >
            <X size={12} /> Clear
          </button>
        )}

        {/* Dynamic Filter Dropdown */}
        {filters.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-4 h-9 text-[10px] font-bold uppercase tracking-wider border border-zinc-200 bg-white hover:border-[#EAB308] hover:text-[#EAB308] transition-colors flex items-center gap-2 rounded-md">
                <Filter size={12} /> Filter
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border-zinc-200">
              {filters.map((filter, index) => {
                const column = table.getColumn(filter.columnId);
                if (!column) return null;

                return (
                  <div key={filter.columnId}>
                    {index > 0 && <DropdownMenuSeparator />}
                    <DropdownMenuLabel className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      {filter.title}
                    </DropdownMenuLabel>
                    
                    {filter.options.map((option) => {
                      // Using single-select per category to ensure it works natively with TanStack's default text filter
                      const isSelected = column.getFilterValue() === option.value;
                      
                      return (
                        <DropdownMenuCheckboxItem
                          key={option.value}
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            column.setFilterValue(checked ? option.value : undefined);
                          }}
                          className="text-xs cursor-pointer"
                        >
                          {option.label}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                  </div>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}