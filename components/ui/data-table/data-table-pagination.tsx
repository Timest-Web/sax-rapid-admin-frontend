"use client";

import { Table } from "@tanstack/react-table";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between p-4 border-t border-zinc-200 bg-zinc-50/50">
      <p className="text-[10px] font-mono text-zinc-500 uppercase">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 bg-white border border-zinc-200 rounded text-[10px] font-bold text-zinc-500 hover:border-zinc-300 disabled:opacity-50"
        >
          PREV
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 bg-white border border-zinc-200 rounded text-[10px] font-bold text-zinc-500 hover:border-zinc-300 disabled:opacity-50"
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
