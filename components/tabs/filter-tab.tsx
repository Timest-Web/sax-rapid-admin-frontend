"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const triggerVariants = {
  default: {
    active:
      "data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=active]:shadow-sm",
    badge: "bg-zinc-200 text-zinc-700 group-data-[state=active]:bg-zinc-700 group-data-[state=active]:text-white",
  },
  amber: {
    active:
      "data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm",
    badge: "bg-amber-200 text-amber-800 group-data-[state=active]:bg-amber-600 group-data-[state=active]:text-white",
  },
  rose: {
    active:
      "data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-sm",
    badge: "bg-rose-200 text-rose-800 group-data-[state=active]:bg-rose-600 group-data-[state=active]:text-white",
  },
  emerald: {
    active:
      "data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-sm",
    badge: "bg-emerald-200 text-emerald-800 group-data-[state=active]:bg-emerald-600 group-data-[state=active]:text-white",
  },
  indigo: {
    active:
      "data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-sm",
    badge: "bg-indigo-200 text-indigo-800 group-data-[state=active]:bg-indigo-600 group-data-[state=active]:text-white",
  },
  violet: {
    active:
      "data-[state=active]:bg-violet-500 data-[state=active]:text-white data-[state=active]:shadow-sm",
    badge: "bg-violet-200 text-violet-800 group-data-[state=active]:bg-violet-600 group-data-[state=active]:text-white",
  },
} as const;

type TriggerVariant = keyof typeof triggerVariants;

export interface FilterTab {
  value: string;
  label: string;
  count?: number;
  variant?: TriggerVariant;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  className?: string;
}

export function FilterTabs({ tabs, className }: FilterTabsProps) {
  return (
    <TabsList
      className={cn(
        "bg-white border border-zinc-200 h-10 p-1 gap-1",
        className
      )}
    >
      {tabs.map((tab) => {
        const theme = triggerVariants[tab.variant ?? "default"];

        return (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "group text-xs uppercase tracking-wide font-semibold rounded-md transition-all duration-200",
              "text-zinc-500 hover:text-zinc-700",
              theme.active
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "ml-2 min-w-4.5 h-4.5 px-1 inline-flex items-center justify-center rounded-full text-[10px] font-bold transition-colors duration-200",
                  theme.badge
                )}
              >
                {tab.count}
              </span>
            )}
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}