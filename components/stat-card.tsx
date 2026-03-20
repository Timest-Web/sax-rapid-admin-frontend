import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color?: string;
}

export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white border border-zinc-200 p-6 rounded-xl flex items-center justify-between hover:border-zinc-300 hover:shadow-sm transition-all duration-200">
      {/* Left Side: Label & Value */}
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 font-mono">
          {label}
        </h3>
        <p
          className={`${color} text-2xl font-bold tracking-tight mt-1 font-mono`}
        >
          {value}
        </p>
      </div>

      {/* Right Side: Icon Box */}
      <div className="h-10 w-10 rounded-lg bg-yellow-50 border border-yellow-100 flex items-center justify-center text-[#CA8A04]">
        <Icon size={20} />
      </div>
    </div>
  );
}
