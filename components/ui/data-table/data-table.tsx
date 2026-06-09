/* eslint-disable react-hooks/incompatible-library */
"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { DataTableToolbar, FilterOption } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filters?: FilterOption[]; // <--- Accept filters from parent
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filters,
}: DataTableProps<TData, TValue>) {
  const memoizedData = React.useMemo(() => data, [data]);
  const memoizedColumns = React.useMemo(() => columns, [columns]);

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]); // <--- New State

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      columnFilters, // <--- Apply state
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters, // <--- Handle changes
  });

 return (
  <div className="space-y-4">
    {/* Toolbar */}
    <DataTableToolbar
      table={table}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      filters={filters}
    />

    {/* Table */}
    <div className="rounded-xl border border-zinc-200/70 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        {/* give the scroll container a max height only if you want sticky header effect */}
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="
                        border-b border-zinc-200/70
                        px-4 py-3
                        text-[11px] font-semibold text-zinc-500
                        uppercase tracking-wide
                        first:pl-6 last:pr-6
                        whitespace-nowrap
                        bg-white
                      "
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-zinc-100">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={[
                      "transition-colors",
                      idx % 2 === 0 ? "bg-white" : "bg-zinc-50/40",
                      "hover:bg-zinc-50",
                    ].join(" ")}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="
                          px-4 py-3
                          text-sm text-zinc-700
                          first:pl-6 last:pr-6
                          align-middle
                        "
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-16">
                    <div className="text-center">
                      <div className="text-sm font-medium text-zinc-900">
                        No results
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        Try adjusting your search or filters.
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="border-t border-zinc-200/70 bg-white">
        <DataTablePagination table={table} />
      </div>
    </div>
  </div>
);
}