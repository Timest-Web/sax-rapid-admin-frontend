"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-zinc-200/70",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.4s_infinite]",
        "before:bg-linear-to-r before:from-transparent before:via-white/50 before:to-transparent",
        className,
      )}
    />
  );
}