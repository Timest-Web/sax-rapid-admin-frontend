import { TabsTrigger } from "@/components/ui/tabs";
import { LucideIcon } from "lucide-react";

export function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3 text-zinc-500">
        <Icon
          size={14}
          className="text-zinc-400 group-hover:text-zinc-900 transition-colors"
        />
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <span className="font-mono text-zinc-900 text-xs font-medium text-right">
        {value}
      </span>
    </div>
  );
}

export function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-zinc-200 p-4 rounded-lg">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
        {label}
      </p>
      <p className="text-xl font-bold font-mono text-zinc-900">{value}</p>
    </div>
  );
}

export function TabItem({ value, label }: { value: string; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="rounded-none border-b-2 border-transparent px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 data-[state=active]:border-[#EAB308] data-[state=active]:text-zinc-900 data-[state=active]:bg-transparent transition-all"
    >
      {label}
    </TabsTrigger>
  );
}