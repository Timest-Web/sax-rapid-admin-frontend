import { LucideIcon } from "lucide-react";

const variants = {
  default: {
    gradient: "from-slate-50 via-zinc-50 to-stone-100",
    border: "border-zinc-200 hover:border-zinc-300",
    iconBg: "bg-zinc-100 border-zinc-200/60",
    iconColor: "text-zinc-600",
  },
  gold: {
    gradient: "from-yellow-50 via-amber-50 to-orange-100",
    border: "border-amber-200/60 hover:border-amber-300/80",
    iconBg: "bg-amber-100 border-amber-200/60",
    iconColor: "text-amber-600",
  },
  indigo: {
    gradient: "from-slate-50 via-blue-50 to-indigo-100",
    border: "border-indigo-200/60 hover:border-indigo-300/80",
    iconBg: "bg-indigo-100 border-indigo-200/60",
    iconColor: "text-indigo-600",
  },
  emerald: {
    gradient: "from-green-50 via-emerald-50 to-teal-100",
    border: "border-emerald-200/60 hover:border-emerald-300/80",
    iconBg: "bg-emerald-100 border-emerald-200/60",
    iconColor: "text-emerald-600",
  },
  amber: {
    gradient: "from-orange-50 via-amber-50 to-yellow-100",
    border: "border-amber-200/60 hover:border-amber-300/80",
    iconBg: "bg-amber-100 border-amber-200/60",
    iconColor: "text-amber-700",
  },
  rose: {
    gradient: "from-red-50 via-rose-50 to-pink-100",
    border: "border-rose-200/60 hover:border-rose-300/80",
    iconBg: "bg-rose-100 border-rose-200/60",
    iconColor: "text-rose-600",
  },
  violet: {
    gradient: "from-violet-50 via-purple-50 to-fuchsia-100",
    border: "border-violet-200/60 hover:border-violet-300/80",
    iconBg: "bg-violet-100 border-violet-200/60",
    iconColor: "text-violet-600",
  },
  cyan: {
    gradient: "from-cyan-50 via-sky-50 to-blue-100",
    border: "border-sky-200/60 hover:border-sky-300/80",
    iconBg: "bg-sky-100 border-sky-200/60",
    iconColor: "text-sky-600",
  },
} as const;

type StatCardVariant = keyof typeof variants;

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color?: string;
  variant?: StatCardVariant;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  color,
  variant = "default",
}: StatCardProps) {
  const theme = variants[variant];

  return (
    <div
      className={`bg-gradient-to-br ${theme.gradient} border ${theme.border} p-6 rounded-xl flex items-center justify-between hover:shadow-md transition-all duration-200`}
    >
      {/* Left Side: Label & Value */}
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 font-mono">
          {label}
        </h3>
        <p
          className={`${color ?? theme.iconColor} text-2xl font-bold tracking-tight mt-1 font-mono`}
        >
          {value}
        </p>
      </div>

      {/* Right Side: Icon Box */}
      <div
        className={`h-10 w-10 rounded-lg ${theme.iconBg} border flex items-center justify-center ${theme.iconColor}`}
      >
        <Icon size={20} />
      </div>
    </div>
  );
}
