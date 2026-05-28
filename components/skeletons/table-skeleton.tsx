"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({
  columns = 6,
  rows = 10,
  withToolbar = true,
}: {
  columns?: number;
  rows?: number;
  withToolbar?: boolean;
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
      {withToolbar && (
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between gap-3">
          <Skeleton className="h-3 w-40" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-52 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
        </div>
      )}

      {/* header */}
      <div className="px-6 py-4 border-b border-zinc-100">
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-full" />
          ))}
        </div>
      </div>

      {/* rows */}
      <div className="divide-y divide-zinc-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="px-6 py-4">
            <div
              className="grid gap-4 items-center"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: columns }).map((_, c) => (
                <Skeleton
                  key={c}
                  className={c === 0 ? "h-4 w-3/4" : "h-4 w-full"}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}