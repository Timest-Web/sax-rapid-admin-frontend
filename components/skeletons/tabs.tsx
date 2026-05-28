"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TabsSkeleton({ tabs = 3 }: { tabs?: number }) {
  return (
    <div className="flex justify-center mb-6">
      <div className="bg-zinc-200/50 p-1 h-12 rounded-full inline-flex gap-2">
        {Array.from({ length: tabs }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-full bg-white/70" />
        ))}
      </div>
    </div>
  );
}