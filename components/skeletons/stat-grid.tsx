"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function StatsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-zinc-200 rounded-lg shadow-sm p-4"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-28 rounded" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>

          <Skeleton className="h-8 w-32 mt-4 rounded" />
          <Skeleton className="h-3 w-24 mt-2 rounded" />
        </div>
      ))}
    </div>
  );
}