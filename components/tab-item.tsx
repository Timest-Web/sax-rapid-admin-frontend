import { TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils"; // standard shadcn utility

interface TabItemProps {
  value: string;
  label: string;
  count?: number;
  countColor?: string; // e.g. "bg-amber-200 text-amber-800"
}

export function TabItem({ value, label, count, countColor }: TabItemProps) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        "rounded-none border-b-2 border-transparent px-6 py-2",
        "text-xs font-bold uppercase tracking-widest text-zinc-400",
        "data-[state=active]:border-sax-gold data-[state=active]:text-zinc-900 data-[state=active]:bg-transparent",
        "transition-all hover:text-zinc-600",
        "flex items-center gap-2",
      )}
    >
      {label}
      {count !== undefined && (
        <span
          className={cn(
            "ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono",
            countColor || "bg-zinc-100 text-zinc-600",
          )}
        >
          {count}
        </span>
      )}
    </TabsTrigger>
  );
}
