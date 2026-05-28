"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "./table-skeleton";
import { PageHeaderSkeleton } from "./header";
import { TabsSkeleton } from "./tabs";

export function DetailsPageSkeleton({
  headerActions = 2,
  topCards = 3,
}: {
  headerActions?: number;
  topCards?: number;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans pb-10">
      <PageHeaderSkeleton actions={headerActions} />

      <main className="p-6 max-w-7xl mx-auto space-y-8 mt-2">
        {/* Top cards (profile + wallet + metrics) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {Array.from({ length: topCards }).map((_, i) => (
            <div
              key={i}
              className={`bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm ${
                topCards === 3
                  ? i === 0
                    ? "lg:col-span-4"
                    : i === 1
                      ? "lg:col-span-4"
                      : "lg:col-span-4"
                  : "lg:col-span-4"
              }`}
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>

        {/* Tabs + content skeleton */}
        <div className="space-y-6">
          <TabsSkeleton tabs={3} />
          <TableSkeleton columns={6} rows={10} withToolbar />
        </div>
      </main>
    </div>
  );
}
