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

type MetricCardVariant = keyof typeof variants;

export default function MetricCard({
  label,
  value,
  icon: Icon,
  variant = "default",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  variant?: MetricCardVariant;
}) {
  const theme = variants[variant];

  return (
    <div
      className={`flex-1 bg-linear-to-br ${theme.gradient} border ${theme.border} rounded-lg px-5 flex items-center justify-between shadow-sm min-h-17.5 hover:shadow-md transition-all duration-200`}
    >
      <div className="flex flex-col">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          {label}
        </p>
        <p className={`text-xl font-bold font-mono ${theme.iconColor}`}>
          {value}
        </p>
      </div>
      <div
        className={`h-8 w-8 rounded-lg ${theme.iconBg} border flex items-center justify-center ${theme.iconColor}`}
      >
        <Icon className="h-4 w-4" />
      </div>
    </div>
  );
}