"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PageHeaderSkeleton({ actions = 2 }: { actions?: number }) {
  return (
    <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 bg-white sticky top-0 z-10">
      <div className="flex items-center gap-4 min-w-0">
        <Skeleton className="h-8 w-8 rounded-md" />
        <div className="h-6 w-px bg-zinc-200" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-56" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      <div className="flex gap-2">
        {Array.from({ length: actions }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-lg" />
        ))}
      </div>
    </header>
  );
}